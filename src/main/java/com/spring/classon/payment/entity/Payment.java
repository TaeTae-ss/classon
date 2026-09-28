package com.spring.classon.payment.entity;

import com.spring.classon.reservation.entity.Reservation;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "PAYMENT")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAY_NO")
    private Long payNo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "RSV_NO",
            nullable = false,
            unique = true
    )
    private Reservation reservation;

    // 주문 번호 :CLASS_20260921_X2M84L
    @Column(name = "ORDER_NO", nullable = false, unique = true, length = 100)
    private String orderNo;

    @Column(name = "PAY_METHOD", nullable = false, length = 20)
    private String payMethod;

    @Column(name = "PAY_AMOUNT", nullable = false)
    private Long payAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "PAY_STATUS", nullable = false, length = 20)
    private PaymentStatus payStatus = PaymentStatus.WAIT;

    // 토스 결제 키
    @Column(name = "PAY_KEY", unique = true, length = 200)
    private String payKey;

    @CreationTimestamp
    @Column(name = "PAY_CREATED_AT", nullable = false)
    private LocalDateTime payCreatedAt;

    @Column(name = "PAY_PAID_AT")
    private LocalDateTime payPaidAt;

    @Column(name = "PAY_CANCELED_AT")
    private LocalDateTime payCanceledAt;

    // 결제 상태 값
    public enum PaymentStatus {
        WAIT,
        PAID,
        CANCEL,
        FAILED
    }
}