package com.spring.classon.oneday.controller;

import com.spring.classon.oneday.dto.CategoryResponseDTO;
import com.spring.classon.oneday.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // 카테고리 전체 목록 조회
    @GetMapping("/api/v1/categories")
    public ResponseEntity<List<CategoryResponseDTO>> findCategories() {

        return ResponseEntity.ok(
                categoryService.findCategories()
        );
    }
}
