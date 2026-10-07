import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../api/axios";
import { checkEmail, checkNickname } from "../../api/memberApi";
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
    address: "",
    detail: "",
    password: "",
    confirm: "",
    code: "",
  });

  const [emailChecked, setEmailChecked] = useState(false);
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [checked, setChecked] = useState(false);
  const [agree, setAgree] = useState(false);

  // 메시지 분리
  const [emailMessage, setEmailMessage] = useState({
    text: "",
    type: "",
  });

  const [codeMessage, setCodeMessage] = useState({
    text: "",
    type: "",
  });

  const [nicknameMessage, setNicknameMessage] = useState({
    text: "",
    type: "",
  });

  const [formMessage, setFormMessage] = useState({
    text: "",
    type: "",
  });

  // 버튼 공통 디자인
  const buttonStyle =
    "flex w-fit max-w-full justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer hover:bg-[#fff0e3] hover:border-[#e56b00] transition-colors duration-200 disabled:opacity-45 disabled:cursor-not-allowed";

  const field = (key, label, type = "text", extra = {}) => (
    <Field
      label={label}
      type={type}
      required
      value={form[key]}
      onChange={(e) => {
        setForm({ ...form, [key]: e.target.value });

        // 이메일 수정 시 인증 상태 초기화
        if (key === "email") {
          setEmailChecked(false);
          setSent(false);
          setVerified(false);

          setEmailMessage({
            text: "",
            type: "",
          });

          setCodeMessage({
            text: "",
            type: "",
          });
        }

        // 인증번호 수정 시 인증 상태 초기화
        if (key === "code") {
          setVerified(false);

          setCodeMessage({
            text: "",
            type: "",
          });
        }

        // 닉네임 수정 시 중복확인 상태 초기화
        if (key === "nickname") {
          setChecked(false);

          setNicknameMessage({
            text: "",
            type: "",
          });
        }
      }}
      {...extra}
    />
  );

  const submit = (e) => {
    e.preventDefault();

    setFormMessage({
      text: "",
      type: "",
    });

    // 이메일 중복확인
    if (!emailChecked) {
      setEmailMessage({
        text: "이메일 중복확인을 완료해주세요.",
        type: "error",
      });
      return;
    }

    // 이메일 인증
    if (!verified) {
      setCodeMessage({
        text: "이메일 인증을 완료해주세요.",
        type: "error",
      });
      return;
    }

    // 닉네임 중복확인
    if (!checked) {
      setNicknameMessage({
        text: "닉네임 중복확인을 완료해주세요.",
        type: "error",
      });
      return;
    }

    // 비밀번호 확인
    if (form.password !== form.confirm) {
      setFormMessage({
        text: "비밀번호가 일치하지 않습니다.",
        type: "error",
      });
      return;
    }

    // 약관 동의
    if (!agree) {
      setFormMessage({
        text: "서비스 이용약관과 개인정보 처리에 동의해주세요.",
        type: "error",
      });
      return;
    }

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
        {/* 이메일 */}
        {field("email", "이메일", "email")}

        {/* 이메일 메시지 */}
        {emailMessage.text && (
          <p
            className={`px-[17px] py-[13px] mt-[-10px] mb-[12px] rounded-[7px] text-[16px] ${
              emailMessage.type === "success"
                ? "bg-[#f3f7f2] text-[#477754]"
                : "bg-[#fff1f1] text-[#c94a4a]"
            }`}
            role="status"
          >
            {emailMessage.text}
          </p>
        )}

        {/* 이메일 중복확인 / 인증번호 받기 */}
        <div className="flex justify-end gap-[10px]">
          {/* 이메일 중복확인 */}
          <button
            type="button"
            className={buttonStyle}
            disabled={
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
            }
            onClick={async () => {
              try {
                const response = await checkEmail(form.email);

                if (response.available) {
                  setEmailChecked(true);
                  setSent(false);
                  setVerified(false);

                  setEmailMessage({
                    text: "사용할 수 있는 이메일입니다.",
                    type: "success",
                  });

                  setCodeMessage({
                    text: "",
                    type: "",
                  });
                } else {
                  setEmailChecked(false);
                  setSent(false);
                  setVerified(false);

                  setEmailMessage({
                    text: "이미 사용 중인 이메일입니다.",
                    type: "error",
                  });

                  setCodeMessage({
                    text: "",
                    type: "",
                  });
                }
              } catch (error) {
                console.error("이메일 중복 확인 실패:", error);

                setEmailChecked(false);

                setEmailMessage({
                  text: "이메일 중복 확인에 실패했습니다. 다시 시도해주세요.",
                  type: "error",
                });
              }
            }}
          >
            이메일 중복확인
          </button>

          {/* 인증번호 받기 / 재발송 */}
          <button
            type="button"
            className={buttonStyle}
            disabled={!emailChecked}
            onClick={async () => {
              try {
                await api.post(
                  `/api/auth/email/send?email=${encodeURIComponent(
                    form.email,
                  )}`,
                );

                setSent(true);
                setVerified(false);

                // 기존 인증번호 초기화
                setForm((prev) => ({
                  ...prev,
                  code: "",
                }));

                setEmailMessage({
                  text: sent
                    ? "인증번호가 재발송되었습니다."
                    : "인증번호가 발송되었습니다.",
                  type: "success",
                });

                setCodeMessage({
                  text: "",
                  type: "",
                });
              } catch (error) {
                console.error("이메일 인증번호 발송 실패:", error);

                setSent(false);
                setVerified(false);

                setEmailMessage({
                  text: "인증번호 발송에 실패했습니다. 다시 시도해주세요.",
                  type: "error",
                });
              }
            }}
          >
            {sent ? "인증번호 재발송" : "인증번호 받기"}
          </button>
        </div>

        {/* 인증번호 */}
        {sent && (
          <div className="mt-[15px]">
            {field("code", "인증번호", "text", {
              maxLength: 6,
            })}

            {/* 인증번호 메시지 */}
            {codeMessage.text && (
              <p
                className={`px-[17px] py-[13px] mt-[-10px] mb-[12px] rounded-[7px] text-[16px] ${
                  codeMessage.type === "success"
                    ? "bg-[#f3f7f2] text-[#477754]"
                    : "bg-[#fff1f1] text-[#c94a4a]"
                }`}
                role="status"
              >
                {codeMessage.text}
              </p>
            )}

            {/* 인증 확인 */}
            <div className="flex justify-end">
              <button
                type="button"
                className={buttonStyle}
                onClick={async () => {
                  try {
                    const response = await api.post(
                      `/api/auth/email/verify?email=${encodeURIComponent(
                        form.email,
                      )}&authCode=${encodeURIComponent(form.code)}`,
                    );

                    console.log("이메일 인증 응답:", response.data);

                    const valid =
                      response.data === true ||
                      response.data === "true" ||
                      response.data?.data === true ||
                      response.data?.data === "true";

                    setVerified(valid);

                    if (valid) {
                      setCodeMessage({
                        text: "이메일 인증을 완료했습니다.",
                        type: "success",
                      });
                    } else {
                      setCodeMessage({
                        text: "인증번호를 확인해주세요.",
                        type: "error",
                      });
                    }
                  } catch (error) {
                    console.error("이메일 인증 확인 실패:", error);

                    setVerified(false);

                    setCodeMessage({
                      text: "인증 확인에 실패했습니다. 다시 시도해주세요.",
                      type: "error",
                    });
                  }
                }}
              >
                인증 확인
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          {/* 비밀번호 */}
          {field("password", "비밀번호", "password", {
            minLength: 8,
            autoComplete: "new-password",
          })}

          {/* 비밀번호 확인 */}
          {field("confirm", "비밀번호 확인", "password", {
            minLength: 8,
            autoComplete: "new-password",
          })}

          {/* 닉네임 */}
          <div className="flex items-end gap-[10px]">
            <div className="flex-1">
              {field("nickname", "닉네임", "text", {
                minLength: 2,
              })}
            </div>

            {/* 닉네임 중복확인 */}
            <button
              type="button"
              className={`${buttonStyle} mb-[22px]`}
              disabled={form.nickname.trim().length < 2}
              onClick={async () => {
                const nickname = form.nickname.trim();

                if (
                  nickname.length < 2 ||
                  ["관리자", "admin"].includes(
                    nickname.toLowerCase(),
                  )
                ) {
                  setChecked(false);

                  setNicknameMessage({
                    text: "닉네임은 2자 이상이며 관리자 이름은 사용할 수 없습니다.",
                    type: "error",
                  });

                  return;
                }

                try {
                  const response = await checkNickname(nickname);

                  if (response.available) {
                    setChecked(true);

                    setNicknameMessage({
                      text: "사용할 수 있는 닉네임입니다.",
                      type: "success",
                    });
                  } else {
                    setChecked(false);

                    setNicknameMessage({
                      text: "이미 사용 중인 닉네임입니다.",
                      type: "error",
                    });
                  }
                } catch (error) {
                  console.error("닉네임 중복 확인 실패:", error);

                  setChecked(false);

                  setNicknameMessage({
                    text: "닉네임 중복 확인에 실패했습니다. 다시 시도해주세요.",
                    type: "error",
                  });
                }
              }}
            >
              중복확인
            </button>
          </div>

          {/* 닉네임 메시지 */}
          {nicknameMessage.text && (
            <p
              className={`px-[17px] py-[13px] mt-[-10px] mb-[18px] rounded-[7px] text-[16px] ${
                nicknameMessage.type === "success"
                  ? "bg-[#f3f7f2] text-[#477754]"
                  : "bg-[#fff1f1] text-[#c94a4a]"
              }`}
              role="status"
            >
              {nicknameMessage.text}
            </p>
          )}

          {/* 전화번호 / 주소 */}
          <div style={{ marginTop: 20 }}>
            {/* 전화번호 */}
            {field("phone", "전화번호", "tel", {
              pattern: "[0-9-]{9,13}",
            })}

            {/* 도로명 주소 */}
            {field("address", "도로명 주소")}

            {/* 상세 주소 */}
            {field("detail", "상세 주소")}
          </div>

          {/* 약관 동의 */}
          <label className="flex items-center gap-[10px] mt-[14px]">
            <input
              required
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            서비스 이용약관과 개인정보 처리에 동의합니다.
          </label>

          {/* 비밀번호 / 약관 오류 메시지 */}
          {formMessage.text && (
            <p
              className={`px-[17px] py-[13px] my-[18px] rounded-[7px] text-[16px] ${
                formMessage.type === "success"
                  ? "bg-[#f3f7f2] text-[#477754]"
                  : "bg-[#fff1f1] text-[#c94a4a]"
              }`}
              role="status"
            >
              {formMessage.text}
            </p>
          )}

          {/* 회원가입 */}
          <button
            type="submit"
            className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer hover:opacity-90 transition-opacity duration-200"
            style={{ marginTop: 20 }}
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}