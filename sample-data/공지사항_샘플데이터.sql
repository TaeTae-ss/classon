-- CLASS:ON 공지사항 샘플 데이터 10건
-- 기존 공지사항과 제목이 같으면 추가하지 않음
-- NOT_NO는 Oracle IDENTITY 자동 생성

INSERT INTO NOTICE (NOT_TITLE, NOT_CONTENT, NOT_CREATED_AT)
SELECT
    'CLASS:ON 서비스 이용 안내',
    'CLASS:ON 원데이 클래스 서비스 이용 방법을 안내드립니다.',
    LOCALTIMESTAMP
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM NOTICE
    WHERE NOT_TITLE = 'CLASS:ON 서비스 이용 안내'
);

INSERT INTO NOTICE (NOT_TITLE, NOT_CONTENT, NOT_CREATED_AT)
SELECT
    '원데이 클래스 예약 안내',
    '클래스 상세 페이지에서 원하는 일정과 인원을 선택하여 예약할 수 있습니다.',
    LOCALTIMESTAMP
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM NOTICE
    WHERE NOT_TITLE = '원데이 클래스 예약 안내'
);

INSERT INTO NOTICE (NOT_TITLE, NOT_CONTENT, NOT_CREATED_AT)
SELECT
    '클래스 결제 안내',
    '클래스 예약 시 제공되는 결제 수단을 이용해 결제를 진행해 주세요.',
    LOCALTIMESTAMP
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM NOTICE
    WHERE NOT_TITLE = '클래스 결제 안내'
);

INSERT INTO NOTICE (NOT_TITLE, NOT_CONTENT, NOT_CREATED_AT)
SELECT
    '예약 취소 및 환불 안내',
    '예약 취소 및 환불 가능 여부는 클래스별 취소 정책에 따라 달라질 수 있습니다.',
    LOCALTIMESTAMP
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM NOTICE
    WHERE NOT_TITLE = '예약 취소 및 환불 안내'
);

INSERT INTO NOTICE (NOT_TITLE, NOT_CONTENT, NOT_CREATED_AT)
SELECT
    '강사 등록 및 승인 절차 안내',
    '강사 등록 신청 후 관리자 검토 및 승인 절차가 진행됩니다.',
    LOCALTIMESTAMP
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM NOTICE
    WHERE NOT_TITLE = '강사 등록 및 승인 절차 안내'
);

INSERT INTO NOTICE (NOT_TITLE, NOT_CONTENT, NOT_CREATED_AT)
SELECT
    '클래스 준비물 확인 안내',
    '클래스 참여 전 상세 페이지에서 준비물과 유의사항을 확인해 주세요.',
    LOCALTIMESTAMP
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM NOTICE
    WHERE NOT_TITLE = '클래스 준비물 확인 안내'
);

INSERT INTO NOTICE (NOT_TITLE, NOT_CONTENT, NOT_CREATED_AT)
SELECT
    '클래스 후기 작성 안내',
    '클래스 참여 후 이용 경험을 바탕으로 후기를 작성해 주세요.',
    LOCALTIMESTAMP
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM NOTICE
    WHERE NOT_TITLE = '클래스 후기 작성 안내'
);

INSERT INTO NOTICE (NOT_TITLE, NOT_CONTENT, NOT_CREATED_AT)
SELECT
    '고객센터 문의 이용 안내',
    '서비스 이용 중 불편사항이 발생하면 고객센터 문의 기능을 이용해 주세요.',
    LOCALTIMESTAMP
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM NOTICE
    WHERE NOT_TITLE = '고객센터 문의 이용 안내'
);

INSERT INTO NOTICE (NOT_TITLE, NOT_CONTENT, NOT_CREATED_AT)
SELECT
    '부적절한 클래스 및 강사 신고 안내',
    '부적절한 클래스 운영이나 이용약관 위반 사항은 고객센터를 통해 신고할 수 있습니다.',
    LOCALTIMESTAMP
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM NOTICE
    WHERE NOT_TITLE = '부적절한 클래스 및 강사 신고 안내'
);

INSERT INTO NOTICE (NOT_TITLE, NOT_CONTENT, NOT_CREATED_AT)
SELECT
    '개인정보 보호 및 계정 보안 안내',
    '개인정보 보호를 위해 계정 비밀번호를 안전하게 관리해 주세요.',
    LOCALTIMESTAMP
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM NOTICE
    WHERE NOT_TITLE = '개인정보 보호 및 계정 보안 안내'
);

COMMIT;