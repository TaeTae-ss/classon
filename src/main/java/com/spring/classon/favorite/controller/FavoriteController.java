package com.spring.classon.favorite.controller;

import com.spring.classon.favorite.dto.FavoriteDTO;
import com.spring.classon.favorite.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public List<FavoriteDTO> getList(@RequestParam Long memNo){
        List<FavoriteDTO> favoriteDTOList = favoriteService.getList(memNo);

        return favoriteDTOList;
    }

    @DeleteMapping("/{favNo}")
    public void remove(@PathVariable Long favNo) {
        favoriteService.remove(favNo);
    }

}
