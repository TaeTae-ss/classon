package com.spring.classon.favorite.service;

import com.spring.classon.favorite.dto.FavoriteDTO;
import com.spring.classon.favorite.entity.Favorite;
import com.spring.classon.favorite.mapper.FavoriteMapper;
import com.spring.classon.favorite.repository.FavoriteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService{
    private final FavoriteRepository favoriteRepository;
    private final FavoriteMapper favoriteMapper;

    @Override
    public Long register(FavoriteDTO favoriteDTO){

        Favorite favorite = favoriteMapper.toEntity(favoriteDTO);
        Favorite savedFavorite = favoriteRepository.save(favorite);


        return savedFavorite.getFavNo();
    }

    @Override
    public List<FavoriteDTO> getList(Long memNo) {

        List<Favorite> favorites = favoriteRepository.findByMemNo(memNo);

        List<FavoriteDTO> favoriteDTOList =
                favoriteMapper.toDTOList(favorites);

        return favoriteDTOList;

    }

    @Override
    public void remove(Long favNo){
        favoriteRepository.deleteById(favNo);
    }




}
