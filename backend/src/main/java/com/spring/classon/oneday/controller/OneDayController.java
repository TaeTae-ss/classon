package com.spring.classon.oneday.controller;

import com.spring.classon.common.dto.PageRequestDTO;
import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.common.response.ApiResponse;
import com.spring.classon.oneday.dto.ProductDetailResponseDTO;
import com.spring.classon.oneday.dto.ProductRequestDTO;
import com.spring.classon.oneday.dto.ProductResponseDTO;
import com.spring.classon.oneday.service.OneDayService;
import com.spring.classon.oneday.util.CurrentMemberResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class OneDayController {

    private static final int MAX_PAGE_SIZE = 100;

    private final OneDayService oneDayService;

    // 상품 목록 조회
    @GetMapping("/api/v1/oneday")
    public ResponseEntity<PageResponseDTO<ProductResponseDTO>> findProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);

        PageRequestDTO pageRequestDTO = new PageRequestDTO(safePage, safeSize);
        pageRequestDTO.setKeyword(keyword);

        return ResponseEntity.ok(
                oneDayService.findProducts(categoryId, pageRequestDTO)
        );
    }

    // 상품 상세 조회
    @PreAuthorize("permitAll()")
    @GetMapping("/api/v1/oneday/{clsNo}")
    public ResponseEntity<ProductDetailResponseDTO> getProductDetail(@PathVariable Long clsNo) {

        return ResponseEntity.ok(
                oneDayService.getProductDetail(clsNo)
        );
    }

    // 상품 등록 (강사/관리자 접근, 이미지 1장 첨부)
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @PostMapping(value = "/api/v1/oneday", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> registerProduct(
            @RequestPart("dto") ProductRequestDTO dto,
            @RequestPart("image") MultipartFile image
    ) {

        Long memNo = CurrentMemberResolver.getCurrentMemNo();

        Long clsNo = oneDayService.registerProduct(memNo, dto, image);

        return ResponseEntity.status(HttpStatus.CREATED).body(clsNo);
    }

    // 상품 수정 (본인 클래스에 한해 강사/관리자 접근, 이미지는 보낸 경우에만 교체)
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @PutMapping(value = "/api/v1/oneday/{clsNo}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> updateProduct(
            @PathVariable Long clsNo,
            @RequestPart("dto") ProductRequestDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {

        Long memNo = CurrentMemberResolver.getCurrentMemNo();

        oneDayService.updateProduct(memNo, clsNo, dto, image);

        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
