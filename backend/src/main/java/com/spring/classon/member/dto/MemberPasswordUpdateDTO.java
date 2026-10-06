package com.spring.classon.member.dto;

import lombok.*;

@Getter
@NoArgsConstructor
public class MemberPasswordUpdateDTO {

    private String currentPassword;
    private String newPassword;
}