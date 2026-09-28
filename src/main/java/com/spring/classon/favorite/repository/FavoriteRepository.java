package com.spring.classon.favorite.repository;

import com.spring.classon.favorite.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite , Long > {
    List<Favorite> findByMemNoOrderByFavNoDesc(Long memNo);
    boolean existsByMemNoAndClsNo(Long memNo, Long clsNo);
}
