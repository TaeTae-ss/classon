package com.spring.classon.member.mapper;

import com.spring.classon.inquiry.entity.Inquiry;
import com.spring.classon.member.dto.MyPageResponseDTO;
import com.spring.classon.member.entity.Member;
import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.payment.entity.Payment;
import com.spring.classon.review.entity.Review;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MyPageMapper {

    // Entity -> DTO 변환
    // 클래스 변환
    MyPageResponseDTO.ClassInfo toClassInfo(OneDay oneDay);
    // 결제 내역 변환
    MyPageResponseDTO.ReservationInfo toReservationInfo(Payment payment);
    // 후기 변환
    MyPageResponseDTO.ReviewInfo toReviewInfo(Review review);
    // 문의 변환
    MyPageResponseDTO.InquiryInfo toInquiryInfo(Inquiry inquiry);
    // 회원 변환
    MyPageResponseDTO.MemberInfo toMemberInfo(Member member);
}