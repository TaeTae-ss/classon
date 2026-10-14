-- CLASS:ON 문의/신고 샘플 20건 (회원 데이터.txt의 일반 회원 20명 기준)
-- 실행 순서: 회원 데이터.txt -> 이 파일
-- Oracle SQL Developer에서 F5(스크립트 실행) 권장
-- 동일 이메일의 회원이 20명 모두 존재해야 실행됩니다.
-- 기존 데이터는 삭제하지 않으며, 회원 이메일 + 샘플 제목 기준으로 중복 생성을 막습니다.
-- 상태: 접수 8 / 처리중 6 / 완료 6

DECLARE
v_member_count NUMBER;
    v_inserted NUMBER := 0;
BEGIN
SAVEPOINT before_sample_inquiries;

SELECT COUNT(*) INTO v_member_count
FROM MEMBER_PRIVATE
WHERE MEM_EMAIL IN (
                    'minseo.kim@maver.com.kr',
                    'jiwoo.lee@maver.com.kr',
                    'doyun.park@maver.com.kr',
                    'haeun.choi@maver.com.kr',
                    'seojun.jung@maver.com.kr',
                    'subin.kang@maver.com.kr',
                    'jiho.cho@maver.com.kr',
                    'yerin.yoon@maver.com.kr',
                    'hyunwoo.jang@maver.com.kr',
                    'chaewon.lim@maver.com.kr',
                    'yujin.han@maver.com.kr',
                    'junseo.oh@maver.com.kr',
                    'daeun.seo@maver.com.kr',
                    'taemin.shin@maver.com.kr',
                    'soyun.kwon@maver.com.kr',
                    'geonwoo.hwang@maver.com.kr',
                    'nayeon.ahn@maver.com.kr',
                    'siwoo.song@maver.com.kr',
                    'jian.ryu@maver.com.kr',
                    'yejun.hong@maver.com.kr'
    );

IF v_member_count <> 20 THEN
        RAISE_APPLICATION_ERROR(-20001,
            '샘플 회원 20명이 없습니다. 먼저 회원 데이터.txt를 실행하세요. 현재: ' || v_member_count);
