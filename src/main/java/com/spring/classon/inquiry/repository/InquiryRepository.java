package com.spring.classon.inquiry.repository;

import com.spring.classon.inquiry.entity.Inquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InquiryRepository
        extends JpaRepository<Inquiry, Long> {

    List<Inquiry> findByInqMemNoOrderByInqCreatedAtDesc(
            Long inqMemNo
    );

    @Query("""
        SELECT i
        FROM Inquiry i
        WHERE
            (:keyword = '' OR
             i.inqTitle LIKE CONCAT('%', :keyword, '%') OR
             i.inqContent LIKE CONCAT('%', :keyword, '%'))
        AND
            (:status = '' OR i.inqStatus = :status)
        """)
    Page<Inquiry> searchAdmin(
            @Param("keyword") String keyword,
            @Param("status") String status,
            Pageable pageable
    );
}