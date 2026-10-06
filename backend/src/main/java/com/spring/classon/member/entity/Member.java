package com.spring.classon.member.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "MEMBER")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mem_no")
    private Long memNo;

    @Column(name = "mem_nickname", nullable = false, unique = true, length = 50)
    private String memNickname;

    @Column(name = "mem_created_at", nullable = false)
    private LocalDateTime memCreatedAt;

    @Column(name = "mem_img", length = 255)
    private String memImg;

    @Column(name = "mem_role", nullable = false, length = 20)
    private String memRole;

    // 회원 기본 정보 수정
    public void updateMember(String memNickname, String memImg) {
        this.memNickname = memNickname;
        this.memImg = memImg;
    }
}