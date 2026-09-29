package com.spring.classon.member.dto;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequestDTO {

    private String memNickname;
    private String memEmail;
    private String memPassword;
    private String memPhone;
    private String memAddress;
}