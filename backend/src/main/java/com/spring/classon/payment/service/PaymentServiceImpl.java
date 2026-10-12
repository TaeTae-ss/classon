package com.spring.classon.payment.service;

import com.spring.classon.common.exception.PaymentException;
import com.spring.classon.oneday.entity.Schedule;
import com.spring.classon.oneday.repository.ScheduleRepository;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService{

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final ScheduleRepository scheduleRepository;

    private final PaymentMapper paymentMapper;

    @Value("${toss.secret-key}")
    private String tossSecretKey;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.tosspayments.com")
            .build();

    // 결제 생성
    @Override
    @Transactional
    public PaymentDTO createPayment(PaymentCreateDTO paymentCreateDTO) {
        Reservation reservation = reservationRepository
                .findById(paymentCreateDTO.getRsvNo())
                .orElseThrow(() ->
                        new PaymentException("예약 정보를 찾을 수 없습니다.")
                );

        // 이미 예약이 확정된 경우
        if (reservation.getRsvStatus() == ReservationStatus.CONFIRMED) {
            throw new PaymentException(
                    "이미 확정된 예약입니다."
            );
        }

        // 취소된 예약은 결제할 수 없음
        if (reservation.getRsvStatus() == ReservationStatus.CANCEL) {
            throw new PaymentException(
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
                // 이전 결제 시도가 완료되지 않은 경우
                payment.fail();
            }

            // 이미 결제 완료
            if (payment.getPayStatus() == PaymentStatus.PAID) {
                throw new PaymentException(
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
                "EASY_PAY",
                payAmount
        );

        paymentRepository.save(payment);

        return paymentMapper.toDTO(payment);
    }

    // 결제 승인
    @Override
    @Transactional
    public PaymentDTO confirmPayment(PaymentConfirmDTO paymentConfirmDTO) {

        Payment payment = paymentRepository
                .findByOrderNo(paymentConfirmDTO.getOrderNo())
                .orElseThrow(() -> new PaymentException("결제 정보를 찾을 수 없습니다."));

        // 이미 결제 완료된 경우
        if (payment.getPayStatus() == PaymentStatus.PAID) {
            throw new PaymentException(
                    "이미 완료된 결제입니다."
            );
        }

        // 금액 검증
        if (!payment.getPayAmount().equals(paymentConfirmDTO.getPayAmount())) {
            throw new PaymentException(
                    "결제 금액이 일치하지 않습니다."
            );
        }

        // 연결된 예약 조회
        Reservation reservation = payment.getReservation();

        // 결제 대기 상태의 예약만 결제 가능
        if (reservation.getRsvStatus() != ReservationStatus.WAIT) {
            throw new PaymentException(
                    "결제 가능한 예약 상태가 아닙니다."
            );
        }

        // 일정 조회 + 비관적 락
        Schedule schedule = scheduleRepository
                .findByIdForUpdate(reservation.getSchNo())
                .orElseThrow(() ->
                        new PaymentException(
                                "해당 일정을 찾을 수 없습니다."
                        )
                );

        // 현재 확정 예약 인원 재확인
        Integer reservedCount =
                reservationRepository.sumConfirmedCount(
                        schedule.getSchNo(),
                        ReservationStatus.CONFIRMED
                );

        // 남은 정원 계산
        Integer remainingCount =
                schedule.getSchCapacity() - reservedCount;

        // 현재 예약 인원이 남은 정원을 초과하는지 확인
        if (reservation.getRsvCount() > remainingCount) {
            throw new PaymentException(
                    "예약 가능한 인원을 초과했습니다."
            );
        }

        // Toss 결제 승인 요청
        // test_sk + ":"를 Base64 인코딩
        String auth = Base64.getEncoder()
                .encodeToString(
                        (tossSecretKey+":")
                                .getBytes(StandardCharsets.UTF_8)
                );

        Map<String, Object> requestBody = Map.of(
                "paymentKey", paymentConfirmDTO.getPayKey(),
                "orderId", paymentConfirmDTO.getOrderNo(),
                "amount", paymentConfirmDTO.getPayAmount()
        );

        try {

            restClient.post()
                    .uri("/v1/payments/confirm")
                    .header(
                            HttpHeaders.AUTHORIZATION,
                            "Basic " + auth
                    )
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

        } catch (HttpClientErrorException e) {

            if (e.getStatusCode() == HttpStatus.NOT_FOUND
                    && e.getResponseBodyAsString().contains("NOT_FOUND_PAYMENT_SESSION")) {

                payment.fail();

                throw new PaymentException(
                        "결제 시간이 만료되었습니다. 다시 결제해주세요."
                );
            }

            throw e;
        }

        // 결제 성공
        payment.success(paymentConfirmDTO.getPayKey());

        // 연결된 예약 확정
        reservation.confirm();

        return paymentMapper.toDTO(payment);
    }

    // 결제 조회
    @Override
    public PaymentDTO getPayment(Long payNo) {
        Payment payment = paymentRepository
                .findById(payNo)
                .orElseThrow(() -> new PaymentException(
                        "결제 정보를 찾을 수 없습니다."
                ));

        return paymentMapper.toDTO(payment);
    }

    // 결제 실패
    @Override
    @Transactional
    public PaymentDTO failPayment(String orderNo) {
        Payment payment = paymentRepository
                .findByOrderNo(orderNo)
                .orElseThrow(() -> new PaymentException(
                        "결제 정보를 찾을 수 없습니다."
                ));
        payment.fail();

        return paymentMapper.toDTO(payment);
    }

    // 결제 취소
    @Override
    @Transactional
    public PaymentDTO cancelPayment(Long rsvNo) {

        Reservation reservation = reservationRepository
                .findById(rsvNo)
                .orElseThrow(() ->
                        new PaymentException(
                                "예약 정보를 찾을 수 없습니다."
                        )
                );

        // 가장 최근 결제 조회
        Payment payment = paymentRepository
                .findTopByReservationOrderByPayCreatedAtDesc(reservation)
                .orElseThrow(() ->
                        new PaymentException(
                                "해당 예약의 결제 정보를 찾을 수 없습니다."
                        )
                );

        // 이미 취소된 결제
        if (payment.getPayStatus() == PaymentStatus.CANCEL) {
            throw new PaymentException(
                    "이미 취소된 결제입니다."
            );
        }

        // 결제 완료 상태가 아닌 경우
        if (payment.getPayStatus() != PaymentStatus.PAID) {
            throw new PaymentException(
                    "결제 완료된 결제만 취소할 수 있습니다."
            );
        }

        // 결제 취소
        payment.cancel();

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
                        new PaymentException(
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
