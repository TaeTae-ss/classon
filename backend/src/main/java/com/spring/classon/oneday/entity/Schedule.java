package com.spring.classon.oneday.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "SCHEDULE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sch_no")
    private Long schNo;

    @Column(name = "cls_no", nullable = false)
    private Long clsNo;

    @Column(name = "sch_start_date", nullable = false)
    private LocalDate schStartDate;

    @Column(name = "sch_capacity", nullable = false)
    private Integer schCapacity;

    @CreationTimestamp
    @Column(name = "sch_created_at", nullable = false, updatable = false)
    private LocalDateTime schCreatedAt;

    @UpdateTimestamp
    @Column(name = "sch_updated_at")
    private LocalDateTime schUpdatedAt;

    @Builder
    public Schedule(Long clsNo, LocalDate schStartDate, Integer schCapacity) {
        this.clsNo = clsNo;
        this.schStartDate = schStartDate;
        this.schCapacity = schCapacity;
    }
}
