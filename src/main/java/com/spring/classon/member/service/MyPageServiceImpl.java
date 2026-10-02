package com.spring.classon.member.service;

import com.spring.classon.member.dto.MyPageResponseDTO;
import com.spring.classon.member.repository.MyPageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {

    private final MyPageRepository myPageRepository;

    @Override
    public MyPageResponseDTO getMyPage(Long memNo) {

        // 내가 수강하는 클래스
        var myClasses = myPageRepository.findMyClasses(memNo);
        // 내가 찜한 클래스
        var myFavorites = myPageRepository.findMyFavorites(memNo);
        // 나의 예약 및 결제
        var myReservations = myPageRepository.findMyReservations(memNo);
        // 나의 후기
        var myReviews = myPageRepository.findMyReviews(memNo);
        // 내 문의
        var myInquiries = myPageRepository.findMyInquiries(memNo);
        // 내가 강의하는 클래스
        var myTeachingClasses =
                myPageRepository.findMyTeachingClasses(memNo);
        // 내가 강의하는 수업 예약 회원 조회
        var reservationMembers =
                myPageRepository.findReservationMembers(memNo);
        // 내가 강의하는 수업 후기
        var classReviews =
                myPageRepository.findClassReviews(memNo);

        return MyPageResponseDTO.builder()
                .myClasses(myClasses)
                .myFavorites(myFavorites)
                .myReservations(myReservations)
                .myReviews(myReviews)
                .myInquiries(myInquiries)
                .myTeachingClasses(myTeachingClasses)
                .reservationMembers(reservationMembers)
                .classReviews(classReviews)
                .build();
    }
}