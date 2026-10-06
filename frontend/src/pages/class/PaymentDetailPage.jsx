import { useState } from "react";
import { useParams } from "react-router";
import { classes, findClass, getSchedules, initialReservations, money, useStore } from "../../mocks/data";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import { Field } from "../../components/common/Field";
import { ButtonLink } from "../../components/common/ButtonLink";

function FragmentRow({ label, value }) {
  return (
    <>
      <dt className="text-[#888]">{label}</dt>
      <dd className="m-0 font-semibold">{value}</dd>
    </>
  );
}

export default function PaymentDetailPage({ complete = false, status = false }) {
  const schedules = getSchedules();
  const { payNo, rsvNo } = useParams();
  const [reservations, setReservations] = useStore(
    "reservations",
    initialReservations,
  );
  const r = reservations.find((x) => x.id === Number(payNo || rsvNo));
  const [list] = useStore("classes", classes);
  const [message, setMessage] = useState("");
  const [paid, setPaid] = useState(r?.paid ? "완료" : "대기");
  if (!r || (!r.paid && !status))
    return (
      <Empty to="/payment/member/1" label="결제 내역">
        결제 정보를 찾을 수 없습니다.
      </Empty>
    );
  const c = findClass(r.classId, list);
  return (
    <div className="max-w-[648px] mx-auto my-[46px]">
      <section className={`bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px] ${complete ? "text-center" : ""}`}>
        {complete && <div className="flex justify-center items-center w-[84px] h-[84px] bg-accent text-white rounded-full text-[48px] mx-auto mb-[30px]">✓</div>}
        <Heading
          title={
            complete
              ? "결제가 완료되었어요!"
              : status
                ? "결제 상태 변경"
                : "결제 상세"
          }
          description={
            complete ? "예시 예약이 정상적으로 완료되었습니다." : undefined
          }
        />
        <dl className="grid grid-cols-[150px_1fr] gap-[17px] my-[26px] max-md:grid-cols-[120px_1fr] max-[420px]:grid-cols-[100px_minmax(0,1fr)]" style={{ textAlign: "left" }}>
          {[
            ["예약 번호", r.id],
            ["클래스명", c?.title || "삭제된 클래스"],
            ["클래스 일정", schedules.find((s) => s.id === r.scheduleId)?.date],
            ["예약 인원", `${r.count}명`],
            ["결제 금액", money((c?.price || 0) * r.count)],
            ["결제 수단", r.method || "-"],
            [
              "결제 상태",
              r.status === "취소" ? "취소" : r.paid ? "완료" : "대기",
            ],
          ].map(([k, v]) => (
            <FragmentRow key={k} label={k} value={v} />
          ))}
        </dl>
        {status && (
          <>
            <Field label="결제 상태">
              <select value={paid} onChange={(e) => setPaid(e.target.value)}>
                <option>대기</option>
                <option>완료</option>
                <option>취소</option>
              </select>
            </Field>
            <button
              className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
              onClick={() => {
                setReservations((v) =>
                  v.map((x) =>
                    x.id === r.id
                      ? {
                          ...x,
                          paid: paid === "완료",
                          status:
                            paid === "취소"
                              ? "취소"
                              : paid === "완료"
                                ? "예약완료"
                                : "결제대기",
                        }
                      : x,
                  ),
                );
                setMessage("예시 결제 상태를 저장했습니다.");
              }}
            >
              상태 저장
            </button>
            {message && (
              <p className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#f3f7f2] text-[#477754] text-[16px]" role="status">
                {message}
              </p>
            )}
          </>
        )}
        <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
          <ButtonLink secondary to="/reservation/member/1">
            예약 내역 보기
          </ButtonLink>
          <ButtonLink to={`/class/${r.classId}`}>클래스 상세로 이동</ButtonLink>
        </div>
      </section>
    </div>
  );
}
