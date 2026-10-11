package com.spring.classon.favorite.repository;

import com.spring.classon.favorite.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite , Long > {
    // 로그인 회원의 찜 목록 조회
    List<Favorite> findByMemNoOrderByFavNoDesc(Long memNo);

    // 동일 클래스 중복 찜 확인
    boolean existsByMemNoAndClsNo(Long memNo, Long clsNo);

    // 로그인 회원의 찜인지 확인
    Optional<Favorite> findByFavNoAndMemNo(Long favNo, Long memNo);

    // 추가한 부분
    // 회원의 찜 목록 삭제
    void deleteAllByMemNo(Long memNo);
}
