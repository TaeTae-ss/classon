import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { getSchedules } from "../../api/scheduleApi";
import {
  countReservation,
  createReservation,
} from "../../api/reservationApi";

import { money } from "../../mocks/data";
import { Field } from "../common/Field";

export default function BookingForm({
  item,
  existing,
  secondaryAction,
}) {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role] = useState("PUBLIC");

  const [scheduleId, setScheduleId] = useState(
    existing?.scheduleId ||
      Number(params.get("schNo")) ||
      "",
  );

  const [count, setCount] = useState(
    existing?.count ||
      Math.max(1, Number(params.get("people")) || 1),
  );

  const [error, setError] = useState("");

  // 수업 일정 조회
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSchedules(item.id);

        setSchedules(data);
      } catch (error) {
        console.error("일정 조회 실패:", error);
        setError("수업 일정을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (item?.id) {
      loadSchedules();
    }
  }, [item?.id]);

  // 선택한 일정
  const selected = schedules.find(
    (s) => s.schNo === Number(scheduleId),
  );

  // 선택한 일정의 남은 좌석
  const max = selected?.remainingCapacity ?? 0;

  // 선택 가능한 최대 인원을 넘지 않도록 처리
  const effectiveCount =
    max > 0 ? Math.min(count, max) : 1;

  // 결제 완료 예약의 인원 변경 여부
  const paidCountChanged =
    existing?.paid &&
    effectiveCount !== existing.count;

  // 예약 처리
//   const submit = async (e) => {
//     e.preventDefault();

//     console.log("🔥🔥🔥 submit 실행", {
//     selected,
//     max,
//     effectiveCount,
//   });

//     // 현재는 로그인 기능 연결 전이므로
//     // 비회원이면 로그인 페이지로 이동
//     // if (role === "PUBLIC") {
//     //   const returnTo =
//     //     `/class/${item.id}?schNo=${scheduleId}&people=${effectiveCount}`;

//     //   navigate(
//     //     `/auth/login?returnTo=${encodeURIComponent(returnTo)}`,
//     //   );

//     //   return;
//     // }

//     // 비회원 테스트
//   if (role === "PUBLIC") {
//     navigate(
//       `/payment/test?schNo=${selected.schNo}&count=${effectiveCount}`,
//     );
//     return;
//   }

//     // 회원만 예약 가능
//     // if (role !== "USER") {
//     //   setError("회원만 예약할 수 있습니다.");
//     //   return;
//     // }

//     // 일정 선택 확인
//     if (!selected || max === 0) {
//       setError("예약 가능한 일정을 선택해주세요.");
//       return;
//     }

//     // 결제 완료 예약의 인원 변경 방지
//     if (paidCountChanged) {
//       setError(
//         "결제 완료한 예약은 인원을 변경할 수 없습니다. 예약 취소 후 다시 예약해주세요.",
//       );
//       return;
//     }

//     try {
//       setError("");
// console.log("👉 countReservation 호출 직전");
//       // 예약 인원 및 금액 확인
//       const countResult = await countReservation(
//         selected.schNo,
//         effectiveCount,
//       );
// console.log("👉 countReservation 응답:", countResult);
//       if (countResult.remainingCount < effectiveCount) {
//         setError("예약 가능한 인원이 부족합니다.");
//         return;
//       }
// console.log("👉 createReservation 호출 직전");
//       // 새 예약 생성 (테스트 멤버)
//       if (!existing) {
//         const TEST_MEM_NO = 1;

//         const reservation = await createReservation({
//           memNo: TEST_MEM_NO,
//           schNo: selected.schNo,
//           rsvCount: effectiveCount,
//         });

//         console.log("예약 생성 결과:", reservation);

//         navigate(`/payment/${reservation.rsvNo}`);
//         return;
//       }

//       // 기존 예약 수정은 다음 단계에서 처리
//       setError("예약 변경 기능은 현재 API 연동 작업 중입니다.");
//     } catch (error) {
//       console.error("예약 처리 실패:", error);

//       const message =
//         error.response?.data?.message ||
//         "예약 처리 중 오류가 발생했습니다.";

