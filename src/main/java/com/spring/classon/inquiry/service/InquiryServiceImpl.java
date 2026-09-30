package com.spring.classon.inquiry.service;

import com.spring.classon.common.dto.PageResponseDTO;
import com.spring.classon.common.exception.InquiryNotFoundException;
import com.spring.classon.inquiry.dto.InquiryDTO;
import com.spring.classon.inquiry.dto.InquiryPageRequestDTO;
import com.spring.classon.inquiry.dto.InquiryRegisterDTO;
import com.spring.classon.inquiry.entity.Inquiry;
import com.spring.classon.inquiry.repository.InquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InquiryServiceImpl implements InquiryService {

    private final InquiryRepository inquiryRepository;

    // 문의 등록
    @Override
    public Long register(InquiryRegisterDTO inquiryDTO) {

        Inquiry inquiry = Inquiry.builder()
                .inqMemNo(inquiryDTO.getInqMemNo())
                .inqTitle(inquiryDTO.getInqTitle())
                .inqContent(inquiryDTO.getInqContent())
                .build();

        Inquiry savedInquiry = inquiryRepository.save(inquiry);

        return savedInquiry.getInqNo();
    }

    // 특정 회원의 문의 목록
    @Override
    @Transactional(readOnly = true)
    public List<InquiryDTO> getListByMember(Long inqMemNo) {

        return inquiryRepository
                .findByInqMemNoOrderByInqCreatedAtDesc(inqMemNo)
                .stream()
                .map(this::entityToDTO)
                .toList();
    }

    // 문의 상세 조회
    @Override
    @Transactional(readOnly = true)
    public InquiryDTO getOne(Long inqNo) {

        Inquiry inquiry = inquiryRepository.findById(inqNo)
                .orElseThrow(() ->
                        new InquiryNotFoundException(
                                "문의사항을 찾을 수 없습니다."
                        ));

        return entityToDTO(inquiry);
    }

    // 관리자 문의 목록 + 검색 + 상태 필터 + 페이징
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<InquiryDTO> getList(
            InquiryPageRequestDTO pageRequestDTO) {

        Pageable pageable =
                pageRequestDTO.getPageable("inqCreatedAt");

        String keyword = pageRequestDTO.getKeyword();
        String status = pageRequestDTO.getStatus();

        if (keyword == null) {
            keyword = "";
        }

        if (status == null) {
            status = "";
        }

        Page<Inquiry> result =
                inquiryRepository.searchAdmin(
                        keyword,
                        status,
                        pageable
                );

        List<InquiryDTO> dtoList = result.getContent()
                .stream()
                .map(this::entityToDTO)
                .toList();

        return new PageResponseDTO<>(
                dtoList,
                pageRequestDTO,
                result.getTotalElements()
        );
    }

    // 관리자 문의 상태 변경
    @Override
    public void modifyStatus(
            Long inqNo,
            String inqStatus) {

        Inquiry inquiry = inquiryRepository.findById(inqNo)
                .orElseThrow(() ->
                        new InquiryNotFoundException(
                                "문의사항을 찾을 수 없습니다."
                        ));

        inquiry.setInqStatus(inqStatus);

        if ("완료".equals(inqStatus)) {
            inquiry.setProCreatedAt(LocalDateTime.now());
        } else {
            inquiry.setProCreatedAt(null);
        }
    }

    // 관리자 문의 답변 등록/수정
    @Override
    public void modifyComment(
            Long inqNo,
            String admComment) {

        Inquiry inquiry = inquiryRepository.findById(inqNo)
                .orElseThrow(() ->
                        new InquiryNotFoundException(
                                "문의사항을 찾을 수 없습니다."
                        ));

        inquiry.setAdmComment(admComment);
    }

    // Entity -> DTO 변환
    private InquiryDTO entityToDTO(Inquiry inquiry) {

        return InquiryDTO.builder()
                .inqNo(inquiry.getInqNo())
                .inqMemNo(inquiry.getInqMemNo())
                .inqStatus(inquiry.getInqStatus())
                .inqCreatedAt(inquiry.getInqCreatedAt())
                .inqTitle(inquiry.getInqTitle())
                .inqContent(inquiry.getInqContent())
                .admComment(inquiry.getAdmComment())
                .proCreatedAt(inquiry.getProCreatedAt())
                .build();
    }
}