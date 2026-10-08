
export const PAYMENT_TERMS = {
  reservation: {
    title: "예약·취소 및 환불 규정",
    content: `1. 예약 확인
예약은 플랫폼에서 안내하는 절차에 따라 신청하며, 예약 상태는 예약 내역에서 확인할 수 있습니다.

2. 예약 취소
예약 취소 가능 여부와 취소 방법은 클래스별로 안내된 취소 정책을 따릅니다. 취소를 신청하기 전에 해당 클래스의 취소 가능 시점과 유의사항을 확인해 주세요.

3. 환불
환불 가능 여부와 환불 금액은 적용되는 취소 정책 및 관련 법령에 따라 결정됩니다. 환불 처리에는 결제수단 및 결제대행사의 처리 절차에 따라 시간이 걸릴 수 있습니다.

4. 클래스 운영 변경
강사의 사정이나 불가피한 사유로 클래스가 취소 또는 변경되는 경우, 플랫폼에 안내된 절차에 따라 예약 변경 또는 환불을 진행합니다.`,
  },
  payment: {
    title: "결제 진행 및 유의사항",
    content: `1. 결제 금액
결제 페이지에 표시된 예약 인원과 총 결제 금액을 확인한 후 결제를 진행해 주세요.

2. 결제 처리
결제는 토스페이먼츠 결제창을 통해 진행됩니다. 결제 요청 후 결제 결과에 따라 결제 성공 또는 실패 화면으로 이동할 수 있습니다.

3. 중복 결제 및 오류
결제 진행 중 오류가 발생하면 결제 결과를 먼저 확인해 주세요. 결제가 완료되었는지 확인하지 않은 상태에서 반복 결제하지 않도록 주의해 주세요.

4. 결제 정보
결제 승인 및 거래 확인에 필요한 주문 정보와 결제 결과가 처리될 수 있습니다. 카드번호 등 민감한 결제정보의 처리 방식은 결제대행사의 안내를 확인해 주세요.`,
  },
  privacy: {
    title: "개인정보 처리 안내",
    content: `1. 처리 목적
예약 확인, 결제 처리, 결제 결과 확인 및 고객 문의 대응을 위해 필요한 개인정보를 처리합니다.

2. 처리 항목
회원 식별정보, 예약정보, 주문번호, 결제금액 및 결제 처리 결과 등이 처리될 수 있습니다. 실제 처리 항목은 서비스 구현 및 결제 연동 방식에 따라 달라질 수 있습니다.

3. 처리 및 보관
개인정보는 서비스 제공에 필요한 범위에서 처리하며, 보관 기간과 파기 방법은 서비스의 개인정보 처리방침 및 관련 법령에 따릅니다.

4. 결제대행
결제 처리를 위해 토스페이먼츠 등 결제 관련 서비스가 이용될 수 있습니다. 실제 개인정보 제공 여부와 제공 항목은 적용되는 결제 연동 및 개인정보 처리방침을 기준으로 안내해야 합니다.`,
  },
};

export function PaymentTermsModal({ termKey, onClose }) {
  const term = PAYMENT_TERMS[termKey];

  if (!term) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-terms-title"
        className="w-full max-w-[560px] max-h-[80vh] overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#eee] p-5">
          <h2
            id="payment-terms-title"
            className="text-lg font-bold text-[#1F2937]"
          >
            {term.title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="약관 닫기"
            className="text-2xl text-[#6B7280] hover:text-[#1F2937]"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          <p className="whitespace-pre-line text-sm leading-7 text-[#4B5563]">
            {term.content}
          </p>
        </div>

        <div className="border-t border-[#eee] p-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#F97316] px-5 py-2.5 font-semibold text-white hover:bg-[#EA580C]"
          >
            확인
          </button>
        </div>
      </section>
    </div>
  );
}