//       setError(message);
//     }
//   };
const submit = async (e) => {
  e.preventDefault();

  if (!selected || max === 0) {
    setError("예약 가능한 일정을 선택해주세요.");
    return;
  }

  if (paidCountChanged) {
    setError(
      "결제 완료한 예약은 인원을 변경할 수 없습니다. 예약 취소 후 다시 예약해주세요."
    );
    return;
  }

  try {
    setError("");

    // 1. 예약 가능 인원 확인
    const countResult = await countReservation(
      selected.schNo,
      effectiveCount
    );

    console.log("예약 가능 여부:", countResult);

    if (countResult.remainingCount < effectiveCount) {
      setError("예약 가능한 인원이 부족합니다.");
      return;
    }

    // 2. 테스트용 회원번호
    const TEST_MEM_NO = 1;

    console.log("예약 생성 요청:", {
      memNo: TEST_MEM_NO,
      schNo: selected.schNo,
      rsvCount: effectiveCount,
    });

    // 3. 실제 예약 생성 API
    const reservation = await createReservation({
      memNo: TEST_MEM_NO,
      schNo: selected.schNo,
      rsvCount: effectiveCount,
    });

    console.log("예약 생성 성공:", reservation);

    // 4. 생성된 예약번호로 결제 페이지 이동
    navigate(`/payment/${reservation.rsvNo}`);
  } catch (error) {
    console.error("예약 처리 실패:", error);
    console.error(
  "🔥🔥🔥 서버 응답 전체:",
  JSON.stringify(error.response?.data, null, 2)
);

    const message =
      error.response?.data?.message ||
      error.response?.data?.data?.message ||
      "예약 처리 중 오류가 발생했습니다.";

    setError(message);
  }
};

  return (
    <form
      className="mt-0 border-t-0 pt-0"
      onSubmit={submit}
    >
      {/* 일정 선택 */}
      <Field label="수업 일정 선택">
        <select
          required
          value={scheduleId}
          onChange={(e) => {
            setScheduleId(
              Number(e.target.value) || "",
            );
            setCount(1);
            setError("");
          }}
        >
          {loading ? (
            <option value="">
              수업 일정을 불러오는 중...
            </option>
          ) : (
            <>
              <option value="">
                수업 일정을 선택해주세요.
              </option>

              {schedules.map((s) => (
                <option
                  key={s.schNo}
                  value={s.schNo}
                  disabled={s.remainingCapacity === 0}
                >
                  {s.schStartDate} ·{" "}
                  {s.remainingCapacity > 0
                    ? `잔여 ${s.remainingCapacity}석`
                    : "마감"}
                </option>
              ))}
            </>
          )}
        </select>
      </Field>

      {/* 인원 선택 */}
      <Field label="인원 선택">
        <select
          required
          disabled={!selected || max === 0}
          value={
            selected && max > 0
              ? effectiveCount
              : ""
          }
          onChange={(e) => {
            setCount(Number(e.target.value));
            setError("");
          }}
        >
          <option value="" disabled>
            {selected
              ? "예약 가능한 인원을 선택해주세요."
              : "일정을 먼저 선택해주세요."}
          </option>

          {Array.from(
            { length: max },
            (_, i) => (
              <option
                key={i}
                value={i + 1}
              >
                {i + 1}명
              </option>
            ),
          )}
        </select>
      </Field>

      {/* 정원 마감 */}
      {selected && max === 0 && (
        <p
          className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]"
          role="alert"
        >
          선택한 일정은 마감되었습니다.
        </p>
      )}

      {/* 결제 완료 예약 인원 변경 */}
      {paidCountChanged && (
        <p
          className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]"
          role="alert"
        >
          결제 완료한 예약은 인원을 변경할 수 없습니다.
          예약 취소 후 다시 예약해주세요.
        </p>
      )}

      {/* 에러 */}
      {error && (
        <p
          className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* 결제 금액 */}
      <div
        className="flex justify-between items-center border-t border-[#eee] py-[22px] mt-[18px]"
        aria-live="polite"
      >
        <span>
          총 결제 금액{" "}
          {selected && max > 0
            ? `· ${effectiveCount}명`
            : ""}
        </span>

        <strong className="text-[28px] text-[#ef770e]">
          {money(item.price * effectiveCount)}
        </strong>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
        {secondaryAction}

        <button
          type="submit"
          className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
          disabled={
            !selected ||
            max === 0 ||
            paidCountChanged
          }
        >
          {existing ? "변경 저장" : "예약하기"}
        </button>
      </div>

      <p
        className="text-[13px] leading-[1.8] text-[#999]"
        style={{
          marginTop: 12,
          marginBottom: 0,
        }}
      >
        {existing
          ? "변경할 일정과 인원을 확인해주세요."
          : "일정과 인원을 선택한 후 결제 화면으로 이동합니다."}
      </p>
    </form>
  );
}