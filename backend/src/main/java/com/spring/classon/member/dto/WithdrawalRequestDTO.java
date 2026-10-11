package com.spring.classon.member.dto;

import lombok.*;

@Getter
@Setter
public class WithdrawalRequestDTO {

    // 탈퇴 약관 동의 여부
    private boolean agreedToTerms;
}