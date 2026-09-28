package com.spring.classon.instructor.mapper;

import com.spring.classon.instructor.dto.InstructorDocumentResponseDto;
import com.spring.classon.instructor.entity.InstructorDocument;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class InstructorDocumentMapper {

    // 증빙자료 Entity 변환
    public InstructorDocument toEntity(
            Long reqNo,
            String docName,
            String docUrl
    ) {
        return InstructorDocument.builder()
                .reqNo(reqNo)
                .docName(docName)
                .docUrl(docUrl)
                .docCreatedAt(LocalDateTime.now())
                .build();
    }

    // 증빙자료 조회 DTO 변환
    public InstructorDocumentResponseDto toResponseDto(
            InstructorDocument document
    ) {
        return InstructorDocumentResponseDto.builder()
                .docNo(document.getDocNo())
                .reqNo(document.getReqNo())
                .docName(document.getDocName())
                .docUrl(document.getDocUrl())
                .build();
    }
}