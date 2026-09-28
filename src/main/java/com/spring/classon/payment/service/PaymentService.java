package com.spring.classon.payment.service;

import com.spring.classon.payment.dto.PaymentConfirmDTO;
import com.spring.classon.payment.dto.PaymentCreateDTO;
import com.spring.classon.payment.dto.PaymentDTO;

public interface PaymentService {
    // 결제 생성
    PaymentDTO createPayment(PaymentCreateDTO paymentCreateDTO);

    // 결제 승인
    PaymentDTO confirmPayment(PaymentConfirmDTO paymentConfirmDTO);

    // 결제 실패
    PaymentDTO failPayment(Long payNo);

    // 결제 조회
    PaymentDTO getPayment(Long payNo);

    // 주문번호 생성 ex)CLASS_20260921_X2M84L
    String createOrderNo();
}
