package com.spring.classon.oneday.service;

import com.spring.classon.common.dto.PageRequestDTO;
import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.oneday.dto.ProductDetailResponseDTO;
import com.spring.classon.oneday.dto.ProductRequestDTO;
import com.spring.classon.oneday.dto.ProductResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface OneDayService {

    // 카테고리별 상품 목록 조회
    PageResponseDTO<ProductResponseDTO> findProducts(Long categoryId, PageRequestDTO pageRequestDTO);

    // 강사 본인 클래스 목록 조회
    List<ProductResponseDTO> findMyProducts(Long memNo);

    // 상품 상세 조회
    ProductDetailResponseDTO getProductDetail(Long clsNo);

    // 상품 등록 (강사 / 관리자)
    Long registerProduct(Long memNo, ProductRequestDTO dto, MultipartFile image);

    // 상품 수정 (본인 클래스에 한해 강사 / 관리자, 이미지는 보낸 경우에만 교체)
    void updateProduct(Long memNo, Long clsNo, ProductRequestDTO dto, MultipartFile image);
}
