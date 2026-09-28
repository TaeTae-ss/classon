package com.spring.classon.payment.service;

import com.spring.classon.payment.dto.PaymentConfirmDTO;
import com.spring.classon.payment.dto.PaymentCreateDTO;
import com.spring.classon.payment.dto.PaymentDTO;
import com.spring.classon.payment.entity.Payment;
import com.spring.classon.payment.entity.PaymentStatus;
import com.spring.classon.payment.repository.PaymentRepository;
import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService{

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    // 결제 생성
    @Override
    @Transactional
    public PaymentDTO createPayment(PaymentCreateDTO paymentCreateDTO) {
        Reservation reservation = reservationRepository
                .findById(paymentCreateDTO.getRsvNo())
                .orElseThrow(() ->
                        new IllegalArgumentException("예약 정보를 찾을 수 없습니다.")
                );

        // 이미 결제가 존재하는 경우
        if (paymentRepository.existsByReservation(reservation)) {
            throw new IllegalStateException(
                    "이미 결제가 생성된 예약입니다."
            );
        }

        // 현재 예약 금액 사용
        Integer payAmount = reservation.getRsvAmount();

        // 주문번호 생성
        String orderNo = createOrderNo();

        Payment payment = new Payment(
                reservation,
                orderNo,
                "CARD",
                payAmount
        );

        paymentRepository.save(payment);

        return new PaymentDTO(payment);
    }

    // 결제 승인 toss 연동 전
    @Override
    @Transactional
    public PaymentDTO confirmPayment(PaymentConfirmDTO paymentConfirmDTO) {
        Payment payment = paymentRepository
                .findByOrderNo(paymentConfirmDTO.getOrderNo())
                .orElseThrow(() -> new IllegalArgumentException("결제 정보를 찾을 수 없습니다."));

        // 금액 검증
        if (!payment.getPayAmount().equals(paymentConfirmDTO.getPayAmount())) {
            throw new IllegalArgumentException(
                    "결제 금액이 일치하지 않습니다."
            );
        }

        // 이미 결제 완료된 경우
        if (payment.getPayStatus() == PaymentStatus.PAID) {
            throw new IllegalStateException(
                    "이미 완료된 결제입니다."
            );
        }

        // 결제 성공
        payment.success(paymentConfirmDTO.getPayKey());

        // 연결된 예약 확정
        Reservation reservation = payment.getReservation();
        reservation.confirm();
        return new PaymentDTO(payment);
    }

    // 결제 실패
    @Override
    @Transactional
    public PaymentDTO failPayment(Long payNo) {
        Payment payment = paymentRepository
                .findById(payNo)
                .orElseThrow(() -> new IllegalArgumentException(
                        "결제 정보를 찾을 수 없습니다."
                ));
        payment.fail();

        return new PaymentDTO(payment);
    }

    // 결제 조회
    @Override
    public PaymentDTO getPayment(Long payNo) {
        Payment payment = paymentRepository
                .findById(payNo)
                .orElseThrow(() -> new IllegalArgumentException(
                        "결제 정보를 찾을 수 없습니다."
                ));

        return new PaymentDTO(payment);
    }

    // 주문번호 생성
    @Override
    public String createOrderNo() {
        String date = LocalDate.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        String uuid = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 6)
                .toUpperCase();

        return "CLASS_" + date + "_" + uuid;
    }
}
