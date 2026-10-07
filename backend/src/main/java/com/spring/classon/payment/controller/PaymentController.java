package com.spring.classon.payment.controller;

import com.spring.classon.payment.dto.PaymentConfirmDTO;
import com.spring.classon.payment.dto.PaymentCreateDTO;
import com.spring.classon.payment.dto.PaymentDTO;
import com.spring.classon.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    // 결제 생성
    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody PaymentCreateDTO request) {
        PaymentDTO payment = paymentService.createPayment(request);

        return ResponseEntity.ok(payment);
    }

    // 결제 승인
    @PostMapping("/confirm")
    public ResponseEntity<PaymentDTO> confirmPayment(@RequestBody PaymentConfirmDTO request) {
        PaymentDTO payment = paymentService.confirmPayment(request);

        return ResponseEntity.ok(payment);
    }

    // 결제 상세 조회
    @GetMapping("/{payNo}")
    public ResponseEntity<PaymentDTO> getPayment(@PathVariable Long payNo) {
        PaymentDTO payment = paymentService.getPayment(payNo);

        return ResponseEntity.ok(payment);
    }

    // 결제 실패
    @PatchMapping("/order/{orderNo}/fail")
    public ResponseEntity<PaymentDTO> failPayment(@PathVariable String orderNo) {
        PaymentDTO payment = paymentService.failPayment(orderNo);

        return ResponseEntity.ok(payment);
    }

    // 결제 취소
    @PatchMapping("/reservation/{rsvNo}/cancel")
    public ResponseEntity<PaymentDTO> cancelPayment(@PathVariable Long rsvNo) {
        PaymentDTO payment = paymentService.cancelPayment(rsvNo);

        return ResponseEntity.ok(payment);
    }

    // 특정 예약의 결제 이력
    @GetMapping("/reservation/{rsvNo}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByReservation(
            @PathVariable Long rsvNo
    ) {
        List<PaymentDTO> paymentList =
                paymentService.getPaymentListByReservation(rsvNo);

        return ResponseEntity.ok(paymentList);
    }
}
