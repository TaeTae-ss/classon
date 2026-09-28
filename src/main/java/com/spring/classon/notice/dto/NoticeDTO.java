package com.spring.classon.notice.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class NoticeDTO {

    private Long notNo;

    private String notTitle;

    private String notContent;

    private LocalDateTime notCreatedAt;
}
