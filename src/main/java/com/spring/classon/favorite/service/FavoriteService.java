package com.spring.classon.favorite.service;

import com.spring.classon.favorite.dto.FavoriteDTO;

import java.util.List;

public interface FavoriteService {

    Long register(FavoriteDTO favoriteDTO);

    List<FavoriteDTO> getList(Long memNo);

    void remove(Long favNo);

}
