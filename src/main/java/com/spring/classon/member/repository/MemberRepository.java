package com.spring.classon.member.repository;

import com.spring.classon.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // 닉네임 중복 확인
    boolean existsByMemNickname(String memNickname);
}