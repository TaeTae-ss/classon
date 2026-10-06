import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { classes, findClass, initialReservations, money, useStore } from "../../mocks/data";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import { ClassSummary } from "../../components/common/ClassSummary";

export default function PaymentPage() {
  const { rsvNo } = useParams();
  const navigate = useNavigate();
  const [reservations, setReservations] = useStore(
    "reservations",
    initialReservations,
  );
  const r = reservations.find((x) => x.id === Number(rsvNo));
  const [list] = useStore("classes", classes);
  const [method, setMethod] = useState("신용카드");
  const [agree, setAgree] = useState(false);
  if (!r)
    return (
      <Empty to="/reservation/member/1" label="예약 내역">
        예약 정보를 찾을 수 없습니다.
      </Empty>
    );
  if (r.status !== "결제대기")
    return (
      <Empty to={`/reservation/${r.id}`} label="예약 확인">
        현재 상태에서는 결제를 진행할 수 없습니다.
      </Empty>
    );
  const c = findClass(r.classId, list);
  return (
    <div className="max-w-[648px] mx-auto my-[46px]">
      <Heading title="결제하기" />
      <form
        className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!agree) return;
          setReservations((v) =>
            v.map((x) =>
              x.id === r.id
                ? {
                    ...x,
                    status: "예약완료",
                    paid: true,
                    method,
                    paymentId: r.id,
                  }
                : x,
            ),
          );
          navigate(`/payment/${r.id}/success`);
        }}
      >
        <h2>클래스 정보</h2>
        <ClassSummary reservation={r} list={list} />
        <h2 style={{ marginTop: 28 }}>결제 수단</h2>
        {["신용카드", "간편결제", "계좌이체"].map((v) => (
          <label className="flex items-center gap-[10px] mt-[14px]" key={v}>
            <input
              type="radio"
              name="method"
              value={v}
              checked={method === v}
              onChange={() => setMethod(v)}
            />
            {v}
          </label>
        ))}
        <h2 style={{ marginTop: 28 }}>이용약관 동의</h2>
        <label className="flex items-center gap-[10px] mt-[14px]">
          <input
            type="checkbox"
            required
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />{" "}
          약관 및 주문 내용을 확인하고 동의합니다.
        </label>
        <div className="flex justify-between items-center border-t border-[#eee] py-[22px] mt-[18px]">
          <span>총 금액 · {r.count}명</span>
          <strong className="text-[28px] text-[#ef770e]">{money((c?.price || 0) * r.count)}</strong>
        </div>
        <p className="text-[13px] leading-[1.8] text-[#999]">
          화면 확인을 위한 예시 결제입니다. 실제 금액은 청구되지 않습니다.
        </p>
        <button className="flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed w-fit max-w-full ml-auto" disabled={!agree}>
          결제 화면 완료
        </button>
      </form>
    </div>
  );
}
