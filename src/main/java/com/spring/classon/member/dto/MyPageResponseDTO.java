package com.spring.classon.member.dto;

import lombok.*;
import java.time.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPageResponseDTO {

    // 내가 수강하는 클래스
    private List<ClassInfo> myClasses;

    // 내가 찜한 클래스
    private List<ClassInfo> myFavorites;

    // 예약 및 결제내역
    private List<ReservationInfo> myReservations;

    // 내가 작성한 후기
    private List<ReviewInfo> myReviews;

    // 문의 및 신고 내역
    private List<InquiryInfo> myInquiries;

    // 내가 강의하는 클래스
    private List<ClassInfo> myTeachingClasses;

    // 예약 회원 정보
    private List<MemberInfo> reservationMembers;

    // 강사 후기
    private List<ReviewInfo> classReviews;


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClassInfo {
        private Long clsNo;
        private String clsName;
        private String clsImgThumb;
        private Integer clsPrice;
        private String clsRoadAddr;
        private String clsDetailAddr;
        private Long schNo;
        private LocalDate schStartDate;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationInfo {
        private Long rsvNo;
        private Long clsNo;
        private String clsName;
        private LocalDate schStartDate;
        private Integer rsvCount;
        private Integer rsvAmount;
        private String rsvStatus;
        private Long payNo;
        private String orderNo;
        private String payMethod;
        private Integer payAmount;
        private String payStatus;
        private LocalDateTime payCreatedAt;
        private LocalDateTime payPaidAt;
        private LocalDateTime payCanceledAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewInfo {
        private Long revNo;
        private Long clsNo;
        private String clsName;
        private Integer revRating;
        private String revContent;
        private LocalDateTime revCreatedAt;
        private String revStatus;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InquiryInfo {
        private Long inqNo;
        private String inqTitle;
        private String inqContent;
        private String inqStatus;
        private LocalDateTime inqCreatedAt;
        private String admComment;
        private LocalDateTime proCreatedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemberInfo {
        private Long memNo;
        private String memNickname;
        private String memImg;
        private String memEmail;
        private String memPhone;
    }
}