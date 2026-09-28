package com.spring.classon.payment.controller;

import com.spring.classon.payment.dto.PaymentConfirmDTO;
import com.spring.classon.payment.dto.PaymentCreateDTO;
import com.spring.classon.payment.dto.PaymentDTO;
import com.spring.classon.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    // 결제 생성
    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody PaymentCreateDTO request) {
        PaymentDTO response = paymentService.createPayment(request);

        return ResponseEntity.ok(response);
    }

    // 결제 승인
    @PostMapping("/confirm")
    public ResponseEntity<PaymentDTO> confirmPayment(@RequestBody PaymentConfirmDTO request) {
        PaymentDTO response = paymentService.confirmPayment(request);

        return ResponseEntity.ok(response);
    }

    // 결제 실패
    @PatchMapping("/{payNo}/fail")
    public ResponseEntity<PaymentDTO> failPayment(@PathVariable Long payNo) {
        PaymentDTO response = paymentService.failPayment(payNo);

        return ResponseEntity.ok(response);
    }

    // 결제 상세 조회
    @GetMapping("/{payNo}")
    public ResponseEntity<PaymentDTO> getPayment(@PathVariable Long payNo) {
        PaymentDTO response = paymentService.getPayment(payNo);

        return ResponseEntity.ok(response);
    }
}
