import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

import { getReservation } from "../../api/reservationApi";
import {
  createPayment,
  confirmPayment,
} from "../../api/paymentApi";

import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

export default function PaymentPage() {
  const { rsvNo } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [payment, setPayment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");

  const [agree, setAgree] = useState(false);

  useEffect(() => {
    const loadReservation = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getReservation(rsvNo);
        setReservation(data);
      } catch (error) {
        console.error("예약 정보 조회 실패:", error);
        setError("예약 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (rsvNo) {
      loadReservation();
    }
  }, [rsvNo]);

  const handlePayment = async () => {
    if (!agree) {
      alert("이용약관에 동의해주세요.");
      return;
    }

    try {
      setPaymentLoading(true);
      setError("");

      // 1. 백엔드에서 결제 정보 생성
      const paymentData = await createPayment(reservation.rsvNo);

      setPayment(paymentData);

      // 2. Toss Payments SDK 초기화
      const tossPayments = await loadTossPayments(CLIENT_KEY);

      // 3. 결제창 생성
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

  if (loading) {
    return (
      <div className="max-w-[648px] mx-auto my-[46px]">
        예약 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (error && !reservation) {
    return (
      <Empty
        to="/reservation/member/1"
        label="예약 내역"
      >
        {error}
      </Empty>
    );
  }

  if (!reservation) {
    return (
      <Empty
        to="/reservation/member/1"
        label="예약 내역"
      >
        예약 정보를 찾을 수 없습니다.
      </Empty>
    );
  }

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
        <h2>예약 정보</h2>

        <div className="mt-[18px] space-y-3">
          <p>
            예약 번호 : {reservation.rsvNo}
          </p>

          <p>
            예약 인원 : {reservation.rsvCount}명
          </p>

          <p>
            결제 금액 :{" "}
            {reservation.rsvAmount?.toLocaleString()}원
          </p>
        </div>

        <h2 style={{ marginTop: 28 }}>
          결제 수단
        </h2>

        <p className="mt-[14px] text-[#6B7280]">
          결제하기 버튼을 누르면 Toss Payments 결제창이
          열립니다.
        </p>

        <h2 style={{ marginTop: 28 }}>
          이용약관 동의
        </h2>

        <label className="flex items-center gap-[10px] mt-[14px]">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />

          약관 및 주문 내용을 확인하고 동의합니다.
        </label>

        {error && (
          <p className="mt-[16px] text-red-500 text-[14px]">
            {error}
          </p>
        )}

        <div className="flex justify-between items-center border-t border-[#eee] py-[22px] mt-[18px]">
          <span>
            총 금액 · {reservation.rsvCount}명
          </span>

          <strong className="text-[28px] text-[#ef770e]">
            {reservation.rsvAmount?.toLocaleString()}원
          </strong>
        </div>

        <p className="text-[13px] leading-[1.8] text-[#999]">
          결제 정보를 확인한 후 결제를 진행해주세요.
        </p>

        <button
          type="submit"
          disabled={!agree || paymentLoading}
          className="flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed w-fit max-w-full ml-auto"
        >
          {paymentLoading
            ? "결제 준비 중..."
            : "결제하기"}
        </button>
      </form>
    </div>
  );
}