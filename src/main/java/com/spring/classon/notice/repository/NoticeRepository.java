package com.spring.classon.notice.repository;

import com.spring.classon.notice.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    // 제목 또는 내용 검색
    Page<Notice> findByNotTitleContainingOrNotContentContaining(
            String titleKeyword,
            String contentKeyword,
            Pageable pageable
    );
}