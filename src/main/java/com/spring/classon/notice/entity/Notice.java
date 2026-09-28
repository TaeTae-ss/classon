package com.spring.classon.notice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "NOTICE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NOT_NO")
    private Long notNo;

    @Column(name = "NOT_TITLE", nullable = false, length = 200)
    private String notTitle;

    @Lob
    @Column(name = "NOT_CONTENT", nullable = false)
    private String notContent;

    @Column(name = "NOT_CREATED_AT", nullable = false)
    private LocalDateTime notCreatedAt;

    @PrePersist
    public void prePersist() {
        if (notCreatedAt == null) {
            notCreatedAt = LocalDateTime.now();
        }
    }
}
