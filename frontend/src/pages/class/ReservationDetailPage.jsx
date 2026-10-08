import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";

import {
  getReservation,
  cancelReservation,
} from "../../api/reservationApi";

import { money } from "../../util/format";

import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import { ClassSummary } from "../../components/common/ClassSummary";
import { Field } from "../../components/common/Field";

function FragmentRow({ label, value }) {
  return (
    <>
      <dt className="text-[#888]">{label}</dt>
      <dd className="m-0 font-semibold">{value}</dd>
    </>
  );
}

const statusLabel = {
  WAIT: "결제대기",
  CONFIRMED: "예약완료",
  COMPLETED: "수강완료",
  CANCEL: "취소",
};

// 이 페이지에서만 사용하는 버튼 스타일
const secondaryButtonStyle =
  "flex flex-1 items-center justify-center min-h-[48px] " +
  "rounded-xl border border-[#E5E7EB] bg-white px-5 py-3 " +
  "font-medium text-[#4B5563] transition hover:bg-[#F9FAFB]";

const primaryButtonStyle =
  "flex flex-1 items-center justify-center min-h-[48px] " +
  "rounded-xl border border-[#F97316] bg-[#F97316] px-5 py-3 " +
  "font-semibold text-white transition hover:bg-[#EA580C]";

export default function ReservationDetailPage({
  cancel = false,
}) {
  const { rsvNo } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
  let active = true;

  const fetchReservation = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReservation(rsvNo);

      if (active) {
        setReservation(data);
      }
    } catch (error) {
      console.error("예약 상세 조회 실패:", error);

      if (active) {
        setError("예약 정보를 불러오지 못했습니다.");
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  };

  if (rsvNo) {
    fetchReservation();
  }

  return () => {
    active = false;
  };
}, [rsvNo, cancel]);

  // 예약 취소
  const handleCancel = async () => {
    if (!reason.trim() || cancelLoading) {
      return;
    }

    try {
      setCancelLoading(true);

      await cancelReservation(rsvNo, reason);

      setReservation((prev) =>
      prev
        ? { ...prev, rsvStatus: "CANCEL" }
        : prev
    );

      navigate(`/reservation/${rsvNo}`, {
        replace: true,
      });
    } catch (error) {
      console.error("예약 취소 실패:", error);
      alert("예약 취소에 실패했습니다.");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="py-10 text-center text-[#777]">
        예약 정보를 불러오는 중입니다.
      </p>
    );
  }

  if (error || !reservation) {
    return (
      <Empty
        to="/reservation/member/1"
        label="예약 내역"
      >
        {error || "예약 정보를 찾을 수 없습니다."}
      </Empty>
    );
  }

  const currentStatus = reservation.rsvStatus;
  const currentStatusLabel =
    statusLabel[currentStatus] ?? currentStatus;

  return (
    <div className="mx-auto my-[46px] max-w-[648px] px-4">
      <Heading
        title={cancel ? "예약을 취소할까요?" : "예약 상세"}
      />

      <section className="mb-[26px] rounded-xl border border-[#EBE6E0] bg-white p-[31px] max-md:p-[23px]">
        <ClassSummary reservation={reservation} />

        {/* 예약 정보 */}
        <dl className="my-[26px] grid grid-cols-[120px_1fr] gap-x-4 gap-y-[17px] max-[420px]:grid-cols-[95px_minmax(0,1fr)]">
          {[
            ["예약 번호", reservation.rsvNo],
            ["강의 일정", reservation.schStartDate],
            ["예약 인원", `${reservation.rsvCount}명`],
            ["예약 상태", currentStatusLabel],
            ["결제 금액", money(reservation.rsvAmount)],
          ].map(([label, value]) => (
            <FragmentRow
              key={label}
              label={label}
              value={value}
            />
          ))}
        </dl>

        {/* 예약 취소 화면 */}
        {cancel ? (
          <>
            {currentStatus === "CANCEL" ? (
              <div className="rounded-lg bg-[#FFF7ED] px-4 py-5 text-center text-[#C2410C]">
                이미 취소된 예약입니다.
              </div>
            ) : currentStatus === "COMPLETED" ? (
              <div className="rounded-lg bg-[#F9FAFB] px-4 py-5 text-center text-[#6B7280]">
                수강이 완료된 예약은 취소할 수 없습니다.
              </div>
            ) : currentStatus !== "CONFIRMED" &&
              currentStatus !== "WAIT" ? (
              <div className="rounded-lg bg-[#F9FAFB] px-4 py-5 text-center text-[#6B7280]">
                현재 예약 상태에서는 취소할 수 없습니다.
              </div>
            ) : (
              <>
                <Field label="취소 사유">
                  <textarea
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="취소 사유를 입력해주세요."
                  />
                </Field>

                <div className="mt-5 flex items-center justify-between border-t border-[#F3E8DC] py-5">
                  <span className="text-[#6B7280]">
                    환불 예정 금액
                  </span>

                  <strong className="text-2xl font-bold text-[#F97316]">
                    {money(reservation.rsvAmount)}
                  </strong>
                </div>

                {/* 취소 화면 버튼 */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Link
                    to={`/reservation/${reservation.rsvNo}`}
                    className={secondaryButtonStyle}
                  >
                    돌아가기
                  </Link>

                  <button
                    type="button"
                    disabled={!reason.trim() || cancelLoading}
                    onClick={handleCancel}
                    className={`${primaryButtonStyle} disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {cancelLoading ? "취소 처리 중..." : "취소 확인"}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          /* 일반 예약 상세 화면 */
          <div className="mt-7 border-t border-[#F3E8DC] pt-5">
            {currentStatus === "CONFIRMED" && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/reservation/member/1"
                  className={secondaryButtonStyle}
                >
                  예약 내역으로
                </Link>

                <Link
                  to={`/reservation/${reservation.rsvNo}/cancel`}
                  className={primaryButtonStyle}
                >
                  예약 취소
                </Link>
              </div>
            )}

            {currentStatus === "COMPLETED" && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/reservation/member/1"
                  className={secondaryButtonStyle}
                >
                  예약 내역으로
                </Link>

                <Link
                  to={`/reservation/${reservation.rsvNo}/review`}
                  className={primaryButtonStyle}
                >
                  후기 작성
                </Link>
              </div>
            )}

            {(currentStatus === "WAIT" ||
              currentStatus === "CANCEL") && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/reservation/member/1"
                  className={secondaryButtonStyle}
                >
                  예약 내역으로
                </Link>

                {currentStatus === "CANCEL" && (
                  <div className="flex flex-1 items-center justify-center rounded-xl bg-[#FFF7ED] px-5 py-3 font-medium text-[#C2410C]">
                    취소 완료
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

