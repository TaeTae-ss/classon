package com.spring.classon.reservation.controller;

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

        ReservationDTO result =
                reservationService.createReservation(reservationDTO);

        return ResponseEntity.ok(result);
    }

    // 예약 상세 조회
    @GetMapping("/{rsvNo}")
    public ResponseEntity<ReservationDTO> getReservation(
            @PathVariable Long rsvNo) {

        ReservationDTO result =
                reservationService.getReservation(rsvNo);

        return ResponseEntity.ok(result);
    }

    // 예약 목록 조회
    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getReservationList() {

        List<ReservationDTO> result =
                reservationService.getReservationList();

        return ResponseEntity.ok(result);
    }

    // 예약 취소
    @PatchMapping("/{rsvNo}/cancel")
    public ResponseEntity<Void> cancelReservation(
            @PathVariable Long rsvNo,
            @RequestParam String cancelReason) {

        reservationService.cancelReservation(rsvNo, cancelReason);

        return ResponseEntity.ok().build();
    }
}