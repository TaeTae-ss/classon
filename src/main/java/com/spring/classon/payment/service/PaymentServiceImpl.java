package com.spring.classon.payment.service;

import com.spring.classon.payment.dto.PaymentConfirmDTO;
import com.spring.classon.payment.dto.PaymentCreateDTO;
import com.spring.classon.payment.dto.PaymentDTO;
import com.spring.classon.payment.entity.Payment;
import com.spring.classon.payment.entity.PaymentStatus;
import com.spring.classon.payment.mapper.PaymentMapper;
import com.spring.classon.payment.repository.PaymentRepository;
import com.spring.classon.reservation.entity.Reservation;
import com.spring.classon.reservation.entity.ReservationStatus;
import com.spring.classon.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService{

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentMapper paymentMapper;

    // 결제 생성
    @Override
    @Transactional
    public PaymentDTO createPayment(PaymentCreateDTO paymentCreateDTO) {
        Reservation reservation = reservationRepository
                .findById(paymentCreateDTO.getRsvNo())
                .orElseThrow(() ->
                        new IllegalArgumentException("예약 정보를 찾을 수 없습니다.")
                );

        // 이미 예약이 확정된 경우
        if (reservation.getRsvStatus() == ReservationStatus.CONFIRMED) {
            throw new IllegalStateException(
                    "이미 확정된 예약입니다."
            );
        }

        // 취소된 예약은 결제할 수 없음
        if (reservation.getRsvStatus() == ReservationStatus.CANCEL) {
            throw new IllegalStateException(
                    "취소된 예약은 결제할 수 없습니다."
            );
        }

        // 가장 최근 결제 확인
        Optional<Payment> latestPayment = paymentRepository
                .findTopByReservationOrderByPayCreatedAtDesc(reservation);

        if (latestPayment.isPresent()) {

            Payment payment = latestPayment.get();

            // 아직 결제 진행 중
            if (payment.getPayStatus() == PaymentStatus.WAIT) {
                throw new IllegalStateException(
                        "이미 결제 진행 중인 주문이 있습니다."
                );
            }

            // 이미 결제 완료
            if (payment.getPayStatus() == PaymentStatus.PAID) {
                throw new IllegalStateException(
                        "이미 결제가 완료된 예약입니다."
                );
            }

            // FAILED 또는 CANCEL이면 새로운 결제 생성 가능
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

        return paymentMapper.toDTO(payment);
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
        return paymentMapper.toDTO(payment);
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

        return paymentMapper.toDTO(payment);
    }

    // 결제 조회
    @Override
    public PaymentDTO getPayment(Long payNo) {
        Payment payment = paymentRepository
                .findById(payNo)
                .orElseThrow(() -> new IllegalArgumentException(
                        "결제 정보를 찾을 수 없습니다."
                ));

        return paymentMapper.toDTO(payment);
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

    // 특정 예약의 결제 조회

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentListByReservation(Long rsvNo) {
        Reservation reservation = reservationRepository
                .findById(rsvNo)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "예약 정보를 찾을 수 없습니다."
                        )
                );

        return paymentRepository
                .findAllByReservationOrderByPayCreatedAtDesc(reservation)
                .stream()
                .map(paymentMapper::toDTO)
                .toList();
    }
}
