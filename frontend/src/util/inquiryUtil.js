export const inquiryTypes = ["문의", "클래스 문의", "후기 문의"];

// 이전 링크와 저장된 데이터도 새 문의 유형으로 표시한다.
export function normalizeInquiryType(type) {
  const normalized = {
    "클래스 신고": "클래스 문의",
    "후기 신고": "후기 문의",
    "신고": "문의",
  }[type] || type;
  return inquiryTypes.includes(normalized) ? normalized : "문의";
}
