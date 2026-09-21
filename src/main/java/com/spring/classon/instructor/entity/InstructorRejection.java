package com.spring.classon.instructor.entity;

// 강사 신청 거절
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "INSTRUCTOR_REJECTION")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class InstructorRejection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rej_no")
    private Long rejNo;

    @Column(name = "req_no", nullable = false)
    private Long reqNo;

    @Column(name = "rej_reason", nullable = false, length = 100)
    private String rejReason;
}