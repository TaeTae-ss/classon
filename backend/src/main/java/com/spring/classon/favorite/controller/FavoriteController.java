package com.spring.classon.favorite.controller;

import com.spring.classon.favorite.dto.FavoriteDTO;
import com.spring.classon.favorite.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    //찜 등록
    @PostMapping
    public Long register(@RequestBody FavoriteDTO favoriteDTO, Authentication authentication) {

        // JWT에서 로그인 회원 정보 조회
        Map<String, Object> claims =
                (Map<String, Object>) authentication.getPrincipal();

        // 로그인 회원 번호 추출
        Long memNo = ((Number) claims.get("memNo")).longValue();

        // 로그인 회원 번호를 찜 정보에 설정
        favoriteDTO.setMemNo(memNo);

        Long favNo = favoriteService.register(favoriteDTO);
        return favNo;

    }

    //찜 목록
    @GetMapping
    public List<FavoriteDTO> getList(Authentication authentication){

        // JWT에서 로그인 회원 정보 조회
        Map<String, Object> claims =
                (Map<String, Object>) authentication.getPrincipal();

        // 로그인 회원 번호 추출
        Long memNo = ((Number) claims.get("memNo")).longValue();

        List<FavoriteDTO> favoriteDTOList = favoriteService.getList(memNo);

        return favoriteDTOList;
    }

    //찜 삭제
    @DeleteMapping("/{favNo}")
    public void remove(
            @PathVariable Long favNo,
            Authentication authentication
    ) {

        Map<String, Object> claims =
                (Map<String, Object>) authentication.getPrincipal();

        Long memNo = ((Number) claims.get("memNo")).longValue();

        favoriteService.remove(favNo, memNo);
    }

}
