package com.spring.classon.member.service;

import com.spring.classon.member.dto.MyPageResponseDTO;

public interface MyPageService {

    // 마이페이지 조회
    MyPageResponseDTO getMyPage(Long memNo);
}