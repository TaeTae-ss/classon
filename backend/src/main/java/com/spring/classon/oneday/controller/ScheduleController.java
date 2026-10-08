package com.spring.classon.oneday.controller;

import com.spring.classon.common.response.ApiResponse;
import com.spring.classon.oneday.dto.ScheduleRequestDTO;
import com.spring.classon.oneday.dto.ScheduleResponseDTO;
import com.spring.classon.oneday.service.ScheduleService;
import com.spring.classon.oneday.util.CurrentMemberResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    // 회차 등록 (본인 클래스에 한해 강사/관리자)
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @PostMapping("/api/v1/oneday/{clsNo}/schedules")
    public ResponseEntity<ScheduleResponseDTO> registerSchedule(
            @PathVariable Long clsNo,
            @RequestBody ScheduleRequestDTO dto
    ) {
        Long memNo = CurrentMemberResolver.getCurrentMemNo();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(scheduleService.registerSchedule(memNo, clsNo, dto));
    }

    // 클래스별 일정 목록 조회 (예약 인원/남은 인원 포함, 비회원도 조회 가능)
    @PreAuthorize("permitAll()")
    @GetMapping("/api/v1/oneday/{clsNo}/schedules")
    public ResponseEntity<List<ScheduleResponseDTO>> getSchedules(@PathVariable Long clsNo) {

        return ResponseEntity.ok(
                scheduleService.getSchedules(clsNo)
        );
    }

    // 일정 삭제 (본인 클래스에 한해 강사/관리자, 예약자 있으면 불가)
    // 빈 바디를 응답하면 메시지 컨버터를 타지 않아 ApiResponseAdvice가 적용되지 않으므로, 여기만 직접 감싼다
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @DeleteMapping("/api/v1/oneday/{clsNo}/schedules/{schNo}")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(
            @PathVariable Long clsNo,
            @PathVariable Long schNo
    ) {
        Long memNo = CurrentMemberResolver.getCurrentMemNo();

        scheduleService.deleteSchedule(memNo, clsNo, schNo);

        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
