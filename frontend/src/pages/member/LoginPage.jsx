import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { loginPost } from "../../api/memberApi";
import { setCookie } from "../../util/cookieUtil";
import { useStore } from "../../mocks/data";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";

const getMemberNoFromToken = (accessToken) => {
  try {
    const payload = accessToken.split(".")[1];

    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = JSON.parse(
      atob(base64)
    );

    return decoded.memNo;
  } catch (error) {
    console.error("JWT 회원 번호 확인 실패:", error);
    return null;
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(
    location.state?.message || "",
  );
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
    setMessage("");

    try {
      const result = await loginPost({
        memEmail: email,
        memPassword: password,
      });
      const memNo = getMemberNoFromToken(result.accessToken);
      if (memNo == null) {
        throw new Error("로그인 토큰에서 회원 번호를 확인할 수 없습니다.");
      }
      setCookie(
        "member",
        {
          ...result,
          memNo,
        },
        1
      );
      go(
        result.memRole === "ADMIN"
          ? "ADMIN"
          : ["INS", "INSTRUCTOR"].includes(result.memRole)
            ? "INS"
            : "USER",
      );
    } catch {
      setError(
        "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="w-full max-w-[560px] mx-auto my-[60px] px-[20px] max-md:my-[40px]">
      <section className="bg-white border border-[#ebe6e0] rounded-xl px-[48px] py-[40px] shadow-sm max-md:px-[26px] max-md:py-[32px]">
        <Heading
          center
          title="로그인"
          description="다양한 배움과 새로운 취미를 함께해요."
        />

        <form onSubmit={submit} className="mt-[34px]">
          <Field
            label="이메일"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setMessage("");
            }}
            placeholder="이메일을 입력해주세요."
          />

          <Field
            label="비밀번호"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
              setMessage("");
            }}
            placeholder="비밀번호를 입력해주세요."
          />

          {message && (
            <p
              className="px-[16px] py-[12px] mb-[18px] rounded-[7px] bg-[#f3f7f2] text-[#477754] text-[14px] leading-[1.5]"
              role="status"
            >
              {message}
            </p>
          )}

          {error && (
            <p
              className="px-[16px] py-[12px] mb-[18px] rounded-[7px] bg-[#fff1f1] text-[#c94a4a] text-[14px] leading-[1.5]"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full h-[52px] rounded-lg bg-[#F97316] text-white border border-[#F97316] font-bold text-[17px] cursor-pointer hover:bg-[#ea650d] hover:border-[#ea650d] transition-colors duration-200 disabled:opacity-45 disabled:cursor-not-allowed"
          >
            {busy ? "로그인 중…" : "로그인"}
          </button>
        </form>

        <div className="flex justify-center items-center gap-[14px] mt-[22px] text-[14px] text-[#6B7280]">
          <button
            type="button"
            onClick={() => navigate("/auth/password")}
            className="bg-transparent p-0 border-0 text-[#6B7280] hover:bg-transparent hover:text-[#F97316] transition-colors duration-200 cursor-pointer"
          >
            비밀번호 찾기
          </button>

          <span className="text-[#d6d0ca]">|</span>

          <button
            type="button"
            onClick={() => navigate("/auth/signup")}
            className="bg-transparent p-0 border-0 text-[#6B7280] hover:bg-transparent hover:text-[#F97316] transition-colors duration-200 cursor-pointer"
          >
            회원가입
          </button>
        </div>
      </section>
    </div>
  );
}