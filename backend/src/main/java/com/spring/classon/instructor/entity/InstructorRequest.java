package com.spring.classon.instructor.entity;

// 강사 신청
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "INSTRUCTOR_REQUEST")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class InstructorRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "req_no")
    private Long reqNo;

    @Column(name = "mem_no", nullable = false)
    private Long memNo;

    @Column(name = "req_introduction", nullable = false, length = 255)
    private String reqIntroduction;

    @Column(name = "req_career", length = 255)
    private String reqCareer;

    @Column(name = "req_status", nullable = false, length = 20)
    private String reqStatus;

    // 강사 신청 상태 변경
    public void updateStatus(String reqStatus) {
        this.reqStatus = reqStatus;
    }
}