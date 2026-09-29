package com.spring.classon.oneday.service;

import com.spring.classon.common.dto.PageRequestDTO;
import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.member.entity.Member;
import com.spring.classon.member.repository.MemberRepository;
import com.spring.classon.oneday.dto.ProductResponseDTO;
import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.oneday.exception.CategoryNotFoundException;
import com.spring.classon.oneday.mapper.ProductMapper;
import com.spring.classon.oneday.repository.CategoryRepository;
import com.spring.classon.oneday.repository.OneDayRepository;
import com.spring.classon.oneday.status.OneDayStatus;
import com.spring.classon.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final OneDayRepository oneDayRepository;
    private final CategoryRepository categoryRepository;
    private final MemberRepository memberRepository;
    private final ReviewRepository reviewRepository;
    private final ProductMapper productMapper;

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
                : memberRepository.findAllById(memNos).stream()
                        .collect(Collectors.toMap(Member::getMemNo, Member::getMemNickname));

        Map<Long, Double> ratingMap = clsNos.isEmpty()
                ? Map.of()
                : reviewRepository.findAvgRatingByClsNos(clsNos).stream()
                        .collect(Collectors.toMap(
                                row -> (Long) row[0],
                                row -> ((Number) row[1]).doubleValue()
                        ));

        List<ProductResponseDTO> dtoList =
                productMapper.toDTOList(oneDays, instructorNameMap, ratingMap);

        return new PageResponseDTO<>(dtoList, pageRequestDTO, result.getTotalElements());
    }
}
