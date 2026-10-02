import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  getSchedules,
  initialReservations,
  money,
  readStore,
  useStore,
} from "./data";
import { Field } from "./ui";

function remainingSeats(item, schedule, reservations, excludeId) {
  if (!schedule) return 0;
  const occupied = reservations
    .filter(
      (r) =>
        r.id !== excludeId &&
        r.classId === item.id &&
        r.scheduleId === schedule.id &&
        r.status !== "취소",
    )
    .reduce((total, r) => total + r.count, 0);
  return Math.max(0, Math.min(item.capacity, schedule.remaining) - occupied);
}
export default function BookingForm({ item, existing, secondaryAction }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [reservations, setReservations] = useStore(
    "reservations",
    initialReservations,
  );
  const [role] = useStore("role", "PUBLIC");
  const schedules = getSchedules().filter(
    (s) => !s.classId || s.classId === item.id,
  );
  const [scheduleId, setScheduleId] = useState(
    existing?.scheduleId || Number(params.get("schNo")) || "",
  );
  const [count, setCount] = useState(
    existing?.count || Math.max(1, Number(params.get("people")) || 1),
  );
  const [error, setError] = useState("");
  const selected = schedules.find((s) => s.id === Number(scheduleId));
  const max = remainingSeats(item, selected, reservations, existing?.id);
  const effectiveCount = max > 0 ? Math.min(count, max) : 1;
  const duplicate =
    selected &&
    reservations.some(
      (r) =>
        r.id !== existing?.id &&
        r.classId === item.id &&
        r.scheduleId === selected.id &&
        r.status !== "취소",
    );
  const paidCountChanged = existing?.paid && effectiveCount !== existing.count;
  const submit = (e) => {
    e.preventDefault();
    if (role === "PUBLIC") {
      const returnTo = `/class/${item.id}?schNo=${scheduleId}&people=${effectiveCount}`;
      navigate(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    if (!["USER", "INS"].includes(role)) {
      setError("회원 또는 강사 권한으로 예약할 수 있습니다.");
      return;
    }
    const latest = readStore("reservations", initialReservations);
    if (
      !selected ||
      effectiveCount > remainingSeats(item, selected, latest, existing?.id)
    ) {
      setError("예약 가능한 일정과 잔여 정원을 확인해주세요.");
      return;
    }
    if (
      latest.some(
        (r) =>
          r.id !== existing?.id &&
          r.classId === item.id &&
          r.scheduleId === selected.id &&
          r.status !== "취소",
      )
    ) {
      setError("같은 일정에 이미 예약한 클래스가 있습니다.");
      return;
    }
    if (paidCountChanged) return;
    if (existing) {
      setReservations((v) =>
        v.map((r) =>
          r.id === existing.id
            ? { ...r, scheduleId: selected.id, count: effectiveCount }
            : r,
        ),
      );
      navigate(`/reservation/${existing.id}`);
      return;
    }
    const id =
      Math.max(1000, ...latest.map((reservation) => reservation.id)) + 1;
    setReservations((v) => [
      ...v,
      {
        id,
        classId: item.id,
        scheduleId: selected.id,
        count: effectiveCount,
        status: "결제대기",
        paid: false,
      },
    ]);
    navigate(`/payment/${id}`);
  };
  return (
    <form className="co-booking" onSubmit={submit}>
      <Field label="수업 일정 선택">
        <select
          required
          value={scheduleId}
          onChange={(e) => {
            setScheduleId(Number(e.target.value) || "");
            setCount(1);
            setError("");
          }}
        >
          <option value="">수업 일정을 선택해주세요.</option>
          {schedules.map((s) => {
            const seats = remainingSeats(item, s, reservations, existing?.id);
            return (
              <option key={s.id} value={s.id} disabled={seats === 0}>
                {s.date} {s.time} · {seats > 0 ? `잔여 ${seats}석` : "마감"}
              </option>
            );
          })}
        </select>
      </Field>
      <Field label="인원 선택">
        <select
          required
          disabled={!selected || max === 0}
          value={selected && max > 0 ? effectiveCount : ""}
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
          {Array.from({ length: max }, (_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}명
            </option>
          ))}
        </select>
      </Field>
      {duplicate && (
        <p className="co-notice co-error" role="alert">
          같은 일정에 이미 예약한 클래스가 있습니다. 다른 일정을 선택해주세요.
        </p>
      )}
      {selected && max === 0 && (
        <p className="co-notice co-error" role="alert">
          선택한 일정은 마감되었습니다.
        </p>
      )}
      {paidCountChanged && (
        <p className="co-notice co-error" role="alert">
          결제 완료한 예약은 인원을 변경할 수 없습니다. 예약 취소 후 다시
          예약해주세요.
        </p>
      )}
      {error && (
        <p className="co-notice co-error" role="alert">
          {error}
        </p>
      )}
      <div className="co-price" aria-live="polite">
        <span>
          총 결제 금액 {selected && max > 0 ? `· ${effectiveCount}명` : ""}
        </span>
        <strong>{money(item.price * effectiveCount)}</strong>
      </div>
      <div className="co-actions">
        {secondaryAction}
        <button
          className="co-button"
        disabled={!selected || max === 0 || duplicate || paidCountChanged}
      >
        {existing ? "변경 저장" : "예약하기"}
        </button>
      </div>
      <p className="co-tiny" style={{ marginTop: 12, marginBottom: 0 }}>
        {existing
          ? "변경할 일정과 인원을 확인해주세요."
          : "일정과 인원을 선택한 후 결제 화면으로 이동합니다."}
      </p>
    </form>
  );
}
