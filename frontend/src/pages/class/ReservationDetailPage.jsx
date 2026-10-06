import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { classes, findClass, getSchedules, initialReservations, money, useStore } from "../../mocks/data";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import { ClassSummary } from "../../components/common/ClassSummary";
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

export default function ReservationDetailPage({ cancel = false, status = false }) {
  const schedules = getSchedules();
  const { rsvNo } = useParams();
  const navigate = useNavigate();
  const [reservations, setReservations] = useStore(
    "reservations",
    initialReservations,
  );
  const [list] = useStore("classes", classes);
  const r = reservations.find((x) => x.id === Number(rsvNo));
  const [reason, setReason] = useState("");
  const [newStatus, setNewStatus] = useState(r?.status || "예약완료");
  if (!r)
    return (
      <Empty to="/reservation/member/1" label="예약 내역">
        예약 정보를 찾을 수 없습니다.
      </Empty>
    );
  const item = findClass(r.classId, list);
  const s = schedules.find((x) => x.id === r.scheduleId);
  const update = () => {
    setReservations((v) =>
      v.map((x) =>
        x.id === r.id
          ? { ...x, status: cancel ? "취소" : newStatus, cancelReason: reason }
          : x,
      ),
    );
    navigate(`/reservation/${r.id}`);
  };
  return (
    <div className="max-w-[648px] mx-auto my-[46px]">
      <Heading
        title={
          cancel
            ? "예약을 취소할까요?"
            : status
              ? "예약 상태 변경"
              : "예약 상세"
        }
      />
      <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
        <ClassSummary reservation={r} list={list} />
        <dl className="grid grid-cols-[150px_1fr] gap-[17px] my-[26px] max-md:grid-cols-[120px_1fr] max-[420px]:grid-cols-[100px_minmax(0,1fr)]">
          {[
            ["예약 번호", r.id],
            ["수업 일정", `${s?.date} ${s?.time}`],
            ["예약 인원", `${r.count}명`],
            ["예약 상태", r.status],
            ["결제 금액", money((item?.price || 0) * r.count)],
          ].map(([k, v]) => (
            <FragmentRow key={k} label={k} value={v} />
          ))}
        </dl>
        {cancel ? (
          <>
            <p>예약을 취소하면 예시 데이터의 상태가 변경됩니다.</p>
            <Field label="취소 사유">
              <textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="취소 사유를 입력해주세요."
              />
            </Field>
            <div className="flex justify-between items-center border-t border-[#eee] py-[22px] mt-[18px]">
              <span>예상 환불 금액</span>
              <strong className="text-[28px] text-[#ef770e]">
                {money(r.paid ? (item?.price || 0) * r.count : 0)}
              </strong>
            </div>
            <p className="text-[13px] leading-[1.8] text-[#999]">
              미리보기에서는 실제 결제 취소 및 환불이 발생하지 않습니다.
            </p>
            <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
              <button
                className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                disabled={
                  !reason.trim() ||
                  r.status === "취소" ||
                  r.status === "수강완료"
                }
                onClick={update}
              >
                취소하기
              </button>
              <ButtonLink secondary to={`/reservation/${r.id}`}>
                돌아가기
              </ButtonLink>
            </div>
          </>
        ) : status ? (
          <>
            <Field label="예약 상태">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {["결제대기", "예약완료", "수강완료", "취소"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
            <button className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed" onClick={update}>
              상태 저장
            </button>
          </>
        ) : (
          <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
            {!["취소", "수강완료"].includes(r.status) && (
              <>
                <ButtonLink secondary to={`/reservation/${r.id}/edit`}>
                  예약 수정
                </ButtonLink>
                <ButtonLink secondary to={`/reservation/${r.id}/cancel`}>
                  예약 취소
                </ButtonLink>
              </>
            )}
            {r.status === "수강완료" && (
              <ButtonLink to={`/reservation/${r.id}/review`}>
                후기 작성
              </ButtonLink>
            )}
            {r.status === "결제대기" && (
              <ButtonLink to={`/payment/${r.id}`}>결제 진행</ButtonLink>
            )}
            {r.paid && (
              <ButtonLink secondary to={`/payment/reservation/${r.id}`}>
                결제 정보
              </ButtonLink>
            )}
          </div>
        )}
      </section>
      <ButtonLink secondary to="/reservation/member/1">
        예약 내역 보기
      </ButtonLink>
    </div>
  );
}
