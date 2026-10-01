package com.spring.classon.reservation.entity;

import com.spring.classon.common.exception.ReservationException;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "RESERVATION")
@Getter
@Setter
@NoArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RSV_NO")
    private Long rsvNo;

    @Column(name = "MEM_NO", nullable = false)
    private Long memNo;

    @Column(name = "SCH_NO", nullable = false)
    private Long schNo;

    @Column(name = "RSV_COUNT", nullable = false)
    private Integer rsvCount = 1;

    @Column(name = "RSV_AMOUNT", nullable = false)
    private Integer rsvAmount;

    @Column(name = "RSV_CANCEL_REASON", length = 50)
    private String rsvCancelReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "RSV_STATUS", nullable = false)
    private ReservationStatus rsvStatus = ReservationStatus.WAIT;

    @CreationTimestamp
    @Column(name = "RSV_CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime rsvCreatedAt;

    @Column(name = "RSV_CONFIRMED_AT")
    private LocalDateTime rsvConfirmedAt;

    @Column(name = "RSV_CANCELED_AT")
    private LocalDateTime rsvCanceledAt;

    @Column(name = "RSV_COMPLETED_AT")
    private LocalDateTime rsvCompletedAt;

    // 예약 확정
    public void confirm() {
        if (this.rsvStatus != ReservationStatus.WAIT) {
            throw new ReservationException(
                    "예약 대기 상태의 예약만 확정할 수 있습니다."
            );
        }

        this.rsvStatus = ReservationStatus.CONFIRMED;
        this.rsvConfirmedAt = LocalDateTime.now();
    }

    // 예약 취소
    public void cancel(String cancelReason) {
        if (this.rsvStatus != ReservationStatus.CONFIRMED) {
            throw new ReservationException(
                    "확정된 예약만 취소할 수 있습니다."
            );
        }

        this.rsvStatus = ReservationStatus.CANCEL;
        this.rsvCancelReason = cancelReason;
        this.rsvCanceledAt = LocalDateTime.now();
    }

    // 수강 완료
    public void complete() {
        if (this.rsvStatus != ReservationStatus.CONFIRMED) {
            throw new ReservationException(
                    "확정된 예약만 수강 완료 처리할 수 있습니다."
            );
        }

        this.rsvStatus = ReservationStatus.COMPLETED;
        this.rsvCompletedAt = LocalDateTime.now();
    }
}