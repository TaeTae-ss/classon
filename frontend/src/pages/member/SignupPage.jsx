import { useState } from "react";
import { useNavigate } from "react-router";
import { initialProfile, useStore } from "../../mocks/data";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";

export default function SignupPage() {
  const navigate = useNavigate();
  const [, setProfile] = useStore("profile", initialProfile);
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    phone: "",
    birth: "",
    address: "",
    detail: "",
    password: "",
    confirm: "",
    code: "",
  });
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [checked, setChecked] = useState(false);
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");
  const field = (key, label, type = "text", extra = {}) => (
    <Field
      label={label}
      type={type}
      required
      value={form[key]}
      onChange={(e) => {
        setForm({ ...form, [key]: e.target.value });
        if (key === "email") {
          setSent(false);
          setVerified(false);
        }
        if (key === "nickname") setChecked(false);
      }}
      {...extra}
    />
  );
  const submit = (e) => {
    e.preventDefault();
    if (!verified || !checked) {
      setMessage("이메일 인증과 닉네임 중복확인을 완료해주세요.");
      return;
    }
    if (form.password !== form.confirm) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!agree) return;
    const {
      password: ignored,
      confirm: ignoredConfirm,
      code: ignoredCode,
      ...profile
    } = form;
    void ignored;
    void ignoredConfirm;
    void ignoredCode;
    setProfile({ id: 1, ...profile });
    navigate("/auth/login");
  };
  return (
    <div className="max-w-[648px] mx-auto my-[46px]">
      <Heading
        title="회원가입"
        description="지금, 새로운 배움의 여정을 시작해보세요."
      />
      <form
        className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]"
        onSubmit={submit}
      >
        <p className="text-[13px] leading-[1.8] text-[#999]">
          미리보기에서는 예시 프로필만 저장합니다. 실제 회원가입과 이메일 발송은
          수행하지 않습니다.
        </p>
        {field("email", "이메일", "email")}
        <button
          type="button"
          className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
          disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)}
          onClick={() => {
            setSent(true);
            setMessage(
              "미리보기 인증번호는 123456입니다. 이메일은 발송되지 않습니다.",
            );
          }}
        >
          인증번호 받기
        </button>
        {sent && (
          <>
            <div style={{ marginTop: 15 }}>
              {field("code", "인증번호", "text", { maxLength: 6 })}
            </div>
            <button
              type="button"
              className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
              onClick={() => {
                setVerified(form.code === "123456");
                setMessage(
                  form.code === "123456"
                    ? "예시 이메일 인증을 완료했습니다."
                    : "인증번호를 확인해주세요.",
                );
              }}
            >
              인증 확인
            </button>
          </>
        )}
        <div style={{ marginTop: 20 }}>
          {field("password", "비밀번호", "password", {
            minLength: 8,
            autoComplete: "new-password",
          })}
          {field("confirm", "비밀번호 확인", "password", {
            minLength: 8,
            autoComplete: "new-password",
          })}
          {field("nickname", "닉네임", "text", { minLength: 2 })}
          <button
            type="button"
            className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
            onClick={() => {
              const valid =
                form.nickname.trim().length >= 2 &&
                !["관리자", "admin"].includes(
                  form.nickname.trim().toLowerCase(),
                );
              setChecked(valid);
              setMessage(
                valid
                  ? "미리보기에서 사용할 수 있는 닉네임입니다."
                  : "닉네임은 2자 이상이며 관리자 이름은 사용할 수 없습니다.",
              );
            }}
          >
            중복확인
          </button>
          <div style={{ marginTop: 20 }}>
            {field("phone", "전화번호", "tel", { pattern: "[0-9-]{9,13}" })}
            {field("birth", "생년월일", "date", { max: "2026-10-01" })}
            {field("address", "도로명 주소")}
            {field("detail", "상세 주소")}
          </div>
          <label className="flex items-center gap-[10px] mt-[14px]">
            <input
              required
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />{" "}
            서비스 이용약관과 개인정보 처리에 동의합니다.
          </label>
          {message && (
            <p
              className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#f3f7f2] text-[#477754] text-[16px]"
              role="status"
            >
              {message}
            </p>
          )}
          <button
            className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
            style={{ marginTop: 20 }}
          >
            회원가입 화면 완료
          </button>
        </div>
      </form>
    </div>
  );
}
