package com.spring.classon.member.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private Long memNo;
    private String accessToken;
    private String refreshToken;
    private String memRole;
}