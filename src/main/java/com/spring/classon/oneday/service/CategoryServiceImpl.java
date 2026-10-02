package com.spring.classon.oneday.service;

import com.spring.classon.oneday.dto.CategoryResponseDTO;
import com.spring.classon.oneday.entity.Category;
import com.spring.classon.oneday.mapper.CategoryMapper;
import com.spring.classon.oneday.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    // 카테고리 전체 목록 조회
    @Override
    public List<CategoryResponseDTO> getCategories() {

        List<Category> categories = categoryRepository.findAll(Sort.by("catName"));

        return categoryMapper.toDTOList(categories);
    }
}
