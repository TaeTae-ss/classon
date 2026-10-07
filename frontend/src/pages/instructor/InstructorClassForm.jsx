import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Heading } from "../../components/common/Heading";
import { Workspace } from "../../components/common/Workspace";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Field } from "../../components/common/Field";
import { Empty } from "../../components/common/Empty";
import { getCategories } from "../../api/categoryApi";
import { registerClass } from "../../api/classApi";

export default function InstructorClassForm({ edit = false }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    clsName: "",
    catNo: "",
    clsLevel: "초급",
    clsPrice: 35000,
    clsDuration: 120,
    clsRoadAddr: "",
    clsDetailAddr: "",
    clsDesc: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getCategories()
        .then(setCategories)
        .catch(() => {});
  }, []);

  if (edit)
    return (
      <Workspace kind="instructor">
        <Heading title="클래스 수정" />
        <Empty to="/instructor/classes" label="목록으로">
          클래스 수정 기능은 아직 준비 중입니다.
        </Empty>
      </Workspace>
    );

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const clsNo = await registerClass({ ...form, catNo: Number(form.catNo) }, image);
      navigate(`/class/${clsNo}`);
    } catch {
      setError("클래스 등록에 실패했습니다. 입력값과 서버 상태를 확인해주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Workspace kind="instructor">
      <Heading title="클래스 등록" />
      <form
        className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]"
        onSubmit={submit}
      >
        <Field
          label="클래스명"
          required
          value={form.clsName}
          onChange={(e) => setForm({ ...form, clsName: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-x-[19px] gap-y-0 max-md:grid-cols-1">
          <Field label="카테고리">
            <select
              required
              value={form.catNo}
              onChange={(e) => setForm({ ...form, catNo: e.target.value })}
            >
              <option value="" disabled>카테고리를 선택해주세요.</option>
              {categories.map((c) => (
                <option key={c.catNo} value={c.catNo}>{c.catName}</option>
              ))}
            </select>
          </Field>
          <Field label="난이도">
            <select
              value={form.clsLevel}
              onChange={(e) => setForm({ ...form, clsLevel: e.target.value })}
            >
              {["초급", "중급", "고급"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field
              key="price"
              label="가격 (원)"
              type="number"
              min={1000}
              max={1000000}
              required
              value={form.clsPrice}
              onChange={(e) => setForm({ ...form, clsPrice: Number(e.target.value) })}
          />
          <Field
              key="duration"
              label="수업 시간 (분)"
              type="number"
              min={30}
              max={480}
              required
              value={form.clsDuration}
              onChange={(e) => setForm({ ...form, clsDuration: Number(e.target.value) })}
          />
        </div>
        <Field
          label="도로명 주소"
          required
          value={form.clsRoadAddr}
          onChange={(e) => setForm({ ...form, clsRoadAddr: e.target.value })}
        />
        <Field
          label="상세 주소"
          required
          value={form.clsDetailAddr}
          onChange={(e) => setForm({ ...form, clsDetailAddr: e.target.value })}
        />
        <Field label="클래스 설명">
          <textarea
            required
            value={form.clsDesc}
            onChange={(e) => setForm({ ...form, clsDesc: e.target.value })}
          />
        </Field>
        <Field label="대표 이미지">
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </Field>
        {error && (
          <p
            className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
          <ButtonLink secondary to="/instructor/classes">
            취소
          </ButtonLink>
          <button
            disabled={busy}
            className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
          >
            {busy ? "등록 중…" : "저장"}
          </button>
        </div>
      </form>
    </Workspace>
  );
}
