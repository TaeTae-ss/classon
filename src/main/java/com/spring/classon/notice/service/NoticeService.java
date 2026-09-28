package com.spring.classon.notice.service;

import com.spring.classon.common.dto.PageRequestDTO;
import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.notice.dto.NoticeDTO;
import com.spring.classon.notice.entity.Notice;
import com.spring.classon.notice.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NoticeService {

    private final NoticeRepository noticeRepository;

    // 공지사항 등록
    public Long register(NoticeDTO noticeDTO) {

        Notice notice = Notice.builder()
                .notTitle(noticeDTO.getNotTitle())
                .notContent(noticeDTO.getNotContent())
                .build();

        Notice savedNotice = noticeRepository.save(notice);

        return savedNotice.getNotNo();
    }

    // 공지사항 목록 조회 + 검색 + 페이징
    @Transactional(readOnly = true)
    public PageResponseDTO<NoticeDTO> getList(
            PageRequestDTO pageRequestDTO) {

        Pageable pageable =
                pageRequestDTO.getPageable("notCreatedAt");

        String keyword = pageRequestDTO.getKeyword();

        Page<Notice> result;

        if (keyword != null && !keyword.isBlank()) {

            result = noticeRepository
                    .findByNotTitleContainingOrNotContentContaining(
                            keyword,
                            keyword,
                            pageable
                    );

        } else {

            result = noticeRepository.findAll(pageable);
        }

        List<NoticeDTO> dtoList = result.getContent()
                .stream()
                .map(this::entityToDTO)
                .toList();

        return new PageResponseDTO<>(
                dtoList,
                pageRequestDTO,
                result.getTotalElements()
        );
    }

    // 공지사항 상세 조회
    @Transactional(readOnly = true)
    public NoticeDTO getOne(Long notNo) {

        Notice notice = noticeRepository.findById(notNo)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "공지사항을 찾을 수 없습니다."
                        ));

        return entityToDTO(notice);
    }

    // 공지사항 수정
    public void modify(Long notNo, NoticeDTO noticeDTO) {

        Notice notice = noticeRepository.findById(notNo)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "공지사항을 찾을 수 없습니다."
                        ));

        notice.setNotTitle(noticeDTO.getNotTitle());
        notice.setNotContent(noticeDTO.getNotContent());
    }

    // 공지사항 삭제
    public void remove(Long notNo) {

        Notice notice = noticeRepository.findById(notNo)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "공지사항을 찾을 수 없습니다."
                        ));

        noticeRepository.delete(notice);
    }

    // Entity -> DTO
    private NoticeDTO entityToDTO(Notice notice) {

        return NoticeDTO.builder()
                .notNo(notice.getNotNo())
                .notTitle(notice.getNotTitle())
                .notContent(notice.getNotContent())
                .notCreatedAt(notice.getNotCreatedAt())
                .build();
    }
}