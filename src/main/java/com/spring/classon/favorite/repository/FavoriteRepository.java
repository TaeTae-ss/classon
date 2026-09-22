package com.spring.classon.favorite.repository;

import com.spring.classon.favorite.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite , Long > {
}
