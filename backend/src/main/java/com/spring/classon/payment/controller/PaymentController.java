package com.spring.classon.payment.controller;

import com.spring.classon.payment.dto.PaymentConfirmDTO;
import com.spring.classon.payment.dto.PaymentCreateDTO;
import com.spring.classon.payment.dto.PaymentDTO;
import com.spring.classon.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    private Long getLoginMemNo(Authentication authentication) {
        Map<String, Object> claims = (Map<String, Object>) authentication.getPrincipal();
        return ((Number) claims.get("memNo")).longValue();
    }

    // 결제 생성
    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(
            @RequestBody PaymentCreateDTO request,
            Authentication authentication) {
        PaymentDTO payment = paymentService.createPayment(request, getLoginMemNo(authentication));
        return ResponseEntity.ok(payment);
    }

    // 결제 승인
    @PostMapping("/confirm")
    public ResponseEntity<PaymentDTO> confirmPayment(
            @RequestBody PaymentConfirmDTO request,
            Authentication authentication) {
        PaymentDTO payment = paymentService.confirmPayment(request, getLoginMemNo(authentication));
        return ResponseEntity.ok(payment);
    }

    // 결제 상세 조회
    @GetMapping("/{payNo}")
    public ResponseEntity<PaymentDTO> getPayment(
            @PathVariable Long payNo,
            Authentication authentication) {
        PaymentDTO payment = paymentService.getPayment(payNo, getLoginMemNo(authentication));
        return ResponseEntity.ok(payment);
    }

    // 결제 실패
    @PatchMapping("/order/{orderNo}/fail")
    public ResponseEntity<PaymentDTO> failPayment(
            @PathVariable String orderNo,
            Authentication authentication) {
        PaymentDTO payment = paymentService.failPayment(orderNo, getLoginMemNo(authentication));
        return ResponseEntity.ok(payment);
    }

    // 결제 취소
    @PatchMapping("/reservation/{rsvNo}/cancel")
    public ResponseEntity<PaymentDTO> cancelPayment(
            @PathVariable Long rsvNo,
            Authentication authentication) {
        PaymentDTO payment = paymentService.cancelPayment(rsvNo, getLoginMemNo(authentication));
        return ResponseEntity.ok(payment);
    }

    // 특정 예약의 결제 이력
    @GetMapping("/reservation/{rsvNo}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByReservation(
            @PathVariable Long rsvNo,
            Authentication authentication) {
        List<PaymentDTO> paymentList = paymentService.getPaymentListByReservation(
                rsvNo, getLoginMemNo(authentication));
        return ResponseEntity.ok(paymentList);
    }
}
