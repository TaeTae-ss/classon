
package com.spring.classon.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 업로드된 이미지 및 파일 정적 서빙
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // 원데이 클래스 이미지
        registry.addResourceHandler("/uploads/oneday/**")
                .addResourceLocations(
                        "file:" + System.getProperty("user.dir") + "/uploads/oneday/"
                );

        // 회원 프로필 이미지
        registry.addResourceHandler("/uploads/member/**")
                .addResourceLocations(
                        "file:" + System.getProperty("user.dir") + "/uploads/member/"
                );

        // 강사 신청 증빙자료
        registry.addResourceHandler("/uploads/instructor/**")
                .addResourceLocations(
                        "file:" + System.getProperty("user.dir") + "/uploads/instructor/"
                );
    }
}
