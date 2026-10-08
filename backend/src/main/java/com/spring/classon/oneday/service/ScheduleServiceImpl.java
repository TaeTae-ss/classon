package com.spring.classon.oneday.service;

import com.spring.classon.common.exception.InstructorPermissionException;
import com.spring.classon.member.dto.MemberSummaryDTO;
import com.spring.classon.member.service.MemberService;
import com.spring.classon.oneday.dto.ScheduleRequestDTO;
import com.spring.classon.oneday.dto.ScheduleResponseDTO;
import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.oneday.entity.Schedule;
import com.spring.classon.oneday.exception.InvalidScheduleException;
import com.spring.classon.oneday.exception.OneDayNotFoundException;
import com.spring.classon.oneday.exception.ScheduleDeletionNotAllowedException;
import com.spring.classon.oneday.exception.ScheduleNotFoundException;
import com.spring.classon.oneday.mapper.ScheduleMapper;
import com.spring.classon.oneday.repository.OneDayRepository;
import com.spring.classon.oneday.repository.ScheduleRepository;
import com.spring.classon.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final OneDayRepository oneDayRepository;
    private final MemberService memberService;
    private final ReservationService reservationService;
    private final ScheduleMapper scheduleMapper;

    // 회차 등록
    @Override
    @Transactional
    public ScheduleResponseDTO registerSchedule(Long memNo, Long clsNo, ScheduleRequestDTO dto) {

        OneDay oneDay = oneDayRepository.findById(clsNo)
                .orElseThrow(OneDayNotFoundException::new);

        checkOwnerOrAdmin(oneDay, memNo);

        if (dto.getSchStartDate() == null || dto.getSchStartDate().isBefore(LocalDate.now())) {
            throw new InvalidScheduleException("시작일은 오늘 또는 이후여야 합니다.");
        }

        if (dto.getSchCapacity() == null || dto.getSchCapacity() <= 0) {
            throw new InvalidScheduleException("정원은 1명 이상이어야 합니다.");
        }

        Schedule schedule = scheduleMapper.toEntity(dto, clsNo);

        Schedule savedSchedule = scheduleRepository.save(schedule);

        oneDay.startRecruiting();

        return scheduleMapper.toResponseDto(savedSchedule, 0, savedSchedule.getSchCapacity());
    }

    // 클래스별 일정 목록 조회 (예약 인원 / 남은 인원 포함)
    @Override
    public List<ScheduleResponseDTO> getSchedules(Long clsNo) {

        oneDayRepository.findById(clsNo)
                .orElseThrow(OneDayNotFoundException::new);

        return scheduleRepository.findByClsNo(clsNo).stream()
                .map(schedule -> {
                    int reservedCount = reservationService.countActiveReservations(schedule.getSchNo());

                    int remainingCapacity = schedule.getSchCapacity() - reservedCount;

                    return scheduleMapper.toResponseDto(schedule, reservedCount, remainingCapacity);
                })
                .toList();
    }

    // 일정 삭제
    @Override
    @Transactional
    public void deleteSchedule(Long memNo, Long clsNo, Long schNo) {

        OneDay oneDay = oneDayRepository.findById(clsNo)
                .orElseThrow(OneDayNotFoundException::new);

        checkOwnerOrAdmin(oneDay, memNo);

        Schedule schedule = scheduleRepository.findById(schNo)
                .orElseThrow(ScheduleNotFoundException::new);

        if (!schedule.getClsNo().equals(clsNo)) {
            throw new ScheduleNotFoundException();
        }

        if (reservationService.hasActiveReservation(schNo)) {
            throw new ScheduleDeletionNotAllowedException();
        }

        scheduleRepository.delete(schedule);
    }

    // 클래스 소유자(강사) 또는 관리자 확인
    private void checkOwnerOrAdmin(OneDay oneDay, Long memNo) {

        MemberSummaryDTO member = memberService.getMemberSummary(memNo);

        boolean isOwner = oneDay.getMemNo().equals(memNo);
        boolean isAdmin = "ADMIN".equals(member.getMemRole());

        if (!isOwner && !isAdmin) {
            throw new InstructorPermissionException();
        }
    }
}
