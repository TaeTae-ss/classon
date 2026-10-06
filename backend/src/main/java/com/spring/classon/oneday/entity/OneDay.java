package com.spring.classon.oneday.entity;

import com.spring.classon.oneday.status.OneDayStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ONEDAY")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OneDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cls_no")
    private Long clsNo;

    @Column(name = "mem_no", nullable = false)
    private Long memNo;

    @Column(name = "cat_no", nullable = false)
    private Long catNo;

    @Column(name = "cls_name", nullable = false, length = 255)
    private String clsName;

    @Lob
    @Column(name = "cls_desc")
    private String clsDesc;

    @Column(name = "cls_price", nullable = false)
    private Integer clsPrice = 0;

    @Column(name = "cls_road_addr", nullable = false, length = 255)
    private String clsRoadAddr;

    @Column(name = "cls_detail_addr", nullable = false, length = 255)
    private String clsDetailAddr;

    @Column(name = "cls_level", nullable = false, length = 20)
    private String clsLevel;

    @Column(name = "cls_duration", nullable = false)
    private Integer clsDuration;

    @Column(name = "cls_img_origin", length = 255)
    private String clsImgOrigin;

    @Column(name = "cls_img_thumb", length = 255)
    private String clsImgThumb;

    @Enumerated(EnumType.STRING)
    @Column(name = "cls_status", nullable = false, length = 20)
    private OneDayStatus clsStatus = OneDayStatus.READY;

    @CreationTimestamp
    @Column(name = "cls_created_at", nullable = false, updatable = false)
    private LocalDateTime clsCreatedAt;

    @UpdateTimestamp
    @Column(name = "cls_updated_at")
    private LocalDateTime clsUpdatedAt;

    @Builder
    public OneDay(Long memNo, Long catNo, String clsName, String clsDesc, Integer clsPrice,
                  String clsRoadAddr, String clsDetailAddr, String clsLevel, Integer clsDuration,
                  String clsImgOrigin, String clsImgThumb, OneDayStatus clsStatus) {
        this.memNo = memNo;
        this.catNo = catNo;
        this.clsName = clsName;
        this.clsDesc = clsDesc;
        this.clsPrice = clsPrice;
        this.clsRoadAddr = clsRoadAddr;
        this.clsDetailAddr = clsDetailAddr;
        this.clsLevel = clsLevel;
        this.clsDuration = clsDuration;
        this.clsImgOrigin = clsImgOrigin;
        this.clsImgThumb = clsImgThumb;
        this.clsStatus = clsStatus;
    }

    // 상품 정보 수정
    public void update(Long catNo, String clsName, String clsDesc, Integer clsPrice,
                        String clsRoadAddr, String clsDetailAddr, String clsLevel, Integer clsDuration) {
        this.catNo = catNo;
        this.clsName = clsName;
        this.clsDesc = clsDesc;
        this.clsPrice = clsPrice;
        this.clsRoadAddr = clsRoadAddr;
        this.clsDetailAddr = clsDetailAddr;
        this.clsLevel = clsLevel;
        this.clsDuration = clsDuration;
    }

    // 상품 이미지 교체
    public void updateImages(String clsImgOrigin, String clsImgThumb) {
        this.clsImgOrigin = clsImgOrigin;
        this.clsImgThumb = clsImgThumb;
    }
}
