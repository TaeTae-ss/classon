package com.spring.classon.oneday.util;

import com.spring.classon.oneday.exception.InvalidImageException;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class ProductImageStorage {

    private static final int THUMB_SIZE = 300;

    // 상품 이미지 원본 저장 + 썸네일 생성
    public ProductImagePaths store(MultipartFile image) {

        if (image == null || image.isEmpty()) {
            throw new InvalidImageException("이미지 파일이 비어 있습니다.");
        }

        String contentType = image.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidImageException("이미지 파일만 업로드할 수 있습니다.");
        }

        String extension = extractExtension(image.getOriginalFilename());
        String fileName = UUID.randomUUID() + "." + extension;

        try {
            Path originDir = Paths.get(System.getProperty("user.dir"), "uploads", "oneday", "origin");
            Path thumbDir = Paths.get(System.getProperty("user.dir"), "uploads", "oneday", "thumb");

            Files.createDirectories(originDir);
            Files.createDirectories(thumbDir);

            Path originPath = originDir.resolve(fileName);
            Path thumbPath = thumbDir.resolve(fileName);

            image.transferTo(originPath);

            Thumbnails.of(originPath.toFile())
                    .size(THUMB_SIZE, THUMB_SIZE)
                    .keepAspectRatio(true)
                    .toFile(thumbPath.toFile());

            return new ProductImagePaths(
                    "/uploads/oneday/origin/" + fileName,
                    "/uploads/oneday/thumb/" + fileName
            );

        } catch (IOException e) {
            throw new InvalidImageException("이미지 저장에 실패했습니다.");
        }
    }

    private String extractExtension(String originalFilename) {

        if (originalFilename == null || !originalFilename.contains(".")) {
            return "jpg";
        }

        return originalFilename.substring(originalFilename.lastIndexOf('.') + 1);
    }
}
