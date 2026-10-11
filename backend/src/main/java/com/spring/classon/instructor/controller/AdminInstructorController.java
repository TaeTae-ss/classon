
package com.spring.classon.instructor.controller;

import com.spring.classon.instructor.dto.InstructorApprovalDTO;
import com.spring.classon.instructor.service.InstructorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/instructor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminInstructorController {

    private final InstructorService instructorService;

    // 강사 신청 승인 및 반려
    @PatchMapping("/{reqNo}/status")
    public ResponseEntity<Void> updateInstructorStatus(
            @PathVariable Long reqNo,
            @RequestBody InstructorApprovalDTO dto
    ) {
        instructorService.updateInstructorStatus(reqNo, dto);

        return ResponseEntity.noContent().build();
    }
}
