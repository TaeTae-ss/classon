package com.spring.classon.reservation.mapper;

import com.spring.classon.reservation.dto.ReservationDTO;
import com.spring.classon.reservation.entity.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReservationMapper {
    @Mapping(target = "rsvStatus", constant = "WAIT")
    Reservation toEntity(ReservationDTO dto);

    ReservationDTO toDTO(Reservation reservation);
}
