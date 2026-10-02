package com.spring.classon.member.repository;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class MyPageRepository {

    private final EntityManager entityManager;

    // 내가 수강하는 클래스
    public List<Object[]> getMyClasses(Long memNo) {

        String sql = """
        SELECT
            o.cls_no,
            o.cls_name,
            o.cls_img_thumb,
            o.cls_price,
            o.cls_road_addr,
            o.cls_detail_addr,
            s.sch_no,
            s.sch_start_date
        FROM RESERVATION r
        JOIN SCHEDULE s
            ON r.sch_no = s.sch_no
        JOIN ONEDAY o
            ON s.cls_no = o.cls_no
        WHERE r.mem_no = :memNo
        ORDER BY s.sch_start_date DESC
        """;

        return entityManager
                .createNativeQuery(sql)
                .setParameter("memNo", memNo)
                .getResultList();
    }
}