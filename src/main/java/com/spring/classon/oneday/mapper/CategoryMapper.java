package com.spring.classon.oneday.mapper;

import com.spring.classon.oneday.dto.CategoryResponseDTO;
import com.spring.classon.oneday.entity.Category;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryResponseDTO toDTO(Category category);

    List<CategoryResponseDTO> toDTOList(List<Category> categories);
}
