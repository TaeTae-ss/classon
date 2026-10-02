package com.spring.classon.oneday.controller;

import com.spring.classon.common.dto.PageRequestDTO;
import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.oneday.dto.ProductResponseDTO;
import com.spring.classon.oneday.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private static final int MAX_PAGE_SIZE = 100;

    private final ProductService productService;

    // 상품 목록 조회 (categoryId 생략 시 전체 조회)
    @GetMapping("/api/v1/products")
    public ResponseEntity<PageResponseDTO<ProductResponseDTO>> findProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);

        PageRequestDTO pageRequestDTO = new PageRequestDTO(safePage, safeSize);

        return ResponseEntity.ok(
                productService.findProducts(categoryId, pageRequestDTO)
        );
    }
}
