import { useEffect, useState } from "react";
import { getMyClasses } from "../../api/classApi";
import { getSchedules, registerSchedule, deleteSchedule } from "../../api/scheduleApi";
import { Heading } from "../../components/common/Heading";
import { Workspace } from "../../components/common/Workspace";
import { Field } from "../../components/common/Field";
import { Empty } from "../../components/common/Empty";

const today = () => new Date().toISOString().slice(0, 10);

export default function SchedulePage() {
  const [myClasses, setMyClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [clsNo, setClsNo] = useState("");

  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const [date, setDate] = useState(today());
  const [capacity, setCapacity] = useState(8);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // 내 클래스 목록 조회
  useEffect(() => {
    const loadMyClasses = async () => {
      try {
        setLoadingClasses(true);

        const data = await getMyClasses();

        setMyClasses(data);
        if (data.length) setClsNo(data[0].clsNo);
      } catch (err) {
        console.error("내 클래스 목록 조회 실패:", err);
      } finally {
        setLoadingClasses(false);
      }
    };

    loadMyClasses();
  }, []);

  // 선택한 클래스의 일정 목록 조회
  useEffect(() => {
    if (!clsNo) return;

    const loadSchedules = async () => {
      try {
        setLoadingSchedules(true);

        const data = await getSchedules(clsNo);

        setSchedules(data);
      } catch (err) {
        console.error("일정 목록 조회 실패:", err);
      } finally {
        setLoadingSchedules(false);
      }
    };

    loadSchedules();
  }, [clsNo]);

  const changeMonth = (delta) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  const submit = async (e) => {
    e.preventDefault();

    if (!clsNo) {
      setFormError("일정을 등록할 클래스를 선택해주세요.");
      return;
    }

    if (!date || date < today()) {
      setFormError("날짜는 오늘 또는 이후여야 합니다.");
      return;
    }

    if (!capacity || capacity < 1) {
      setFormError("정원은 1명 이상이어야 합니다.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const created = await registerSchedule(clsNo, {
        schStartDate: date,
        schCapacity: Number(capacity),
      });

      setSchedules((v) => [...v, created]);
    } catch (err) {
      console.error("일정 등록 실패:", err);

      const message =
        err?.response?.data?.data?.message ||
        "일정 등록 중 오류가 발생했습니다.";

      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async (schNo) => {
    try {
      setDeleteError("");

      await deleteSchedule(clsNo, schNo);

      setSchedules((v) => v.filter((s) => s.schNo !== schNo));
      setDeleteTarget(null);
    } catch (err) {
      console.error("일정 삭제 실패:", err);

      const message =
        err?.response?.data?.data?.message ||
        "일정 삭제 중 오류가 발생했습니다.";

      setDeleteError(message);
    }
  };

  if (loadingClasses) {
    return (
      <Workspace kind="instructor">
        <Heading title="수업 일정 관리" />
        <div className="py-[66px] text-center text-[#85888d]">내 클래스 목록을 불러오는 중입니다.</div>
      </Workspace>
    );
  }

  if (!myClasses.length) {
    return (
      <Workspace kind="instructor">
        <Heading title="수업 일정 관리" />
        <Empty to="/instructor/classes/register" label="클래스 등록">
          등록된 클래스가 없습니다. 먼저 클래스를 등록해주세요.
        </Empty>
      </Workspace>
    );
  }

  return (
    <Workspace kind="instructor">
      <Heading title="수업 일정 관리" />
      <div className="grid grid-cols-2 gap-[34px] max-[900px]:gap-[22px] max-md:grid-cols-1 [&>*]:min-w-0">
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          <div className="flex items-center gap-[14px]" style={{ justifyContent: "space-between" }}>
            <button
              className="bg-transparent border-0 text-[#dc6f15] p-[7px]"
              aria-label="이전 달"
              onClick={() => changeMonth(-1)}
            >
              ‹
            </button>
            <h3 style={{ margin: 0 }}>
              {year}년 {month + 1}월
            </h3>
            <button
              className="bg-transparent border-0 text-[#dc6f15] p-[7px]"
              aria-label="다음 달"
              onClick={() => changeMonth(1)}
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-[5px] my-6">
            {"일월화수목금토".split("").map((d) => (
              <span className="text-center min-h-[43px] p-[7px] border-0 rounded-[6px] bg-[#faf8f4] text-[#666]" key={d}>{d}</span>
            ))}
            {Array.from({ length: first }, (_, i) => (
              <span className="text-center min-h-[43px] p-[7px] border-0 rounded-[6px] bg-[#faf8f4] text-[#666]" key={`empty${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const value = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
              return (
                <button
                  key={i}
                  className={
                    date === value
                      ? "text-center min-h-[43px] p-[7px] border-0 rounded-[6px] bg-accent text-white"
                      : "text-center min-h-[43px] p-[7px] border-0 rounded-[6px] bg-[#faf8f4] text-[#666]"
                  }
                  onClick={() => setDate(value)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </section>
        <form
          className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]"
          onSubmit={submit}
        >
          <h2>일정 등록</h2>
          <Field label="클래스">
            <select value={clsNo} onChange={(e) => setClsNo(Number(e.target.value))}>
              {myClasses.map((c) => (
                <option key={c.clsNo} value={c.clsNo}>
                  {c.clsName}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="날짜"
            required
            type="date"
            min={today()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Field
            label="정원"
            required
            type="number"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
          {formError && (
            <p
              className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]"
              role="alert"
            >
              {formError}
            </p>
          )}
          <button
            className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? "저장 중..." : "일정 저장"}
          </button>
        </form>
      </div>
      <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
        <h2>등록한 일정</h2>
        {deleteError && (
          <p
            className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]"
            role="alert"
          >
            {deleteError}
          </p>
        )}
        {loadingSchedules ? (
          <p>일정을 불러오는 중입니다.</p>
        ) : (
          schedules.map((s) => (
            <div className="border-t border-[#eee] py-6 flex items-center gap-[14px]" key={s.schNo}>
              <div>
                <strong>{s.schStartDate}</strong>
                <p>
                  정원 {s.schCapacity}명 · 예약 {s.reservedCount}명 · 잔여{" "}
                  {s.remainingCapacity}명
                </p>
              </div>
              {deleteTarget === s.schNo ? (
                <div className="flex items-center gap-[7px] ml-auto">
                  <span className="text-[14px] text-[#ac4326]">삭제할까요?</span>
                  <button
                    className="bg-transparent border-0 text-[#ac4326] p-[7px] font-bold"
                    onClick={() => confirmDelete(s.schNo)}
                  >
                    삭제 확인
                  </button>
                  <button
                    className="bg-transparent border-0 text-[#dc6f15] p-[7px]"
                    onClick={() => setDeleteTarget(null)}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  className="bg-transparent border-0 text-[#dc6f15] p-[7px] ml-auto"
                  onClick={() => {
                    setDeleteError("");
                    setDeleteTarget(s.schNo);
                  }}
                >
                  삭제
                </button>
              )}
            </div>
          ))
        )}
        {!loadingSchedules && !schedules.length && <p>등록한 일정이 없습니다.</p>}
      </section>
    </Workspace>
  );
}
