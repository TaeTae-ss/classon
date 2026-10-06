package com.spring.classon.oneday.mapper;

import com.spring.classon.oneday.dto.ScheduleRequestDTO;
import com.spring.classon.oneday.dto.ScheduleResponseDTO;
import com.spring.classon.oneday.entity.Schedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ScheduleMapper {

    @Mapping(target = "clsNo", source = "clsNo")
    Schedule toEntity(ScheduleRequestDTO dto, Long clsNo);

    @Mapping(target = "reservedCount", source = "reservedCount")
    @Mapping(target = "remainingCapacity", source = "remainingCapacity")
    ScheduleResponseDTO toResponseDto(Schedule schedule, Integer reservedCount, Integer remainingCapacity);
}
