import com.spring.classon.inquiry.entity.Inquiry;
import com.spring.classon.member.entity.Member;
import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.payment.entity.Payment;
import com.spring.classon.review.entity.Review;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MyPageRepository extends JpaRepository<OneDay, Long> {

    // 회원 전용
    // 내가 수강하는 클래스
    @Query("""
        SELECT o
        FROM Reservation r
        JOIN Schedule s ON r.schNo = s.schNo
        JOIN OneDay o ON s.clsNo = o.clsNo
        WHERE r.memNo = :memNo
        ORDER BY s.schStartDate DESC
    """)
    List<OneDay> findMyClasses(@Param("memNo") Long memNo);

    // 내가 찜한 클래스
    @Query("""
        SELECT o
        FROM Favorite f
        JOIN OneDay o ON f.clsNo = o.clsNo
        WHERE f.memNo = :memNo
        ORDER BY f.favNo DESC
    """)
    List<OneDay> findMyFavorites(@Param("memNo") Long memNo);

    // 예약 및 결제 내역
    @Query("""
        SELECT p
        FROM Payment p
        JOIN p.reservation r
        JOIN Schedule s ON r.schNo = s.schNo
        JOIN OneDay o ON s.clsNo = o.clsNo
        WHERE r.memNo = :memNo
        ORDER BY r.rsvCreatedAt DESC
    """)
    List<Payment> findMyReservations(@Param("memNo") Long memNo);

    // 내가 작성한 후기
    @Query("""
        SELECT rv
        FROM Review rv
        JOIN Reservation r ON rv.rsvNo = r.rsvNo
        WHERE r.memNo = :memNo
        ORDER BY rv.revCreatedAt DESC
    """)
    List<Review> findMyReviews(@Param("memNo") Long memNo);

    // 문의 및 신고 내역
    @Query("""
        SELECT i
        FROM Inquiry i
        WHERE i.inqMemNo = :memNo
        ORDER BY i.inqCreatedAt DESC
    """)
    List<Inquiry> findMyInquiries(@Param("memNo") Long memNo);

    // 강사 전용
    // 내가 강의하는 클래스
    @Query("""
        SELECT o
        FROM OneDay o
        WHERE o.memNo = :memNo
        ORDER BY o.clsCreatedAt DESC
    """)
    List<OneDay> findMyTeachingClasses(@Param("memNo") Long memNo);

    // 예약 회원 정보
    @Query("""
        SELECT m
        FROM Member m
        JOIN Reservation r ON m.memNo = r.memNo
        JOIN Schedule s ON r.schNo = s.schNo
        JOIN OneDay o ON s.clsNo = o.clsNo
        WHERE o.memNo = :memNo
        ORDER BY r.rsvCreatedAt DESC
    """)
    List<Member> findReservationMembers(@Param("memNo") Long memNo);

    // 강의 후기
    @Query("""
        SELECT rv
        FROM Review rv
        JOIN OneDay o ON rv.clsNo = o.clsNo
        WHERE o.memNo = :memNo
        ORDER BY rv.revCreatedAt DESC
    """)
    List<Review> findClassReviews(@Param("memNo") Long memNo);
}