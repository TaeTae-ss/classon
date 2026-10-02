package com.spring.classon.oneday.service;

import com.spring.classon.common.dto.PageRequestDTO;
import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.oneday.dto.ProductResponseDTO;

public interface ProductService {

    // 카테고리별 상품 목록 조회
    PageResponseDTO<ProductResponseDTO> findProducts(Long categoryId, PageRequestDTO pageRequestDTO);
}