END IF;

    -- 01. minseo.kim@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 20, '[샘플] 클래스 예약 방법 문의',
       '처음 이용합니다. 클래스 예약 절차를 알려주세요.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'minseo.kim@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 클래스 예약 방법 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 02. jiwoo.lee@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 19, '[샘플] 예약 날짜 변경 문의',
       '예약한 클래스의 날짜를 변경할 수 있는지 궁금합니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'jiwoo.lee@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 예약 날짜 변경 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 03. doyun.park@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 18, '[샘플] 결제 수단 문의',
       '클래스 결제에 사용할 수 있는 결제 수단을 알려주세요.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'doyun.park@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 결제 수단 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 04. haeun.choi@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 17, '[샘플] 예약 취소 요청',
       '개인 사정으로 예약을 취소하고 싶습니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'haeun.choi@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 예약 취소 요청'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 05. seojun.jung@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 16, '[샘플] 환불 처리 기간 문의',
       '환불 신청 후 처리까지 얼마나 걸리는지 궁금합니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'seojun.jung@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 환불 처리 기간 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 06. subin.kang@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 15, '[샘플] 클래스 준비물 문의',
       '클래스에 참여할 때 준비할 물품이 있나요?', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'subin.kang@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 클래스 준비물 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 07. jiho.cho@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 14, '[샘플] 강사 등록 절차 문의',
       '강사로 등록하려면 어떤 절차가 필요한가요?', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'jiho.cho@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 강사 등록 절차 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 08. yerin.yoon@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 13, '[샘플] 회원정보 수정 문의',
       '회원정보에 등록된 연락처를 변경하고 싶습니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'yerin.yoon@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 회원정보 수정 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 09. hyunwoo.jang@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '처리중', SYSDATE - 12, '[샘플] 결제 오류 문의',
       '결제 중 오류가 발생해 확인을 요청합니다.', '담당자가 내용을 확인하여 처리 중입니다.', SYSDATE - 12 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'hyunwoo.jang@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 결제 오류 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 10. chaewon.lim@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '처리중', SYSDATE - 11, '[샘플] 클래스 일정 변경 요청',
       '예약한 클래스 일정이 변경되어 확인을 요청합니다.', '담당자가 내용을 확인하여 처리 중입니다.', SYSDATE - 11 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'chaewon.lim@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 클래스 일정 변경 요청'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 11. yujin.han@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '처리중', SYSDATE - 10, '[샘플] 예약 확인 오류 신고',
       '결제를 마쳤지만 예약 내역이 표시되지 않아 신고합니다.', '담당자가 내용을 확인하여 처리 중입니다.', SYSDATE - 10 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'yujin.han@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 예약 확인 오류 신고'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 12. junseo.oh@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '처리중', SYSDATE - 9, '[샘플] 강사 지각 관련 신고',
       '강사가 예정된 시간보다 늦게 도착해 신고합니다.', '담당자가 내용을 확인하여 처리 중입니다.', SYSDATE - 9 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'junseo.oh@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 강사 지각 관련 신고'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 13. daeun.seo@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '처리중', SYSDATE - 8, '[샘플] 클래스 설명 불일치 신고',
       '클래스 상세 설명과 실제 수업 내용이 달라 신고합니다.', '담당자가 내용을 확인하여 처리 중입니다.', SYSDATE - 8 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'daeun.seo@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 클래스 설명 불일치 신고'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 14. taemin.shin@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '처리중', SYSDATE - 7, '[샘플] 예약 취소 처리 지연 문의',
       '예약 취소를 신청했지만 처리가 지연되고 있습니다.', '담당자가 내용을 확인하여 처리 중입니다.', SYSDATE - 7 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'taemin.shin@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 예약 취소 처리 지연 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 15. soyun.kwon@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '완료', SYSDATE - 6, '[샘플] 예약 완료 확인 문의',
       '클래스 예약이 정상 완료되었는지 확인하고 싶습니다.', '문의 내용을 확인하고 처리를 완료했습니다.', SYSDATE - 6 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'soyun.kwon@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 예약 완료 확인 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 16. geonwoo.hwang@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '완료', SYSDATE - 5, '[샘플] 결제 취소 확인 문의',
       '결제 취소가 정상 처리되었는지 확인해 주세요.', '문의 내용을 확인하고 처리를 완료했습니다.', SYSDATE - 5 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'geonwoo.hwang@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 결제 취소 확인 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 17. nayeon.ahn@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '완료', SYSDATE - 4, '[샘플] 환불 처리 결과 문의',
       '환불 요청의 최종 처리 결과를 확인하고 싶습니다.', '문의 내용을 확인하고 처리를 완료했습니다.', SYSDATE - 4 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'nayeon.ahn@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 환불 처리 결과 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 18. siwoo.song@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '완료', SYSDATE - 3, '[샘플] 강사 승인 결과 문의',
       '강사 등록 신청 승인 결과를 확인하고 싶습니다.', '문의 내용을 확인하고 처리를 완료했습니다.', SYSDATE - 3 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'siwoo.song@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 강사 승인 결과 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 19. jian.ryu@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '완료', SYSDATE - 2, '[샘플] 계정 복구 문의',
       '로그인 문제로 계정 복구 방법을 문의합니다.', '문의 내용을 확인하고 처리를 완료했습니다.', SYSDATE - 2 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'jian.ryu@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 계정 복구 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 20. yejun.hong@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '완료', SYSDATE - 1, '[샘플] 클래스 후기 수정 문의',
       '작성한 클래스 후기를 수정하는 방법을 알려주세요.', '문의 내용을 확인하고 처리를 완료했습니다.', SYSDATE - 1 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'yejun.hong@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND i.INQ_TITLE = '[샘플] 클래스 후기 수정 문의'
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    DBMS_OUTPUT.PUT_LINE('추가된 문의/신고: ' || v_inserted || '건');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK TO before_sample_inquiries;
        RAISE;
END;
/

-- 정상 실행 확인 후 아래 COMMIT을 실행하세요.
-- COMMIT;

-- 샘플 데이터 검증
SELECT i.INQ_NO, p.MEM_EMAIL, i.INQ_STATUS, i.INQ_TITLE
FROM INQUIRY i
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = i.INQ_MEM_NO
WHERE i.INQ_TITLE LIKE '[샘플]%'
ORDER BY i.INQ_NO;
