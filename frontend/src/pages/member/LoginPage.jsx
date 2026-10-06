import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { loginPost } from "../../api/memberApi";
import { setCookie } from "../../util/cookieUtil";
import { useStore } from "../../mocks/data";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [, setRole] = useStore("role", "PUBLIC");
  const destination = params.get("returnTo");
  const go = (role) => {
    setRole(role);
    navigate(
      destination?.startsWith("/") && !destination.startsWith("//")
        ? destination
        : role === "ADMIN"
          ? "/admin"
          : role === "INS"
            ? "/instructor"
            : "/member/mypage",
    );
  };
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await loginPost({
        memEmail: email,
        memPassword: password,
      });
      setCookie("member", { ...result }, 1);
      go(
        result.memRole === "ADMIN"
          ? "ADMIN"
          : ["INS", "INSTRUCTOR"].includes(result.memRole)
            ? "INS"
            : "USER",
      );
    } catch {
      setError(
        "로그인에 실패했습니다. 이메일·비밀번호 또는 서버 연결 상태를 확인해주세요.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="max-w-[648px] mx-auto my-[46px]">
      <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
        <Heading
          center
          title="로그인"
          description="다양한 배움과 새로운 취미를 함께해요."
        />
        <form onSubmit={submit}>
          <Field
            label="이메일"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요."
          />
          <Field
            label="비밀번호"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요."
          />
          {error && (
            <p
              className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]"
              role="alert"
            >
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
          >
            {busy ? "로그인 중…" : "로그인"}
          </button>
        </form>
      </section>
    </div>
  );
}
