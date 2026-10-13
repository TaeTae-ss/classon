package com.spring.classon.instructor.controller;

import com.spring.classon.instructor.service.InstructorService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/admin/instructor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class InstructorDocumentController {

    private final InstructorService instructorService;

    // 강사 신청 증빙자료 파일 조회
    // 공통 ApiResponse 처리와 분리하여 파일 데이터를 직접 반환
    @GetMapping("/{reqNo}/documents/{docNo}/file")
    public void getInstructorDocument(
            @PathVariable Long reqNo,
            @PathVariable Long docNo,
            HttpServletResponse response
    ) throws IOException {

        Resource resource =
                instructorService.getInstructorDocument(reqNo, docNo);

        String filename = URLEncoder
                .encode(resource.getFilename(), StandardCharsets.UTF_8)
                .replace("+", "%20");

        // 이미지 파일은 브라우저에서 미리보기로 표시
        response.setContentType(MediaType.IMAGE_PNG_VALUE);
        response.setHeader(
                HttpHeaders.CONTENT_DISPOSITION,
                "inline; filename*=UTF-8''" + filename
        );
        response.setContentLengthLong(resource.contentLength());

        try (InputStream inputStream = resource.getInputStream()) {
            inputStream.transferTo(response.getOutputStream());
            response.flushBuffer();
        }
    }
}