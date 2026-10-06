package com.spring.classon.review.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "REVIEW")
@Getter
@Setter
@NoArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rev_no")
    private Long revNo;

    @Column(name = "rsv_no", nullable = false)
    private Long rsvNo;

    @Column(name = "cls_no", nullable = false)
    private Long clsNo;

    @Column(name = "rev_rating", nullable = false)
    private Integer revRating;

    @Column(name = "rev_content", nullable = false)
    private String revContent;

    @CreationTimestamp
    @Column(name = "rev_created_at", nullable = false, updatable = false)
    private LocalDateTime revCreatedAt;

    @Column(name = "rev_status", nullable = false)
    private String revStatus = "N"; //후기 노출 상태 (정상 = N, 블라인드 = Y)

}
