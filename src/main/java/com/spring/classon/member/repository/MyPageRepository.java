package com.spring.classon.member.repository;

import com.spring.classon.member.dto.MyPageResponseDTO;
import com.spring.classon.oneday.entity.OneDay;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import com.spring.classon.member.entity.MemberPrivate;

import java.util.List;

public interface MyPageRepository extends JpaRepository<OneDay, Long> {

    // 회원 전용

    // 내가 수강하는 클래스
    @Query("""
        SELECT new com.spring.classon.member.dto.MyPageResponseDTO$ClassInfo(
            o.clsNo,
            o.clsName,
            o.clsImgThumb,
            o.clsPrice,
            o.clsRoadAddr,
            o.clsDetailAddr,
            s.schNo,
            s.schStartDate
        )
        FROM Reservation r
        JOIN Schedule s ON r.schNo = s.schNo
        JOIN OneDay o ON s.clsNo = o.clsNo
        WHERE r.memNo = :memNo
        ORDER BY s.schStartDate DESC
    """)
    List<MyPageResponseDTO.ClassInfo> findMyClasses(
            @Param("memNo") Long memNo
    );

    // 내가 찜한 클래스
    @Query("""
        SELECT new com.spring.classon.member.dto.MyPageResponseDTO$ClassInfo(
            o.clsNo,
            o.clsName,
            o.clsImgThumb,
            o.clsPrice,
            o.clsRoadAddr,
            o.clsDetailAddr,
            null,
            null
        )
        FROM Favorite f
        JOIN OneDay o ON f.clsNo = o.clsNo
        WHERE f.memNo = :memNo
        ORDER BY f.favNo DESC
    """)
    List<MyPageResponseDTO.ClassInfo> findMyFavorites(
            @Param("memNo") Long memNo
    );

    // 예약 및 결제 내역
    @Query("""
        SELECT new com.spring.classon.member.dto.MyPageResponseDTO$ReservationInfo(
            r.rsvNo,
            o.clsNo,
            o.clsName,
            s.schStartDate,
            r.rsvCount,
            r.rsvAmount,
            r.rsvStatus,
            p.payNo,
            p.orderNo,
            p.payMethod,
            p.payAmount,
            p.payStatus,
            p.payCreatedAt,
            p.payPaidAt,
            p.payCanceledAt
        )
        FROM Payment p
        JOIN p.reservation r
        JOIN Schedule s ON r.schNo = s.schNo
        JOIN OneDay o ON s.clsNo = o.clsNo
        WHERE r.memNo = :memNo
        ORDER BY r.rsvCreatedAt DESC
    """)
    List<MyPageResponseDTO.ReservationInfo> findMyReservations(
            @Param("memNo") Long memNo
    );

    // 내가 작성한 후기
    @Query("""
        SELECT new com.spring.classon.member.dto.MyPageResponseDTO$ReviewInfo(
            rv.revNo,
            rv.clsNo,
            o.clsName,
            rv.revRating,
            rv.revContent,
            rv.revCreatedAt,
            rv.revStatus
        )
        FROM Review rv
        JOIN Reservation r ON rv.rsvNo = r.rsvNo
        JOIN OneDay o ON rv.clsNo = o.clsNo
        WHERE r.memNo = :memNo
        ORDER BY rv.revCreatedAt DESC
    """)
    List<MyPageResponseDTO.ReviewInfo> findMyReviews(
            @Param("memNo") Long memNo
    );

    // 문의 및 신고 내역
    @Query("""
        SELECT new com.spring.classon.member.dto.MyPageResponseDTO$InquiryInfo(
            i.inqNo,
            i.inqTitle,
            i.inqContent,
            i.inqStatus,
            i.inqCreatedAt,
            i.admComment,
            i.proCreatedAt
        )
        FROM Inquiry i
        WHERE i.inqMemNo = :memNo
        ORDER BY i.inqCreatedAt DESC
    """)
    List<MyPageResponseDTO.InquiryInfo> findMyInquiries(
            @Param("memNo") Long memNo
    );

    // 강사 전용

    // 내가 강의하는 클래스
    @Query("""
        SELECT new com.spring.classon.member.dto.MyPageResponseDTO$ClassInfo(
            o.clsNo,
            o.clsName,
            o.clsImgThumb,
            o.clsPrice,
            o.clsRoadAddr,
            o.clsDetailAddr,
            null,
            null
        )
        FROM OneDay o
        WHERE o.memNo = :memNo
        ORDER BY o.clsCreatedAt DESC
    """)
    List<MyPageResponseDTO.ClassInfo> findMyTeachingClasses(
            @Param("memNo") Long memNo
    );

    // 예약 회원 정보
    @Query("""
        SELECT new com.spring.classon.member.dto.MyPageResponseDTO$MemberInfo(
            m.memNo,
            m.memNickname,
            m.memImg,
            mp.memEmail,
            mp.memPhone
        )
        FROM Member m
        JOIN MemberPrivate mp ON m.memNo = mp.memNo
        JOIN Reservation r ON m.memNo = r.memNo
        JOIN Schedule s ON r.schNo = s.schNo
        JOIN OneDay o ON s.clsNo = o.clsNo
        WHERE o.memNo = :memNo
        ORDER BY r.rsvCreatedAt DESC
    """)
    List<MyPageResponseDTO.MemberInfo> findReservationMembers(
            @Param("memNo") Long memNo
    );

    // 강의 후기
    @Query("""
        SELECT new com.spring.classon.member.dto.MyPageResponseDTO$ReviewInfo(
            rv.revNo,
            rv.clsNo,
            o.clsName,
            rv.revRating,
            rv.revContent,
            rv.revCreatedAt,
            rv.revStatus
        )
        FROM Review rv
        JOIN OneDay o ON rv.clsNo = o.clsNo
        WHERE o.memNo = :memNo
        ORDER BY rv.revCreatedAt DESC
    """)
    List<MyPageResponseDTO.ReviewInfo> findClassReviews(
            @Param("memNo") Long memNo
    );
}