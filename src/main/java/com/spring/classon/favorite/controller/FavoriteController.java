package com.spring.classon.favorite.controller;

import com.spring.classon.favorite.dto.FavoriteDTO;
import com.spring.classon.favorite.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    public Long register(@RequestBody FavoriteDTO favoriteDTO) {

        Long favNo = favoriteService.register(favoriteDTO);

        return favNo;

    }

}
