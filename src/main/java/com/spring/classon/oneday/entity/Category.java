package com.spring.classon.oneday.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "CATEGORY")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cat_no")
    private Long catNo;

    @Column(name = "cat_name", nullable = false, length = 100)
    private String catName;

    @CreationTimestamp
    @Column(name = "cat_created_at", nullable = false, updatable = false)
    private LocalDateTime catCreatedAt;

    @UpdateTimestamp
    @Column(name = "cat_updated_at", nullable = false)
    private LocalDateTime catUpdatedAt;

    @Builder
    public Category(String catName) {
        this.catName = catName;
    }

    // 카테고리명 수정
    public void changeName(String catName) {
        this.catName = catName;
    }
}
