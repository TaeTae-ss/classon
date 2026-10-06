import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { classes, useStore } from "../../mocks/data";
import { Heading } from "../../components/common/Heading";
import { Workspace } from "../../components/common/Workspace";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Field } from "../../components/common/Field";
import { Empty } from "../../components/common/Empty";

export default function InstructorClassForm({ edit = false }) {
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
        className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]"
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
        <div className="grid grid-cols-2 gap-x-[19px] gap-y-0 max-md:grid-cols-1">
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
        <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
          <ButtonLink secondary to="/instructor/classes">
            취소
          </ButtonLink>
          <button className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer">저장</button>
        </div>
      </form>
    </Workspace>
  );
}
