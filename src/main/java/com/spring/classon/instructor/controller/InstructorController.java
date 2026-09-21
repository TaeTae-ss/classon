package com.spring.classon.instructor.controller;

import com.spring.classon.instructor.dto.*;
import com.spring.classon.instructor.service.InstructorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/instructor")
@RequiredArgsConstructor
public class InstructorController {

    private final InstructorService instructorService;

    // 강사 신청
    @PostMapping("/{memNo}")
    public ResponseEntity<Long> applyInstructor(
            @PathVariable Long memNo,
            @RequestBody InstructorRequestDto dto) {

        Long reqNo = instructorService.applyInstructor(memNo, dto);

        return ResponseEntity.ok(reqNo);
    }

    // 강사 신청 상태 조회
    @GetMapping("/{reqNo}")
    public ResponseEntity<InstructorResponseDto> getInstructorRequest(
            @PathVariable Long reqNo) {

        return ResponseEntity.ok(
                instructorService.getInstructorRequest(reqNo)
        );
    }

    // 강사 신청 증빙자료 등록
    @PostMapping("/{reqNo}/documents")
    public ResponseEntity<InstructorDocumentResponseDto> addDocument(
            @PathVariable Long reqNo,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                instructorService.addDocument(reqNo, file)
        );
    }
}