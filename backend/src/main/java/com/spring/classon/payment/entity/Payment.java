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
@Builder
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAY_NO")
    private Long payNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RSV_NO", nullable = false)
    private Reservation reservation;

    @Column(name = "ORDER_NO", nullable = false, unique = true, length = 100)
    private String orderNo;

    @Column(name = "PAY_METHOD", nullable = false, length = 20)
    @Builder.Default
    private String payMethod = "CARD";

    @Column(name = "PAY_AMOUNT", nullable = false)
    private Integer payAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "PAY_STATUS", nullable = false, length = 20)
    @Builder.Default
    private PaymentStatus payStatus = PaymentStatus.WAIT;

    @Column(name = "PAY_KEY", unique = true, length = 200)
    private String payKey;

    @CreationTimestamp
    @Column(name = "PAY_CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime payCreatedAt;

    @Column(name = "PAY_PAID_AT")
    private LocalDateTime payPaidAt;

    @Column(name = "PAY_CANCELED_AT")
    private LocalDateTime payCanceledAt;

    // 결제를 위한 생성자
    public Payment(
            Reservation reservation,
            String orderNo,
            String payMethod,
            Integer payAmount
    ) {
        this.reservation = reservation;
        this.orderNo = orderNo;
        this.payMethod = payMethod;
        this.payAmount = payAmount;
        this.payStatus = PaymentStatus.WAIT;
    }

    // 결제 성공
    public void success(String payKey) {
        this.payKey = payKey;
        this.payStatus = PaymentStatus.PAID;
        this.payPaidAt = LocalDateTime.now();
    }

    // 결제 실패
    public void fail() {
        this.payStatus = PaymentStatus.FAILED;
    }


    // 결제 취소
    public void cancel() {
        this.payStatus = PaymentStatus.CANCEL;
        this.payCanceledAt = LocalDateTime.now();
    }
}