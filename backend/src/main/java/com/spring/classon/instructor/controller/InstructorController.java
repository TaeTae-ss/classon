package com.spring.classon.instructor.controller;

import com.spring.classon.instructor.dto.*;
import com.spring.classon.instructor.service.InstructorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/instructor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class InstructorController {

    private final InstructorService instructorService;


    // 강사 신청
    @PostMapping("/{memNo}")
    public ResponseEntity<Long> applyInstructor(
            @PathVariable Long memNo,
            @RequestBody InstructorRequestDTO dto
    ) {

        Long reqNo =
                instructorService.applyInstructor(
                        memNo,
                        dto
                );

        return ResponseEntity.ok(reqNo);
    }


    // 강사 신청 상태 조회
    @GetMapping("/{reqNo}")
    public ResponseEntity<InstructorResponseDTO> getInstructorRequest(
            @PathVariable Long reqNo
    ) {

        return ResponseEntity.ok(
                instructorService.getInstructorRequest(
                        reqNo
                )
        );
    }


    // 회원 번호로 강사 신청 조회
    @GetMapping("/member/{memNo}")
    public ResponseEntity<InstructorResponseDTO> getInstructorRequestByMemNo(
            @PathVariable Long memNo
    ) {
        InstructorResponseDTO response =
                instructorService.getInstructorRequestByMemNo(memNo);

        return ResponseEntity.ok(response);
    }


    // 강사 신청 증빙자료 등록
    @PostMapping("/{reqNo}/documents")
    public ResponseEntity<InstructorDocumentResponseDTO> addDocument(
            @PathVariable Long reqNo,
            @RequestParam("file") MultipartFile file
    ) {

        return ResponseEntity.ok(
                instructorService.addDocument(
                        reqNo,
                        file
                )
        );
    }

    // 내 강사 신청 증빙자료 목록 조회
    @GetMapping("/{reqNo}/documents")
    public ResponseEntity<List<InstructorDocumentResponseDTO>> getMyInstructorDocuments(
            @PathVariable Long reqNo,
            @AuthenticationPrincipal Map<String, Object> claims
    ) {
        Number memNoValue = (Number) claims.get("memNo");
        Long memNo = memNoValue.longValue();

        return ResponseEntity.ok(
                instructorService.getMyInstructorDocuments(reqNo, memNo)
        );
    }

    // 반려된 강사 신청의 기존 증빙자료 삭제
    @DeleteMapping("/{reqNo}/documents")
    public ResponseEntity<Void> deleteMyInstructorDocuments(
            @PathVariable Long reqNo,
            @AuthenticationPrincipal Map<String, Object> claims
    ) {
        Number memNoValue = (Number) claims.get("memNo");
        Long memNo = memNoValue.longValue();

        instructorService.deleteMyInstructorDocuments(reqNo, memNo);

        return ResponseEntity.noContent().build();
    }

    // 반려된 강사 신청 수정
    @PatchMapping("/{reqNo}")
    public ResponseEntity<Void> updateInstructorApplication(
            @PathVariable Long reqNo,
            @AuthenticationPrincipal Map<String, Object> claims,
            @RequestBody InstructorRequestDTO dto
    ) {
        Number memNoValue = (Number) claims.get("memNo");
        Long memNo = memNoValue.longValue();

        instructorService.updateInstructorApplication(
                reqNo,
                memNo,
                dto
        );

        return ResponseEntity.noContent().build();
    }
}