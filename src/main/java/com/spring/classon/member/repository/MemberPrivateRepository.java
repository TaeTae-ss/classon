package com.spring.classon.member.repository;

import com.spring.classon.member.entity.MemberPrivate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberPrivateRepository extends JpaRepository<MemberPrivate, Long> {

    // 이메일 중복 확인
    boolean existsByMemEmail(String memEmail);

    // 이메일로 회원 조회
    Optional<MemberPrivate> findByMemEmail(String memEmail);
}