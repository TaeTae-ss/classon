import { useState } from "react";
import { useNavigate } from "react-router";
import {
  passwordSendPost,
  passwordVerifyPost,
  passwordPatch,
} from "../../api/memberApi";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";

export default function PasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // 인증번호 발송
  const sendCode = async () => {
    if (!email) {
      setMessage("");
      setError("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessage("");
      setError("이메일 형식으로 입력해주세요.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await passwordSendPost(email);

      setSent(true);
      setMessage("인증번호가 이메일로 발송되었습니다.");
    } catch {
      setError("가입된 이메일인지 확인해주세요.");
    } finally {
      setBusy(false);
    }
  };

  // 인증번호 확인
  const verifyCode = async () => {
    if (!authCode) {
      setMessage("");
      setError("인증번호를 입력해주세요.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const result = await passwordVerifyPost(email, authCode);

      if (result.data === true) {
        setVerified(true);
        setMessage("인증이 완료되었습니다.");
      } else {
        setError("인증번호가 올바르지 않습니다.");
      }
    } catch {
      setError("인증번호가 올바르지 않습니다.");
    } finally {
      setBusy(false);
    }
  };

  // 비밀번호 변경
  const resetPassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!newPassword || !passwordConfirm) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    // 비밀번호 형식 확인
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/;

    if (!passwordRegex.test(newPassword)) {
      setError("비밀번호는 영문과 숫자를 포함한 8~20자로 입력해주세요.");
      return;
    }

    // 비밀번호 일치 확인
    if (newPassword !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setBusy(true);

    try {
      await passwordPatch({
        memEmail: email,
        memPassword: newPassword,
      });

      // 로그인 페이지로 이동
      navigate("/auth/login", {
        replace: true,
        state: {
          message: "비밀번호가 변경되었습니다.",
        },
      });
    } catch {
      setError("비밀번호 변경에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-[560px] mx-auto my-[60px] px-[20px] max-md:my-[40px]">
      <section className="bg-white border border-[#ebe6e0] rounded-xl px-[48px] py-[40px] shadow-sm max-md:px-[26px] max-md:py-[32px]">
        <Heading
          center
          title="비밀번호 찾기"
          description={
            verified
              ? "새로운 비밀번호를 입력해주세요."
              : "가입한 이메일로 인증번호를 받아주세요."
          }
        />

        <form onSubmit={resetPassword} className="mt-[34px]">
          {!verified ? (
            <>
              <Field
                label="이메일"
                type="email"
                required
                autoComplete="email"
                value={email}
                disabled={sent}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setMessage("");
                }}
                placeholder="가입한 이메일을 입력해주세요."
              />

              {!sent && (
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={busy}
                  className="w-full h-[52px] rounded-lg bg-[#F97316] text-white border border-[#F97316] font-bold text-[17px] cursor-pointer hover:bg-[#ea650d] hover:border-[#ea650d] transition-colors duration-200 disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  {busy ? "발송 중…" : "인증번호 받기"}
                </button>
              )}

              {sent && (
                <>
                  <Field
                    label="인증번호"
                    type="text"
                    required
                    value={authCode}
                    onChange={(e) => {
                      setAuthCode(e.target.value);
                      setError("");
                      setMessage("");
                    }}
                    placeholder="인증번호를 입력해주세요."
                  />

                  <button
                    type="button"
                    onClick={verifyCode}
                    disabled={busy}
                    className="w-full h-[52px] rounded-lg bg-[#F97316] text-white border border-[#F97316] font-bold text-[17px] cursor-pointer hover:bg-[#ea650d] hover:border-[#ea650d] transition-colors duration-200 disabled:opacity-45 disabled:cursor-not-allowed"
                  >
                    {busy ? "확인 중…" : "인증 확인"}
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <Field
                label="새 비밀번호"
                type="password"
                required
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                  setMessage("");
                }}
                placeholder="새 비밀번호를 입력해주세요."
              />

              <Field
                label="비밀번호 확인"
                type="password"
                required
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                  setError("");
                  setMessage("");
                }}
                placeholder="새 비밀번호를 다시 입력해주세요."
              />

              <button
                type="submit"
                disabled={busy}
                className="w-full h-[52px] rounded-lg bg-[#F97316] text-white border border-[#F97316] font-bold text-[17px] cursor-pointer hover:bg-[#ea650d] hover:border-[#ea650d] transition-colors duration-200 disabled:opacity-45 disabled:cursor-not-allowed"
              >
                {busy ? "변경 중…" : "비밀번호 변경"}
              </button>
            </>
          )}

          {message && (
            <p
              className="px-[16px] py-[12px] mt-[18px] rounded-[7px] bg-[#f3f7f2] text-[#477754] text-[14px] leading-[1.5]"
              role="status"
            >
              {message}
            </p>
          )}

          {error && (
            <p
              className="px-[16px] py-[12px] mt-[18px] rounded-[7px] bg-[#fff1f1] text-[#c94a4a] text-[14px] leading-[1.5]"
              role="alert"
            >
              {error}
            </p>
          )}
        </form>

        <div className="flex justify-center mt-[22px] text-[14px] text-[#6B7280]">
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="bg-transparent p-0 border-0 text-[#6B7280] hover:bg-transparent hover:text-[#F97316] transition-colors duration-200 cursor-pointer"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </section>
    </div>
  );
}