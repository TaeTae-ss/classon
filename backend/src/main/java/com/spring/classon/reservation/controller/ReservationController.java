package com.spring.classon.reservation.controller;

import com.spring.classon.reservation.dto.ReservationCancelDTO;
import com.spring.classon.reservation.dto.ReservationCountDTO;
import com.spring.classon.reservation.dto.ReservationDTO;
import com.spring.classon.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    private Long getLoginMemNo(Authentication authentication) {
        Map<String, Object> claims = (Map<String, Object>) authentication.getPrincipal();
        return ((Number) claims.get("memNo")).longValue();
    }

    private String getLoginMemRole(Authentication authentication) {
        Map<String, Object> claims = (Map<String, Object>) authentication.getPrincipal();
        return (String) claims.get("memRole");
    }

    // 예약 등록: 회원번호는 JWT에서 가져옴
    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(
            @RequestBody ReservationDTO reservationDTO,
            Authentication authentication) {

        ReservationDTO reservation = reservationService.createReservation(
                reservationDTO, getLoginMemNo(authentication));

        return ResponseEntity.ok(reservation);
    }

    // 예약 상세 조회: 본인 예약만 조회 가능
    @GetMapping("/{rsvNo}")
    public ResponseEntity<ReservationDTO> getReservation(
            @PathVariable Long rsvNo,
            Authentication authentication) {

        ReservationDTO reservation = reservationService.getReservation(
                rsvNo,
                getLoginMemNo(authentication),
                getLoginMemRole(authentication));

        return ResponseEntity.ok(reservation);
    }

    // 로그인 회원 예약 내역 조회
    @GetMapping("/my")
    public ResponseEntity<List<ReservationDTO>> getMyReservationList(
            Authentication authentication) {

        List<ReservationDTO> reservations = reservationService.getReservationListByMember(
                getLoginMemNo(authentication));

        return ResponseEntity.ok(reservations);
    }

    // 로그인 강사가 등록한 클래스의 예약 목록
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @GetMapping("/instructor/my")
    public ResponseEntity<List<ReservationDTO>> getInstructorReservationList(
            Authentication authentication) {

        List<ReservationDTO> reservations = reservationService.getReservationListByInstructor(
                getLoginMemNo(authentication));
        return ResponseEntity.ok(reservations);
    }

    // 로그인 강사가 등록한 특정 일정의 예약 목록
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @GetMapping("/instructor/schedule/{schNo}")
    public ResponseEntity<List<ReservationDTO>> getInstructorReservationListBySchedule(
            @PathVariable Long schNo,
            Authentication authentication) {

        List<ReservationDTO> reservations = reservationService.getReservationListByInstructorAndSchedule(
                getLoginMemNo(authentication), schNo);
        return ResponseEntity.ok(reservations);
    }

    // 예약 취소: 본인 예약만 취소 가능
    @PatchMapping("/{rsvNo}/cancel")
    public ResponseEntity<Void> cancelReservation(
            @PathVariable Long rsvNo,
            @RequestBody ReservationCancelDTO reservationCancelDTO,
            Authentication authentication) {

        reservationService.cancelReservation(
                rsvNo,
                reservationCancelDTO.getRsvCancelReason(),
                getLoginMemNo(authentication));

        return ResponseEntity.ok().build();
    }

    // 정원 및 예약 금액 계산(클래스 화면에서 조회 가능)
    @GetMapping("/count")
    public ResponseEntity<ReservationCountDTO> countReservation(
            @RequestParam Long schNo,
            @RequestParam Integer rsvCount) {

        ReservationCountDTO reservationCount = reservationService.countReservation(schNo, rsvCount);
        return ResponseEntity.ok(reservationCount);
    }
}
