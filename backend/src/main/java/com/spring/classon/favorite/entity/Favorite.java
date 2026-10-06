package com.spring.classon.favorite.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "FAVORITE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fav_no")
    private Long favNo;

    @Column(name = "mem_no", nullable = false)
    private Long memNo;

    @Column(name = "cls_no", nullable = false)
    private Long clsNo;

    @Builder
    public Favorite(Long memNo, Long clsNo) {
        this.memNo = memNo;
        this.clsNo = clsNo;
    }

}
