package com.spring.classon.reservation.controller;

import com.spring.classon.reservation.dto.ReservationCancelDTO;
import com.spring.classon.reservation.dto.ReservationCountDTO;
import com.spring.classon.reservation.dto.ReservationDTO;
import com.spring.classon.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // 예약 등록
    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(
            @RequestBody ReservationDTO reservationDTO) {

        ReservationDTO reservation =
                reservationService.createReservation(reservationDTO);

        return ResponseEntity.ok(reservation);
    }

    // 예약 상세 조회
    @GetMapping("/{rsvNo}")
    public ResponseEntity<ReservationDTO> getReservation(
            @PathVariable Long rsvNo) {

        ReservationDTO reservation =
                reservationService.getReservation(rsvNo);

        return ResponseEntity.ok(reservation);
    }

    // 예약 목록 조회
    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getReservationList() {

        List<ReservationDTO> reservation =
                reservationService.getReservationList();

        return ResponseEntity.ok(reservation);
    }

    // 회원 예약 내역 조회
    @GetMapping("/member/{memNo}")
    public ResponseEntity<List<ReservationDTO>> getReservationListByMember(
            @PathVariable Long memNo
    ) {
        List<ReservationDTO> reservation =
                reservationService.getReservationListByMember(memNo);

        return ResponseEntity.ok(reservation);
    }

    // 예약 취소
    @PatchMapping("/{rsvNo}/cancel")
    public ResponseEntity<Void> cancelReservation(
            @PathVariable Long rsvNo,
            @RequestBody ReservationCancelDTO reservationCancelDTO) {

        reservationService.cancelReservation(rsvNo, reservationCancelDTO.getRsvCancelReason());

        return ResponseEntity.ok().build();
    }

    // 정원 및 예약 금액 계산
    @GetMapping("/count")
    public ResponseEntity<ReservationCountDTO> countReservation(
            @RequestParam Long schNo,
            @RequestParam Integer rsvCount
    ) {

        ReservationCountDTO reservationCount =
                reservationService.countReservation(
                        schNo,
                        rsvCount
                );

        return ResponseEntity.ok(reservationCount);
    }
}