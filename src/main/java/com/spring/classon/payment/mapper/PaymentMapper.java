package com.spring.classon.payment.mapper;

import com.spring.classon.payment.dto.PaymentDTO;
import com.spring.classon.payment.entity.Payment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    PaymentDTO toDTO(Payment payment);

    Payment toEntity(PaymentDTO paymentDTO);
}
