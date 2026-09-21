package com.spring.classon.member.dto;

// 회원 개인정보 수정용 dto
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MemberUpdateDto {

    private String memNickname;
    private String memPhone;
    private String memAddress;
    private String memImg;
}