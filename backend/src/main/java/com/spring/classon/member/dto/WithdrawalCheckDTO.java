
package com.spring.classon.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// 탈퇴 가능 여부와 안내 메시지 반환
@Getter
@AllArgsConstructor
public class WithdrawalCheckDTO {

    private boolean canWithdraw;
    private String message;
}
