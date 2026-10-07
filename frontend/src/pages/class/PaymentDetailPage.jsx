import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router";

import { getPayment, confirmPayment } from "../../api/paymentApi";

import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import { ButtonLink } from "../../components/common/ButtonLink";

function FragmentRow({ label, value }) {
  return (
    <>
      <dt className="text-[#888]">{label}</dt>
      <dd className="m-0 font-semibold">{value}</dd>
    </>
  );
}

export default function PaymentDetailPage({
  complete = false,
  status = false,
}) {
  const { payNo } = useParams();
  const [searchParams] = useSearchParams();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Toss 결제 성공 시 전달되는 값
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    const loadPayment = async () => {
      try {
        setLoading(true);
        setError("");

        // -----------------------------------
        // 1. Toss 결제 성공
        // /payment/success?paymentKey=...&orderId=...&amount=...
        // -----------------------------------
        if (paymentKey && orderId && amount) {
          const data = await confirmPayment({
            payKey: paymentKey,
            orderNo: orderId,
            payAmount: Number(amount),
          });

          setPayment(data);
          return;
        }

        // -----------------------------------
        // 2. 일반 결제 상세 조회
        // /payment/detail/:payNo
        // -----------------------------------
        if (payNo) {
          const data = await getPayment(payNo);
          setPayment(data);
          return;
        }

        setError("결제 정보를 찾을 수 없습니다.");
      } catch (error) {
        console.error("결제 정보 처리 실패:", error);

        const message =
          error?.response?.data?.data?.message ||
          error?.response?.data?.message ||
          "결제 정보를 불러오지 못했습니다.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [payNo, paymentKey, orderId, amount]);

  if (loading) {
    return (
      <div className="max-w-[648px] mx-auto my-[46px]">
        결제 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (!payment) {
    return (
      <Empty to="/payment/member/1" label="결제 내역">
        {error || "결제 정보를 찾을 수 없습니다."}
      </Empty>
    );
  }

  const isComplete = complete || payment.payStatus === "PAID";

  return (
    <div className="max-w-[648px] mx-auto my-[46px]">
      <section
        className={`bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px] ${isComplete ? "text-center" : ""
          }`}
      >
        {isComplete && (
          <div className="flex justify-center items-center w-[84px] h-[84px] bg-accent text-white rounded-full text-[48px] mx-auto mb-[30px]">
            ✓
          </div>
        )}

        <Heading
          center={isComplete}
          title={
            isComplete
              ? "결제가 완료되었어요!"
              : status
                ? "결제 상태 변경"
                : "결제 상세"
          }
          description={
            isComplete
              ? "예약이 정상적으로 완료되었습니다."
              : undefined
          }
        />

        <dl
          className="grid grid-cols-[150px_1fr] gap-[17px] my-[26px] max-md:grid-cols-[120px_1fr] max-[420px]:grid-cols-[100px_minmax(0,1fr)]"
          style={{ textAlign: "left" }}
        >
          <FragmentRow
            label="결제 번호"
            value={payment.payNo}
          />

          <FragmentRow
            label="예약 번호"
            value={payment.rsvNo}
          />

          <FragmentRow
            label="주문 번호"
            value={payment.orderNo}
          />

          <FragmentRow
            label="결제 금액"
            value={`${payment.payAmount?.toLocaleString()}원`}
          />

          <FragmentRow
            label="결제 수단"
            value={payment.payMethod || "-"}
          />

          <FragmentRow
            label="결제 상태"
            value={
              payment.payStatus === "PAID"
                ? "완료"
                : payment.payStatus === "CANCEL"
                  ? "취소"
                  : payment.payStatus === "FAIL"
                    ? "실패"
                    : "대기"
            }
          />

          <FragmentRow
            label="결제 일시"
            value={
              payment.payPaidAt ||
              payment.payCreatedAt ||
              "-"
            }
          />

          {payment.payCanceledAt && (
            <FragmentRow
              label="취소 일시"
              value={payment.payCanceledAt}
            />
          )}
        </dl>

        <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
          <ButtonLink
            secondary
            to="/reservation/member/1"
          >
            예약 내역 보기
          </ButtonLink>

          <ButtonLink
            to={`/reservation/${payment.rsvNo}`}
          >
            예약 상세로 이동
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}

