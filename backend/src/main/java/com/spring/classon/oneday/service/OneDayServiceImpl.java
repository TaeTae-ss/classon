package com.spring.classon.oneday.service;

import com.spring.classon.common.dto.PageRequestDTO;
import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.common.exception.InstructorPermissionException;
import com.spring.classon.member.dto.MemberSummaryDTO;
import com.spring.classon.member.service.MemberService;
import com.spring.classon.oneday.dto.ProductDetailResponseDTO;
import com.spring.classon.oneday.dto.ProductRequestDTO;
import com.spring.classon.oneday.dto.ProductResponseDTO;
import com.spring.classon.oneday.entity.Category;
import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.oneday.exception.CategoryNotFoundException;
import com.spring.classon.oneday.exception.OneDayNotFoundException;
import com.spring.classon.oneday.exception.OneDayUpdateNotAllowedException;
import com.spring.classon.oneday.mapper.ProductMapper;
import com.spring.classon.oneday.repository.CategoryRepository;
import com.spring.classon.oneday.repository.OneDayRepository;
import com.spring.classon.oneday.repository.ScheduleRepository;
import com.spring.classon.oneday.status.OneDayStatus;
import com.spring.classon.oneday.util.ProductImagePaths;
import com.spring.classon.oneday.util.ProductImageStorage;
import com.spring.classon.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OneDayServiceImpl implements OneDayService {

    private final OneDayRepository oneDayRepository;
    private final CategoryRepository categoryRepository;
    private final MemberService memberService;
    private final ReviewService reviewService;
    private final ScheduleRepository scheduleRepository;
    private final ProductMapper productMapper;
    private final ProductImageStorage productImageStorage;

    // 상품 목록 조회 (categoryId 없으면 전체 조회)
    @Override
    public PageResponseDTO<ProductResponseDTO> findProducts(Long categoryId, PageRequestDTO pageRequestDTO) {

        Pageable pageable = pageRequestDTO.getPageable("clsCreatedAt");

        Page<OneDay> result;

        if (categoryId != null) {
            categoryRepository.findById(categoryId)
                    .orElseThrow(CategoryNotFoundException::new);

            result = oneDayRepository.findByCatNoAndClsStatus(categoryId, OneDayStatus.RECRUITING, pageable);

        } else {
            result = oneDayRepository.findByClsStatus(OneDayStatus.RECRUITING, pageable);
        }

        List<OneDay> oneDays = result.getContent();

        List<Long> memNos = oneDays.stream().map(OneDay::getMemNo).distinct().toList();
        List<Long> clsNos = oneDays.stream().map(OneDay::getClsNo).toList();

        Map<Long, String> instructorNameMap = memNos.isEmpty()
                ? Map.of()
                : memberService.getMemberSummaries(memNos).stream()
                        .collect(Collectors.toMap(MemberSummaryDTO::getMemNo, MemberSummaryDTO::getMemNickname));

        Map<Long, Double> ratingMap = reviewService.getAverageRatings(clsNos);

        List<ProductResponseDTO> dtoList =
                productMapper.toDTOList(oneDays, instructorNameMap, ratingMap);

        return new PageResponseDTO<>(dtoList, pageRequestDTO, result.getTotalElements());
    }

    // 상품 상세 조회
    @Override
    public ProductDetailResponseDTO getProductDetail(Long clsNo) {

        OneDay oneDay = oneDayRepository.findById(clsNo)
                .orElseThrow(OneDayNotFoundException::new);

        Category category = categoryRepository.findById(oneDay.getCatNo())
                .orElseThrow(CategoryNotFoundException::new);

        MemberSummaryDTO instructor = memberService.getMemberSummary(oneDay.getMemNo());

        Integer maxCapacity = scheduleRepository.findByClsNo(clsNo).stream()
                .map(schedule -> schedule.getSchCapacity())
                .max(Integer::compareTo)
                .orElse(null);

        Double rating = reviewService.getAverageRating(clsNo);

        return ProductDetailResponseDTO.builder()
                .clsNo(oneDay.getClsNo())
                .clsName(oneDay.getClsName())
                .catName(category.getCatName())
                .instructorName(instructor.getMemNickname())
                .maxCapacity(maxCapacity)
                .rating(rating)
                .clsPrice(oneDay.getClsPrice())
                .clsDesc(oneDay.getClsDesc())
                .clsRoadAddr(oneDay.getClsRoadAddr())
                .clsDetailAddr(oneDay.getClsDetailAddr())
                .build();
    }

    // 상품 등록
    @Override
    @Transactional
    public Long registerProduct(Long memNo, ProductRequestDTO dto, MultipartFile image) {

        MemberSummaryDTO member = memberService.getMemberSummary(memNo);

        if (!List.of("INSTRUCTOR", "ADMIN").contains(member.getMemRole())) {
            throw new InstructorPermissionException();
        }

        categoryRepository.findById(dto.getCatNo())
                .orElseThrow(CategoryNotFoundException::new);

        ProductImagePaths imagePaths = productImageStorage.store(image);

        OneDay oneDay = productMapper.toEntity(
                dto, memNo, imagePaths.clsImgOrigin(), imagePaths.clsImgThumb()
        );

        return oneDayRepository.save(oneDay).getClsNo();
    }

    // 상품 수정
    @Override
    @Transactional
    public void updateProduct(Long memNo, Long clsNo, ProductRequestDTO dto, MultipartFile image) {

        OneDay oneDay = oneDayRepository.findById(clsNo)
                .orElseThrow(OneDayNotFoundException::new);

        checkOwnerOrAdmin(oneDay, memNo);

        if (oneDay.getClsStatus() == OneDayStatus.ENDED) {
            throw new OneDayUpdateNotAllowedException();
        }

        categoryRepository.findById(dto.getCatNo())
                .orElseThrow(CategoryNotFoundException::new);

        oneDay.update(
                dto.getCatNo(), dto.getClsName(), dto.getClsDesc(), dto.getClsPrice(),
                dto.getClsRoadAddr(), dto.getClsDetailAddr(), dto.getClsLevel(), dto.getClsDuration()
        );

        if (image != null && !image.isEmpty()) {
            ProductImagePaths imagePaths = productImageStorage.store(image);
            oneDay.updateImages(imagePaths.clsImgOrigin(), imagePaths.clsImgThumb());
        }
    }

    // 클래스 소유자(강사) 또는 관리자 확인
    private void checkOwnerOrAdmin(OneDay oneDay, Long memNo) {

        MemberSummaryDTO member = memberService.getMemberSummary(memNo);

        boolean isOwner = oneDay.getMemNo().equals(memNo);
        boolean isAdmin = "ADMIN".equals(member.getMemRole());

        if (!isOwner && !isAdmin) {
            throw new InstructorPermissionException();
        }
    }
}
