package com.spring.classon.instructor.mapper;

import com.spring.classon.instructor.dto.*;
import com.spring.classon.instructor.entity.InstructorRequest;
import org.springframework.stereotype.Component;

@Component
public class InstructorMapper {

    // 강사 신청 Entity 변환
    public InstructorRequest toEntity(
            Long memNo,
            InstructorRequestDto dto,
            String reqStatus
    ) {
        return InstructorRequest.builder()
                .memNo(memNo)
                .reqIntroduction(dto.getReqIntroduction())
                .reqCareer(dto.getReqCareer())
                .reqStatus(reqStatus)
                .build();
    }

    // 강사 신청 조회 DTO 변환
    public InstructorResponseDto toResponseDto(
            InstructorRequest request
    ) {
        return InstructorResponseDto.builder()
                .reqNo(request.getReqNo())
                .memNo(request.getMemNo())
                .reqIntroduction(request.getReqIntroduction())
                .reqCareer(request.getReqCareer())
                .reqStatus(request.getReqStatus())
                .build();
    }
}