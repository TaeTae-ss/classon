package com.spring.classon.favorite.service;

import com.spring.classon.favorite.dto.FavoriteDTO;
import com.spring.classon.favorite.entity.Favorite;
import com.spring.classon.favorite.mapper.FavoriteMapper;
import com.spring.classon.favorite.repository.FavoriteRepository;
import com.spring.classon.oneday.repository.OneDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.oneday.entity.Category;
import com.spring.classon.oneday.mapper.ProductMapper;
import com.spring.classon.oneday.repository.CategoryRepository;
import com.spring.classon.member.dto.MemberSummaryDTO;
import com.spring.classon.member.service.MemberService;
import com.spring.classon.review.service.ReviewService;
import com.spring.classon.oneday.entity.Schedule;
import com.spring.classon.oneday.repository.ScheduleRepository;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService{
    private final FavoriteRepository favoriteRepository;
    private final FavoriteMapper favoriteMapper;
    private final OneDayRepository oneDayRepository;
    private final CategoryRepository categoryRepository;
    private final MemberService memberService;
    private final ReviewService reviewService;
    private final ProductMapper productMapper;
    private final ScheduleRepository scheduleRepository;

    @Override
    public Long register(FavoriteDTO favoriteDTO){

        boolean exists = favoriteRepository.existsByMemNoAndClsNo(
                favoriteDTO.getMemNo(),
                favoriteDTO.getClsNo()
        );

        if (exists) {
            throw new IllegalStateException("이미 찜한 클래스입니다.");
        }

        Favorite favorite = favoriteMapper.toEntity(favoriteDTO);
        Favorite savedFavorite = favoriteRepository.save(favorite);


        return savedFavorite.getFavNo();
    }

    @Override
    public List<FavoriteDTO> getList(Long memNo) {

        // 로그인 회원의 찜 목록 조회
        List<Favorite> favorites =
                favoriteRepository.findByMemNoOrderByFavNoDesc(memNo);

        List<FavoriteDTO> favoriteDTOList =
                favoriteMapper.toDTOList(favorites);

        if (favorites.isEmpty()) {
            return favoriteDTOList;
        }

        // 찜한 클래스 번호 추출
        List<Long> clsNos = favorites.stream()
                .map(Favorite::getClsNo)
                .distinct()
                .toList();

        // 모집 상태와 관계없이 클래스 조회
        List<OneDay> oneDays = oneDayRepository.findAllById(clsNos);

        List<Long> catNos = oneDays.stream()
                .map(OneDay::getCatNo)
                .distinct()
                .toList();

        List<Long> instructorNos = oneDays.stream()
                .map(OneDay::getMemNo)
                .distinct()
                .toList();

        // 카테고리명, 강사명, 평점 조회
        Map<Long, String> catNameMap = catNos.isEmpty()
                ? Map.of()
                : categoryRepository.findAllById(catNos).stream()
                  .collect(Collectors.toMap(
                          Category::getCatNo,
                          Category::getCatName
                  ));

        Map<Long, String> instructorNameMap = instructorNos.isEmpty()
                ? Map.of()
                : memberService.getMemberSummaries(instructorNos).stream()
                  .collect(Collectors.toMap(
                          MemberSummaryDTO::getMemNo,
                          MemberSummaryDTO::getMemNickname
                  ));

        Map<Long, Double> ratingMap =
                reviewService.getAverageRatings(clsNos);

        // 클래스 정보를 카드용 DTO로 변환
        Map<Long, OneDay> oneDayMap = oneDays.stream()
                .collect(Collectors.toMap(
                        OneDay::getClsNo,
                        Function.identity()
                ));

        ProductMapper.NameLookup names =
                new ProductMapper.NameLookup(catNameMap, instructorNameMap);

        // 각 찜 DTO에 클래스 정보 추가
        for (FavoriteDTO dto : favoriteDTOList) {
            OneDay oneDay = oneDayMap.get(dto.getClsNo());

            if (oneDay != null) {

                // 기존 클래스 카드 정보
                dto.setProduct(
                        productMapper.toDTO(oneDay, names, ratingMap)
                );

                // 비교 페이지에 필요한 추가 정보
                dto.setClsDuration(oneDay.getClsDuration());
                dto.setClsRoadAddr(oneDay.getClsRoadAddr());
                dto.setClsDetailAddr(oneDay.getClsDetailAddr());

                // 클래스 일정 중 최대 정원
                Integer maxCapacity = scheduleRepository
                        .findByClsNo(oneDay.getClsNo())
                        .stream()
                        .map(Schedule::getSchCapacity)
                        .max(Integer::compareTo)
                        .orElse(null);

                dto.setMaxCapacity(maxCapacity);
            }
        }

        return favoriteDTOList;
    }

    @Override
    public void remove(Long favNo, Long memNo) {

        Favorite favorite = favoriteRepository
                .findByFavNoAndMemNo(favNo, memNo)
                .orElseThrow(() ->
                        new IllegalStateException("삭제할 수 없는 찜입니다.")
                );

        favoriteRepository.delete(favorite);
    }




}
