import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  classes,
  schedules,
  useStore,
  money,
  initialReviews,
} from "./data";
import { Heading, Workspace, ButtonLink, Field, Empty, Art } from "./ui";

export function InstructorDashboard() {
  const [list] = useStore("classes", classes);
  const [reviews] = useStore("reviews", initialReviews);
  return (
    <Workspace kind="instructor">
      <Heading
        title="강사 대시보드"
        description="오늘도 새로운 배움을 함께 만들어가요."
        action={
          <ButtonLink to="/instructor/classes/register">클래스 등록</ButtonLink>
        }
      />
      <Stats
        items={[
          ["내 클래스", `${list.length}개`],
          ["수업 일정", `${schedules.length}건`],
          ["수강 후기", `${reviews.length}건`],
        ]}
      />
      <div className="co-split">
        <section className="co-panel">
          <h2>내 클래스 목록</h2>
          {list.slice(0, 3).map((c) => (
            <div className="co-summary" key={c.id}>
              <Art item={c} />
              <div>
                <h3>{c.title}</h3>
                <Link to={`/instructor/classes/${c.id}/edit`}>수정 →</Link>
              </div>
            </div>
          ))}
          <div className="co-actions co-class-form-actions">
            <ButtonLink secondary to="/instructor/classes">
              전체 보기
            </ButtonLink>
          </div>
        </section>
        <section className="co-panel">
          <h2>다가오는 수업 일정</h2>
          {schedules.map((s) => (
            <div className="co-review" key={s.id}>
              <strong>
                {s.date} {s.time}
              </strong>
              <p>도자기 핸드빌딩 클래스 · 잔여 {s.remaining}석</p>
              <Link to={`/reservation/schedule/${s.id}`}>예약자 확인 →</Link>
            </div>
          ))}
        </section>
      </div>
    </Workspace>
  );
}
export function Stats({ items }) {
  return (
    <div className={`co-stats${items.length === 3 ? " co-stats-three" : ""}`}>
      {items.map(([label, value]) => (
        <div className="co-stat" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}
export function InstructorClassPage() {
  const [list, setList] = useStore("classes", classes);
  const [selected, setSelected] = useState(null);
  return (
    <Workspace kind="instructor">
      <Heading
        title="내 클래스 관리"
        action={
          <ButtonLink to="/instructor/classes/register">클래스 등록</ButtonLink>
        }
      />
      {selected && (
        <div className="co-notice co-error">
          이 클래스의 예시 데이터를 삭제할까요?
          <div className="co-actions">
            <button
              className="co-button"
              onClick={() => {
                setList((v) => v.filter((c) => c.id !== selected));
                setSelected(null);
              }}
            >
              삭제 확인
            </button>
            <button
              className="co-button co-secondary"
              onClick={() => setSelected(null)}
            >
              돌아가기
            </button>
          </div>
        </div>
      )}
      <div className="co-table-wrap">
        <table className="co-table">
          <thead>
            <tr>
              <th>클래스명</th>
              <th>카테고리</th>
              <th>수강료</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link to={`/class/${c.id}`}>{c.title}</Link>
                </td>
                <td>{c.category}</td>
                <td>{money(c.price)}</td>
                <td>
                  <Link to={`/instructor/classes/${c.id}/edit`}>수정</Link>
                  <button onClick={() => setSelected(c.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!list.length && <Empty>등록된 클래스가 없습니다.</Empty>}
    </Workspace>
  );
}
export function InstructorClassForm({ edit = false }) {
  const { clsNo } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useStore("classes", classes);
  const existing = list.find((c) => c.id === Number(clsNo));
  const [form, setForm] = useState(
    existing || {
      title: "",
      category: "취미",
      price: 35000,
      capacity: 8,
      duration: 120,
      difficulty: "초급",
      location: "",
      description: "",
      instructor: "김강사",
      rating: 0,
      art: "pottery",
      color: "#ead8c2",
    },
  );
  if (edit && !existing)
    return (
      <Empty to="/instructor/classes" label="목록">
        클래스를 찾을 수 없습니다.
      </Empty>
    );
  return (
    <Workspace kind="instructor">
      <Heading title={edit ? "클래스 수정" : "클래스 등록"} />
      <form
        className="co-panel"
        onSubmit={(e) => {
          e.preventDefault();
          const item = { ...form, id: existing?.id || Date.now() };
          setList((v) =>
            edit ? v.map((c) => (c.id === item.id ? item : c)) : [...v, item],
          );
          navigate("/instructor/classes");
        }}
      >
        <Field
          label="클래스명"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <div className="co-inline-form">
          <Field label="카테고리">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {["개발", "디자인", "취미", "기타"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="난이도">
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              {["초급", "중급", "고급"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          {[
            ["price", "가격 (원)", 1000, 1000000],
            ["capacity", "최대 정원 (명)", 1, 100],
            ["duration", "수업 시간 (분)", 30, 480],
          ].map(([key, label, min, max]) => (
            <Field
              label={label}
              key={key}
              required
              type="number"
              min={min}
              max={max}
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: Number(e.target.value) })
              }
            />
          ))}
        </div>
        <Field
          label="수업 장소"
          required
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <Field label="클래스 설명">
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <Field label="대표 이미지 스타일">
          <select
            value={form.art}
            onChange={(e) => setForm({ ...form, art: e.target.value })}
          >
            {[
              ["pottery", "도자기"],
              ["perfume", "향수"],
              ["code", "개발"],
              ["paint", "그림"],
              ["design", "디자인"],
              ["bake", "베이킹"],
            ].map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <div className="co-actions co-class-form-actions">
          <ButtonLink secondary to="/instructor/classes">
            취소
          </ButtonLink>
          <button className="co-button">저장</button>
        </div>
      </form>
    </Workspace>
  );
}
export function SchedulePage() {
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
      <div className="co-split">
        <section className="co-panel">
          <div className="co-row" style={{ justifyContent: "space-between" }}>
            <button
              className="co-text-button"
              aria-label="이전 달"
              onClick={() => changeMonth(-1)}
            >
              ‹
            </button>
            <h3 style={{ margin: 0 }}>
              {year}년 {month + 1}월
            </h3>
            <button
              className="co-text-button"
              aria-label="다음 달"
              onClick={() => changeMonth(1)}
            >
              ›
            </button>
          </div>
          <div className="co-calendar">
            {"일월화수목금토".split("").map((d) => (
              <span key={d}>{d}</span>
            ))}
            {Array.from({ length: first }, (_, i) => (
              <span key={`empty${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const value = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
              return (
                <button
                  key={i}
                  className={date === value ? "is-active" : ""}
                  onClick={() => setDate(value)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </section>
        <form
          className="co-panel"
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
          <button className="co-button">일정 저장</button>
        </form>
      </div>
      <section className="co-panel">
        <h2>등록한 일정</h2>
        {saved.map((s) => (
          <div className="co-review co-row" key={s.id}>
            <div>
              <strong>
                {s.date} {s.time}
              </strong>
              <p>
                {list.find((c) => c.id === s.classId)?.title} · {s.capacity}명
              </p>
            </div>
            <button
              className="co-text-button"
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


