package com.spring.classon.review.mapper;

import com.spring.classon.favorite.dto.FavoriteDTO;
import com.spring.classon.favorite.entity.Favorite;
import com.spring.classon.review.dto.ReviewDTO;
import com.spring.classon.review.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    ReviewDTO toDTO (Review review); // Entity → DTO

    @Mapping(target = "revStatus", ignore = true)
    Review toEntity(ReviewDTO reviewDTO); // DTO → Entity

    List<ReviewDTO> toDTOList(List<Review> reviews);


}
