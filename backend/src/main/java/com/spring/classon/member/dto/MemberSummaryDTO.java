package com.spring.classon.member.dto;

// 여기부터 추가 (oneday의 member 경계 위반 리팩토링용 신규 파일)
// 다른 도메인에 공개해도 되는 회원 공개 정보만 담은 요약 DTO (이메일/전화번호 등 개인정보 제외)
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MemberSummaryDTO {

    private Long memNo;
    private String memNickname;
    private String memRole;
}
// 여기까지 추가
