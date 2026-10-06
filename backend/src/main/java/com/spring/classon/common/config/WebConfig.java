package com.spring.classon.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 업로드된 상품 이미지 정적 서빙
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/uploads/oneday/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/oneday/");
    }
}
