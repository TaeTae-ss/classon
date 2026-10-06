package com.spring.classon.favorite.mapper;

import com.spring.classon.favorite.dto.FavoriteDTO;
import com.spring.classon.favorite.entity.Favorite;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FavoriteMapper {

    FavoriteDTO toDTO(Favorite favorite);

    Favorite toEntity(FavoriteDTO favoriteDTO);

    List<FavoriteDTO> toDTOList(List<Favorite> favorites);
}
