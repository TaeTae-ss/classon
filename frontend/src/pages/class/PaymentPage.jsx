
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

import { getReservation } from "../../api/reservationApi";
import { createPayment } from "../../api/paymentApi";

import { PaymentTermsModal } from "../../components/payment/PaymentTermsModal";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

export default function PaymentPage() {
  const { rsvNo } = useParams();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");

  // 약관 동의 상태
  const [agreements, setAgreements] = useState({
    reservation: false,
    payment: false,
    privacy: false,
  });

  // 현재 열려 있는 약관 모달
  const [selectedTerm, setSelectedTerm] = useState(null);

  // 필수 약관 전체 동의 여부
  const allAgreed = Object.values(agreements).every(Boolean);

  // 예약 정보 조회
  useEffect(() => {
    let cancelled = false;

    const loadReservation = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getReservation(rsvNo);

        if (!cancelled) {
          setReservation(data);
        }
      } catch (error) {
        console.error("예약 정보 조회 실패:", error);

        if (!cancelled) {
          setError("예약 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (rsvNo) {
      loadReservation();
    } else {
      setError("예약 번호가 없습니다.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [rsvNo]);

  // 개별 약관 동의
  const handleAgreementChange = (key, checked) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  // 전체 약관 동의
  const handleAllAgreementChange = (checked) => {
    setAgreements({
      reservation: checked,
      payment: checked,
      privacy: checked,
    });
  };

  // 결제 진행
  const handlePayment = async () => {
    if (paymentLoading) return;

    if (!allAgreed) {
      alert("필수 약관에 모두 동의해주세요.");
      return;
    }

    if (!reservation || reservation.rsvStatus !== "WAIT") {
      setError("현재 상태에서는 결제를 진행할 수 없습니다.");
      return;
    }

    if (!CLIENT_KEY) {
      setError("토스페이먼츠 클라이언트 키를 확인해주세요.");
      return;
    }

    try {
      setPaymentLoading(true);
      setError("");

      // 1. 백엔드에서 결제 정보 생성
      const paymentData = await createPayment(reservation.rsvNo);

      // 2. Toss Payments SDK 초기화
      const tossPayments = await loadTossPayments(CLIENT_KEY);

      // 3. 결제 요청 객체 생성
      const payment = tossPayments.payment({
        customerKey: `member_${reservation.memNo}`,
      });

      // 4. Toss 결제창 호출
      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: paymentData.payAmount,
        },
        orderId: paymentData.orderNo,
        orderName: `원데이클래스 예약 ${reservation.rsvNo}`,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);

      setError(
        error?.message || "결제를 진행하지 못했습니다."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // 예약 조회 중
  if (loading) {
    return (
      <div className="max-w-[648px] mx-auto my-[46px]">
        예약 정보를 불러오는 중입니다.
      </div>
    );
  }

  // 예약 조회 실패
  if (error && !reservation) {
    return (
      <Empty to="/reservation/member/1" label="예약 내역">
        {error}
      </Empty>
    );
  }

  // 예약 정보 없음
  if (!reservation) {
    return (
      <Empty to="/reservation/member/1" label="예약 내역">
        예약 정보를 찾을 수 없습니다.
      </Empty>
    );
  }

  // 결제할 수 없는 예약 상태
  if (reservation.rsvStatus !== "WAIT") {
    return (
      <Empty
        to={`/reservation/${reservation.rsvNo}`}
        label="예약 확인"
      >
        현재 상태에서는 결제를 진행할 수 없습니다.
      </Empty>
    );
  }

  return (
    <div className="max-w-[648px] mx-auto my-[46px]">
      <Heading title="결제하기" />

      <form
        className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]"
        onSubmit={(e) => {
          e.preventDefault();
          handlePayment();
        }}
      >
        {/* 예약 정보 */}
        <h2>예약 정보</h2>

        <div className="mt-[18px] space-y-3">
          <p>예약 번호 : {reservation.rsvNo}</p>

          <p>예약 인원 : {reservation.rsvCount}명</p>

          <p>
            결제 금액 :{" "}
            {reservation.rsvAmount?.toLocaleString()}원
          </p>
        </div>

        {/* 약관 동의 */}
        <h2 style={{ marginTop: 28 }}>약관 동의</h2>

        <div className="mt-[14px] rounded-lg border border-[#eee] p-4">
          {/* 전체 동의 */}
          <label className="flex items-center gap-2 border-b border-[#eee] pb-3 font-semibold">
            <input
              type="checkbox"
              checked={allAgreed}
              onChange={(e) =>
                handleAllAgreementChange(e.target.checked)
              }
            />
            전체 약관에 동의합니다.
          </label>

          {/* 개별 약관 */}
          {[
            {
              key: "reservation",
              label: "예약·취소 및 환불 규정",
            },
            {
              key: "payment",
              label: "결제 진행 및 유의사항",
            },
            {
              key: "privacy",
              label: "개인정보 처리 안내",
            },
          ].map((term) => (
            <div
              key={term.key}
              className="flex items-center justify-between gap-3 pt-3"
            >
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={agreements[term.key]}
                  onChange={(e) =>
                    handleAgreementChange(
                      term.key,
                      e.target.checked
                    )
                  }
                />

                <span>
                  <span className="font-semibold text-[#F97316]">
                    [필수]
                  </span>{" "}
                  {term.label}
                </span>
              </label>

              <button
                type="button"
                onClick={() => setSelectedTerm(term.key)}
                className="shrink-0 text-sm text-[#6B7280] underline underline-offset-4 hover:text-[#F97316]"
              >
                약관 보기
              </button>
            </div>
          ))}
        </div>

        {/* 오류 메시지 */}
        {error && (
          <p className="mt-[16px] text-red-500 text-[14px]">
            {error}
          </p>
        )}

        {/* 결제 금액 */}
        <div className="flex justify-between items-center border-t border-[#eee] py-[22px] mt-[18px]">
          <span>총 금액 · {reservation.rsvCount}명</span>

          <strong className="text-[28px] text-[#F97316]">
            {reservation.rsvAmount?.toLocaleString()}원
          </strong>
        </div>

        <p className="text-[13px] leading-[1.8] text-[#999]">
          결제 정보를 확인한 후 결제를 진행해주세요.
        </p>

        {/* 결제 버튼 */}
        <button
          type="submit"
          disabled={!allAgreed || paymentLoading}
          className="flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed w-fit max-w-full ml-auto"
        >
          {paymentLoading ? "결제 준비 중..." : "결제하기"}
        </button>
      </form>

      {/* 약관 모달 */}
      {selectedTerm && (
        <PaymentTermsModal
          termKey={selectedTerm}
          onClose={() => setSelectedTerm(null)}
        />
      )}
    </div>
  );
}