package com.spring.classon.instructor.entity;

// 강사 신청 증빙자료
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "INSTRUCTOR_DOCUMENT")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class InstructorDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doc_no")
    private Long docNo;

    @Column(name = "req_no", nullable = false)
    private Long reqNo;

    @Column(name = "doc_name", nullable = false, length = 255)
    private String docName;

    @Column(name = "doc_url", nullable = false, length = 255)
    private String docUrl;

    @Column(name = "doc_created_at", nullable = false)
    private LocalDateTime docCreatedAt;
}