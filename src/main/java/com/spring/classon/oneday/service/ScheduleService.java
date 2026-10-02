package com.spring.classon.oneday.service;

import com.spring.classon.oneday.dto.ScheduleRequestDTO;
import com.spring.classon.oneday.dto.ScheduleResponseDTO;

import java.util.List;

public interface ScheduleService {

    // 회차 등록 (본인 클래스에 한해 강사 / 관리자)
    ScheduleResponseDTO registerSchedule(Long memNo, Long clsNo, ScheduleRequestDTO dto);

    // 클래스별 일정 목록 조회 (예약 인원 / 남은 인원 포함, 로그인 회원 누구나)
    List<ScheduleResponseDTO> getSchedules(Long clsNo);

    // 일정 삭제 (본인 클래스에 한해 강사 / 관리자, 예약자 있으면 불가)
    void deleteSchedule(Long memNo, Long clsNo, Long schNo);
}
