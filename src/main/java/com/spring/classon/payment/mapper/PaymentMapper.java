package com.spring.classon.payment.mapper;

import com.spring.classon.payment.dto.PaymentDTO;
import com.spring.classon.payment.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(source = "reservation.rsvNo", target = "rsvNo")
    PaymentDTO toDTO(Payment payment);

    Payment toEntity(PaymentDTO paymentDTO);
}
