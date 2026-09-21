package com.spring.classon.member.dto;

import lombok.*;

@Getter
@NoArgsConstructor
public class MemberPasswordUpdateDto {

    private String currentPassword;
    private String newPassword;
}