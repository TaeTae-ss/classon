package com.spring.classon.member.dto;

// password 제외 회원 정보 조회용 dto
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class MemberResponseDto {

    private Long memNo;
    private String memEmail;
    private String memNickname;
    private String memPhone;
    private String memAddress;
    private String memImg;
    private String memRole;
    private LocalDateTime memCreatedAt;
}