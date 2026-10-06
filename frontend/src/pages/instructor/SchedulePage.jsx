import { useState } from "react";
import { classes, useStore } from "../../mocks/data";
import { Heading } from "../../components/common/Heading";
import { Workspace } from "../../components/common/Workspace";
import { Field } from "../../components/common/Field";

export default function SchedulePage() {
  const [list] = useStore("classes", classes);
  const [saved, setSaved] = useStore("schedules", []);
  const [date, setDate] = useState("2026-10-05");
  const [time, setTime] = useState("14:00");
  const [capacity, setCapacity] = useState(8);
  const [clsNo, setClsNo] = useState(list[0]?.id || 1);
  const [month, setMonth] = useState(9);
  const [year, setYear] = useState(2026);
  const changeMonth = (delta) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
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
          onSubmit={(e) => {
            e.preventDefault();
            setSaved((v) => [
              ...v,
              { id: Date.now(), classId: Number(clsNo), date, time, capacity },
            ]);
          }}
        >
          <h2>일정 등록</h2>
          <Field label="클래스">
            <select value={clsNo} onChange={(e) => setClsNo(e.target.value)}>
              {list.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="날짜"
            required
            type="date"
            min="2026-10-01"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Field
            label="시작 시간"
            required
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <Field
            label="정원"
            required
            type="number"
            min="1"
            max={list.find((c) => c.id === Number(clsNo))?.capacity || 100}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
          <button className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer">일정 저장</button>
        </form>
      </div>
      <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
        <h2>등록한 일정</h2>
        {saved.map((s) => (
          <div className="border-t border-[#eee] py-6 flex items-center gap-[14px]" key={s.id}>
            <div>
              <strong>
                {s.date} {s.time}
              </strong>
              <p>
                {list.find((c) => c.id === s.classId)?.title} · {s.capacity}명
              </p>
            </div>
            <button
              className="bg-transparent border-0 text-[#dc6f15] p-[7px]"
              onClick={() => setSaved((v) => v.filter((x) => x.id !== s.id))}
            >
              삭제
            </button>
          </div>
        ))}
        {!saved.length && <p>추가로 등록한 일정이 없습니다.</p>}
      </section>
    </Workspace>
  );
}
