package com.spring.classon.member.service;

import com.spring.classon.member.dto.MyPageResponseDTO;
import com.spring.classon.member.mapper.MyPageMapper;
import com.spring.classon.member.repository.MyPageRepository;
import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.payment.entity.Payment;
import com.spring.classon.review.entity.Review;
import com.spring.classon.inquiry.entity.Inquiry;
import com.spring.classon.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {

    private final MyPageRepository myPageRepository;
    private final MyPageMapper myPageMapper;

    @Override
    public MyPageResponseDTO getMyPage(Long memNo) {

        // 내가 수강하는 클래스
        List<OneDay> myClasses =
                myPageRepository.findMyClasses(memNo);
        // 내가 찜한 클래스
        List<OneDay> myFavorites =
                myPageRepository.findMyFavorites(memNo);
        // 나의 예약 및 결제
        List<Payment> myReservations =
                myPageRepository.findMyReservations(memNo);
        // 나의 후기
        List<Review> myReviews =
                myPageRepository.findMyReviews(memNo);
        // 내 문의
        List<Inquiry> myInquiries =
                myPageRepository.findMyInquiries(memNo);

        // 내가 강의하는 클래스
        List<OneDay> myTeachingClasses =
                myPageRepository.findMyTeachingClasses(memNo);
        // 내가 강의하는 수업 예약 회원 조회
        List<Member> reservationMembers =
                myPageRepository.findReservationMembers(memNo);
        // 내가 강의하는 수업 후기
        List<Review> classReviews =
                myPageRepository.findClassReviews(memNo);

        return MyPageResponseDTO.builder()
                .myClasses(myClasses.stream()
                        .map(myPageMapper::toClassInfo)
                        .toList())
                .myFavorites(myFavorites.stream()
                        .map(myPageMapper::toClassInfo)
                        .toList())
                .myReservations(myReservations.stream()
                        .map(myPageMapper::toReservationInfo)
                        .toList())
                .myReviews(myReviews.stream()
                        .map(myPageMapper::toReviewInfo)
                        .toList())
                .myInquiries(myInquiries.stream()
                        .map(myPageMapper::toInquiryInfo)
                        .toList())
                .myTeachingClasses(myTeachingClasses.stream()
                        .map(myPageMapper::toClassInfo)
                        .toList())
                .reservationMembers(reservationMembers.stream()
                        .map(myPageMapper::toMemberInfo)
                        .toList())
                .classReviews(classReviews.stream()
                        .map(myPageMapper::toReviewInfo)
                        .toList())
                .build();
    }
}