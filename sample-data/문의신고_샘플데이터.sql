-- CLASS:ON 문의 데이터 20건
-- 회원 정보가 사전에 등록되어 있어야 합니다.
-- Oracle SQL Developer에서 F5로 실행하세요.
-- 기존 데이터는 삭제하거나 변경하지 않습니다.
-- 상태는 접수와 완료 두 가지를 사용합니다.
-- 관리자 답변이 없는 문의는 접수, 답변이 있는 문의는 완료입니다.
-- 상태 값은 현재 SQL의 한글 저장 방식에 맞췄습니다.
-- 실제 DB가 RECEIVED/COMPLETED 코드를 사용한다면 실행 전에 상태 값을 맞추세요.
-- 이전 제목의 동일 문의도 중복 등록되지 않도록 제목 끝부분을 비교합니다.
-- 기존에 등록된 데이터의 제목이나 상태는 변경하지 않습니다.

DECLARE
v_member_count NUMBER;
    v_inserted NUMBER := 0;
BEGIN
SAVEPOINT before_inquiries;

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
            '필요한 회원 20명이 없습니다. 회원 정보를 먼저 확인하세요. 현재: ' || v_member_count);
END IF;

    -- 01. minseo.kim@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 20, '클래스 예약 방법 문의',
       '처음 이용합니다. 클래스 예약 절차를 알려주세요.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'minseo.kim@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '클래스 예약 방법 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('클래스 예약 방법 문의')) = '클래스 예약 방법 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 02. jiwoo.lee@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 19, '예약 날짜 변경 문의',
       '예약한 클래스의 날짜를 변경할 수 있는지 궁금합니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'jiwoo.lee@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '예약 날짜 변경 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('예약 날짜 변경 문의')) = '예약 날짜 변경 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 03. doyun.park@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 18, '결제 수단 문의',
       '클래스 결제에 사용할 수 있는 결제 수단을 알려주세요.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'doyun.park@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '결제 수단 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('결제 수단 문의')) = '결제 수단 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 04. haeun.choi@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 17, '예약 취소 요청',
       '개인 사정으로 예약을 취소하고 싶습니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'haeun.choi@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '예약 취소 요청' OR SUBSTR(i.INQ_TITLE, -LENGTH('예약 취소 요청')) = '예약 취소 요청')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 05. seojun.jung@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 16, '환불 처리 기간 문의',
       '환불 신청 후 처리까지 얼마나 걸리는지 궁금합니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'seojun.jung@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '환불 처리 기간 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('환불 처리 기간 문의')) = '환불 처리 기간 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 06. subin.kang@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 15, '클래스 준비물 문의',
       '클래스에 참여할 때 준비할 물품이 있나요?', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'subin.kang@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '클래스 준비물 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('클래스 준비물 문의')) = '클래스 준비물 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 07. jiho.cho@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 14, '강사 등록 절차 문의',
       '강사로 등록하려면 어떤 절차가 필요한가요?', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'jiho.cho@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '강사 등록 절차 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('강사 등록 절차 문의')) = '강사 등록 절차 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 08. yerin.yoon@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 13, '회원정보 수정 문의',
       '회원정보에 등록된 연락처를 변경하고 싶습니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'yerin.yoon@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '회원정보 수정 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('회원정보 수정 문의')) = '회원정보 수정 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 09. hyunwoo.jang@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 12, '결제 오류 문의',
       '결제 중 오류가 발생해 확인을 요청합니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'hyunwoo.jang@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '결제 오류 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('결제 오류 문의')) = '결제 오류 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 10. chaewon.lim@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 11, '클래스 일정 변경 요청',
       '예약한 클래스 일정이 변경되어 확인을 요청합니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'chaewon.lim@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '클래스 일정 변경 요청' OR SUBSTR(i.INQ_TITLE, -LENGTH('클래스 일정 변경 요청')) = '클래스 일정 변경 요청')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 11. yujin.han@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 10, '예약 내역 확인 문의',
       '결제를 마쳤지만 예약 내역이 표시되지 않아 확인을 요청합니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'yujin.han@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '예약 내역 확인 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('예약 내역 확인 문의')) = '예약 내역 확인 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 12. junseo.oh@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 9, '강사 수업 시작 시간 문의',
       '수업 시작 시간이 변경되었는지 확인 부탁드립니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'junseo.oh@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '강사 수업 시작 시간 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('강사 수업 시작 시간 문의')) = '강사 수업 시작 시간 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 13. daeun.seo@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 8, '클래스 설명 확인 문의',
       '클래스 상세 설명에 기재된 수업 내용을 확인하고 싶습니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'daeun.seo@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '클래스 설명 확인 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('클래스 설명 확인 문의')) = '클래스 설명 확인 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 14. taemin.shin@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '접수', SYSDATE - 7, '예약 취소 처리 지연 문의',
       '예약 취소를 신청했지만 처리가 지연되고 있습니다.', NULL, NULL
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'taemin.shin@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '예약 취소 처리 지연 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('예약 취소 처리 지연 문의')) = '예약 취소 처리 지연 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 15. soyun.kwon@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '완료', SYSDATE - 6, '예약 완료 확인 문의',
       '클래스 예약이 정상 완료되었는지 확인하고 싶습니다.', '문의 내용을 확인하고 처리를 완료했습니다.', SYSDATE - 6 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'soyun.kwon@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '예약 완료 확인 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('예약 완료 확인 문의')) = '예약 완료 확인 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 16. geonwoo.hwang@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '완료', SYSDATE - 5, '결제 취소 확인 문의',
       '결제 취소가 정상 처리되었는지 확인해 주세요.', '문의 내용을 확인하고 처리를 완료했습니다.', SYSDATE - 5 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'geonwoo.hwang@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '결제 취소 확인 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('결제 취소 확인 문의')) = '결제 취소 확인 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 17. nayeon.ahn@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '완료', SYSDATE - 4, '환불 처리 결과 문의',
       '환불 요청의 최종 처리 결과를 확인하고 싶습니다.', '문의 내용을 확인하고 처리를 완료했습니다.', SYSDATE - 4 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'nayeon.ahn@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '환불 처리 결과 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('환불 처리 결과 문의')) = '환불 처리 결과 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 18. siwoo.song@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '완료', SYSDATE - 3, '강사 승인 결과 문의',
       '강사 등록 신청 승인 결과를 확인하고 싶습니다.', '문의 내용을 확인하고 처리를 완료했습니다.', SYSDATE - 3 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'siwoo.song@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '강사 승인 결과 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('강사 승인 결과 문의')) = '강사 승인 결과 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 19. jian.ryu@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '완료', SYSDATE - 2, '계정 복구 문의',
       '로그인 문제로 계정 복구 방법을 문의합니다.', '문의 내용을 확인하고 처리를 완료했습니다.', SYSDATE - 2 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'jian.ryu@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '계정 복구 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('계정 복구 문의')) = '계정 복구 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    -- 20. yejun.hong@maver.com.kr
