package com.spring.classon.member.repository;

import com.spring.classon.member.entity.MemberPrivate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberPrivateRepository extends JpaRepository<MemberPrivate, Long> {

    // 이메일 중복 확인
    boolean existsByMemEmail(String memEmail);
}