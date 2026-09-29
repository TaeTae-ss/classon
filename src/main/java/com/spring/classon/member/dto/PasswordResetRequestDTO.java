package com.spring.classon.member.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetRequestDTO {

    private String memEmail;
    private String memPassword;
}