package com.spring.classon.inquiry.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "INQUIRY")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "INQ_NO")
    private Long inqNo;

    @Column(name = "INQ_MEM_NO", nullable = false)
    private Long inqMemNo;

    @Column(name = "INQ_STATUS", nullable = false, length = 20)
    private String inqStatus;

    @Column(name = "INQ_CREATED_AT", nullable = false)
    private LocalDateTime inqCreatedAt;

    @Column(name = "INQ_TITLE", nullable = false, length = 100)
    private String inqTitle;

    @Column(name = "INQ_CONTENT", nullable = false, length = 255)
    private String inqContent;

    @Column(name = "ADM_COMMENT", length = 255)
    private String admComment;

    @Column(name = "PRO_CREATED_AT")
    private LocalDateTime proCreatedAt;

    @PrePersist
    public void prePersist() {

        if (inqStatus == null || inqStatus.isBlank()) {
            inqStatus = "접수";
        }

        if (inqCreatedAt == null) {
            inqCreatedAt = LocalDateTime.now();
        }
    }
}