INSERT INTO INQUIRY (
    INQ_MEM_NO, INQ_STATUS, INQ_CREATED_AT, INQ_TITLE,
    INQ_CONTENT, ADM_COMMENT, PRO_CREATED_AT
)
SELECT m.MEM_NO, '완료', SYSDATE - 1, '클래스 후기 삭제 문의',
       '작성한 클래스 후기를 삭제하는 방법을 알려주세요.', '문의 내용을 확인하고 처리를 완료했습니다.', SYSDATE - 1 + 1
FROM MEMBER m
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = m.MEM_NO
WHERE p.MEM_EMAIL = 'yejun.hong@maver.com.kr'
  AND NOT EXISTS (
    SELECT 1 FROM INQUIRY i
    WHERE i.INQ_MEM_NO = m.MEM_NO
      AND (i.INQ_TITLE = '클래스 후기 삭제 문의' OR SUBSTR(i.INQ_TITLE, -LENGTH('클래스 후기 삭제 문의')) = '클래스 후기 삭제 문의')
);
v_inserted := v_inserted + SQL%ROWCOUNT;

    DBMS_OUTPUT.PUT_LINE('추가된 문의: ' || v_inserted || '건');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK TO before_inquiries;
        RAISE;
END;
/

-- 결과 확인 후 필요한 경우 별도로 COMMIT을 실행하세요.
-- COMMIT;

-- 이번 스크립트의 대상 회원에 대한 문의 내역 확인
SELECT i.INQ_NO, p.MEM_EMAIL, i.INQ_STATUS, i.INQ_TITLE,
       i.ADM_COMMENT, i.PRO_CREATED_AT
FROM INQUIRY i
         JOIN MEMBER_PRIVATE p ON p.MEM_NO = i.INQ_MEM_NO
WHERE p.MEM_EMAIL IN (
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
    )
ORDER BY i.INQ_NO;
