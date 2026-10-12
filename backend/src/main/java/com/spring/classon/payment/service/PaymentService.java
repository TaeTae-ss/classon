package com.spring.classon.payment.service;

import com.spring.classon.payment.dto.PaymentConfirmDTO;
import com.spring.classon.payment.dto.PaymentCreateDTO;
import com.spring.classon.payment.dto.PaymentDTO;

import java.util.List;

public interface PaymentService {
    // 결제 생성
    PaymentDTO createPayment(PaymentCreateDTO paymentCreateDTO, Long memNo);

    // 결제 승인
    PaymentDTO confirmPayment(PaymentConfirmDTO paymentConfirmDTO, Long memNo);

    // 결제 조회
    PaymentDTO getPayment(Long payNo, Long memNo);

    //결제 실패
    PaymentDTO failPayment(String orderNo, Long memNo);

    // 결제 취소
    PaymentDTO cancelPayment(Long rsvNo, Long memNo);

    // 주문번호 생성 ex)CLASS_20260921_X2M84L
    String createOrderNo();

    // 특정 예약의 결제 조회
    List<PaymentDTO> getPaymentListByReservation(Long rsvNo, Long memNo);
}
