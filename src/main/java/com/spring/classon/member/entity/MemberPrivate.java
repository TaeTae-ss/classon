package com.spring.classon.member.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "MEMBER_PRIVATE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MemberPrivate {

    @Id
    @Column(name = "mem_no")
    private Long memNo;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "mem_no")
    private Member member;

    @Column(name = "mem_email", nullable = false, unique = true, length = 100)
    private String memEmail;

    @Column(name = "mem_password", nullable = false, length = 255)
    private String memPassword;

    @Column(name = "mem_phone", nullable = false, length = 20)
    private String memPhone;

    @Column(name = "mem_address", nullable = false, length = 100)
    private String memAddress;

    @Column(name = "mem_pw_update")
    private LocalDateTime memPwUpdate;

    // 회원 private 정보 수정(비밀번호 제외)
    public void updateMemberPrivate(String memPhone, String memAddress) {
        this.memPhone = memPhone;
        this.memAddress = memAddress;
    }

    // 비밀번호 변경
    public void updatePassword(String memPassword, LocalDateTime memPwUpdate) {
        this.memPassword = memPassword;
        this.memPwUpdate = memPwUpdate;
    }
}