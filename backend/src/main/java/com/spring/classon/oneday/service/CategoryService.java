package com.spring.classon.oneday.service;

import com.spring.classon.oneday.dto.CategoryResponseDTO;

import java.util.List;

public interface CategoryService {

    // 카테고리 전체 목록 조회
    List<CategoryResponseDTO> getCategories();
}
