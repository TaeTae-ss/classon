import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../api/axios";
import { checkEmail, checkNickname, signupPost, } from "../../api/memberApi";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";

export default function SignupPage() {
  const navigate = useNavigate();
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

  // 약관 동의
  const [serviceAgree, setServiceAgree] = useState(false);
  const [privacyAgree, setPrivacyAgree] = useState(false);

  // 약관 모달
  const [termsModal, setTermsModal] = useState(null);

  // 약관 모달 확인 여부
  const [termsViewed, setTermsViewed] = useState({
    service: false,
    privacy: false,
  });

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

  const [passwordMessage, setPasswordMessage] = useState({
    text: "",
    type: "",
  });

  const [confirmMessage, setConfirmMessage] = useState({
    text: "",
    type: "",
  });

  const [phoneMessage, setPhoneMessage] = useState({
    text: "",
    type: "",
  });

  const [addressMessage, setAddressMessage] = useState({
    text: "",
    type: "",
  });

  const [detailMessage, setDetailMessage] = useState({
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

  // 비밀번호 형식
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/;

  const field = (key, label, type = "text", extra = {}) => (
    <Field
      label={label}
      type={type}
      required
      value={form[key]}
      onChange={(e) => {
        const value = e.target.value;

        setForm({
          ...form,
          [key]: value,
        });

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

        // 전화번호 수정 시 오류 메시지 초기화
        if (key === "phone") {
          setPhoneMessage({
            text: "",
            type: "",
          });
        }

        // 도로명 주소 수정 시 오류 메시지 초기화
        if (key === "address") {
          setAddressMessage({
            text: "",
            type: "",
          });
        }

        // 상세 주소 수정 시 오류 메시지 초기화
        if (key === "detail") {
          setDetailMessage({
            text: "",
            type: "",
          });
        }

        // 비밀번호 형식 확인
        if (key === "password") {
          if (!value) {
            setPasswordMessage({
              text: "",
              type: "",
            });
          } else if (!passwordRegex.test(value)) {
            setPasswordMessage({
              text: "비밀번호는 영문과 숫자를 포함한 8~20자로 입력해주세요.",
              type: "error",
            });
          } else {
            setPasswordMessage({
              text: "",
              type: "",
            });
          }

          // 비밀번호가 변경되면 비밀번호 확인도 다시 검사
          if (form.confirm) {
            if (value !== form.confirm) {
              setConfirmMessage({
                text: "비밀번호가 일치하지 않습니다.",
                type: "error",
              });
            } else {
              setConfirmMessage({
                text: "",
                type: "",
              });
            }
          }
        }

        // 비밀번호 확인
        if (key === "confirm") {
          if (!value) {
            setConfirmMessage({
              text: "",
              type: "",
            });
          } else if (value !== form.password) {
            setConfirmMessage({
              text: "비밀번호가 일치하지 않습니다.",
              type: "error",
            });
          } else {
            setConfirmMessage({
              text: "",
              type: "",
            });
          }
        }
      }}
      {...extra}
    />
  );

  const submit = async (e) => {
    e.preventDefault();

    setFormMessage({
      text: "",
      type: "",
    });

    let hasError = false;

    // 이메일 중복확인
    if (!emailChecked) {
      setEmailMessage({
        text: "이메일 중복확인을 완료해주세요.",
        type: "error",
      });

      hasError = true;
    }

    // 이메일 인증
    if (!verified) {
      setCodeMessage({
        text: "인증번호 확인을 완료해주세요.",
        type: "error",
      });

      hasError = true;
    }

    // 닉네임 중복확인
    if (!checked) {
      setNicknameMessage({
        text: "닉네임 중복확인을 완료해주세요.",
        type: "error",
      });

      hasError = true;
    }

    // 비밀번호 형식
    if (!passwordRegex.test(form.password)) {
      setPasswordMessage({
        text: "비밀번호는 영문과 숫자를 포함한 8~20자로 입력해주세요.",
        type: "error",
      });

      hasError = true;
    }

    // 비밀번호 확인
    if (form.password !== form.confirm) {
      setConfirmMessage({
        text: "비밀번호가 일치하지 않습니다.",
        type: "error",
      });

      hasError = true;
    }

    // 전화번호
    if (!form.phone.trim()) {
      setPhoneMessage({
        text: "전화번호를 입력해주세요.",
        type: "error",
      });

      hasError = true;
    }

    // 도로명 주소
    if (!form.address.trim()) {
      setAddressMessage({
        text: "도로명 주소를 입력해주세요.",
        type: "error",
      });

      hasError = true;
    }

    // 상세 주소
    if (!form.detail.trim()) {
      setDetailMessage({
        text: "상세 주소를 입력해주세요.",
        type: "error",
      });

      hasError = true;
    }

    // 약관 동의
    if (!serviceAgree || !privacyAgree) {
      setFormMessage({
        text: "서비스 이용약관과 개인정보 처리방침에 모두 동의해주세요.",
        type: "error",
      });

      hasError = true;
    }

    // 하나라도 검증 실패 시 회원가입 중단
    if (hasError) {
      return;
    }

    // 회원가입 요청 데이터
    const signupData = {
      memEmail: form.email,
      memPassword: form.password,
      memNickname: form.nickname,
      memPhone: form.phone,
      memAddress: `${form.address} ${form.detail}`.trim(),
    };

    try {
      // 회원가입 API 호출
      await signupPost(signupData);

      alert("회원가입이 완료되었습니다.");
      navigate("/auth/login");
    } catch (error) {
      console.error("회원가입 실패:", error);

      if (error.response?.status === 409) {
        setFormMessage({
          text: "이미 사용 중인 이메일 또는 닉네임입니다.",
          type: "error",
        });
      } else {
        setFormMessage({
          text: "회원가입에 실패했습니다. 다시 시도해주세요.",
          type: "error",
        });
      }
    }
  };

  // 약관 모달 확인
  const handleTermsConfirm = () => {
    if (termsModal === "service") {
      setTermsViewed((prev) => ({
        ...prev,
        service: true,
      }));
    }

    if (termsModal === "privacy") {
      setTermsViewed((prev) => ({
        ...prev,
        privacy: true,
      }));
    }

    setTermsModal(null);
  };

  return (
    <div className="max-w-[648px] mx-auto my-[46px]">
      <Heading
        title="회원가입"
        description="지금, 새로운 배움의 여정을 시작해보세요."
      />

      <form
        noValidate
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
            disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)}
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
            className:
              form.password && !passwordRegex.test(form.password)
                ? "!border-2 !border-[#e05252]"
                : "",
          })}

          {/* 비밀번호 오류 메시지 */}
          {passwordMessage.text && (
            <p
              className="px-[17px] py-[13px] mt-[-10px] mb-[12px] rounded-[7px] text-[16px] bg-[#fff1f1] text-[#c94a4a]"
              role="status"
            >
              {passwordMessage.text}
            </p>
          )}

          {/* 비밀번호 확인 */}
          {field("confirm", "비밀번호 확인", "password", {
            minLength: 8,
            autoComplete: "new-password",
            className:
              form.confirm && form.confirm !== form.password
                ? "!border-2 !border-[#e05252]"
                : "",
          })}

          {/* 비밀번호 확인 오류 메시지 */}
          {confirmMessage.text && (
            <p
              className="px-[17px] py-[13px] mt-[-10px] mb-[12px] rounded-[7px] text-[16px] bg-[#fff1f1] text-[#c94a4a]"
              role="status"
            >
              {confirmMessage.text}
            </p>
          )}

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
                  ["관리자", "admin"].includes(nickname.toLowerCase())
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

          {/* 전화번호 */}
          {field("phone", "전화번호", "tel", {
            pattern: "[0-9-]{9,13}",
          })}

          {/* 전화번호 오류 메시지 */}
          {phoneMessage.text && (
            <p
              className="px-[17px] py-[13px] mt-[-10px] mb-[12px] rounded-[7px] text-[16px] bg-[#fff1f1] text-[#c94a4a]"
              role="status"
            >
              {phoneMessage.text}
            </p>
          )}

          {/* 주소 */}
          <div style={{ marginTop: 20 }}>
            {/* 도로명 주소 */}
            {field("address", "도로명 주소")}

            {/* 도로명 주소 오류 메시지 */}
            {addressMessage.text && (
              <p
                className="px-[17px] py-[13px] mt-[-10px] mb-[12px] rounded-[7px] text-[16px] bg-[#fff1f1] text-[#c94a4a]"
                role="status"
              >
                {addressMessage.text}
              </p>
            )}

            {/* 상세 주소 */}
            {field("detail", "상세 주소")}

            {/* 상세 주소 오류 메시지 */}
            {detailMessage.text && (
              <p
                className="px-[17px] py-[13px] mt-[-10px] mb-[12px] rounded-[7px] text-[16px] bg-[#fff1f1] text-[#c94a4a]"
                role="status"
              >
                {detailMessage.text}
              </p>
            )}
          </div>

          {/* 약관 동의 */}
          <div className="mt-[14px] space-y-[10px]">
            {/* 서비스 이용약관 */}
            <div className="flex items-center gap-[10px]">
              <input
                type="checkbox"
                checked={serviceAgree}
                onChange={(e) => {
                  setServiceAgree(e.target.checked);

                  setFormMessage({
                    text: "",
                    type: "",
                  });
                }}
                className="cursor-pointer accent-[#f97316]"
              />

              <span className="text-[16px]">
                [필수] 서비스 이용약관에 동의합니다.
              </span>

              <button
                type="button"
                className="ml-auto bg-transparent border-0 p-0 text-[14px] text-[#6b7280] hover:text-[#f97316] transition-colors duration-200 cursor-pointer"
                onClick={() => setTermsModal("service")}
              >
                내용보기 &gt;
              </button>
            </div>

            {/* 개인정보 처리방침 */}
            <div className="flex items-center gap-[10px]">
              <input
                type="checkbox"
                checked={privacyAgree}
                onChange={(e) => {
                  setPrivacyAgree(e.target.checked);

                  setFormMessage({
                    text: "",
                    type: "",
                  });
                }}
                className="cursor-pointer accent-[#f97316]"
              />

              <span className="text-[16px]">
                [필수] 개인정보 처리방침에 동의합니다.
              </span>

              <button
                type="button"
                className="ml-auto bg-transparent border-0 p-0 text-[14px] text-[#6b7280] hover:text-[#f97316] transition-colors duration-200 cursor-pointer"
                onClick={() => setTermsModal("privacy")}
              >
                내용보기 &gt;
              </button>
            </div>
          </div>

          {/* 약관 오류 메시지 */}
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
            className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer hover:opacity-90 transition-opacity"
            style={{ marginTop: 20 }}
          >
            회원가입
          </button>
        </div>
      </form>

      {/* 약관 모달 */}
      {termsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setTermsModal(null)}
        >
          <div
            className="w-full max-w-[560px] max-h-[80vh] overflow-hidden bg-white rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 제목 */}
            <div className="px-[24px] py-[20px] border-b border-[#ebe6e0]">
              <h2 className="text-[20px] font-bold text-[#1f2937]">
                {termsModal === "service"
                  ? "서비스 이용약관"
                  : "개인정보 처리방침"}
              </h2>
            </div>

            {/* 모달 내용 */}
            <div className="max-h-[55vh] overflow-y-auto px-[24px] py-[22px] text-[15px] leading-[1.8] text-[#4b5563]">
              {termsModal === "service" ? (
                <>
                  <h3 className="font-bold text-[#1f2937] mb-[8px]">
                    제1조 (목적)
                  </h3>

                  <p className="mb-[18px]">
                    본 약관은 CLASS:ON에서 제공하는 원데이 클래스 서비스의
                    이용과 관련하여 필요한 사항을 규정하는 것을 목적으로
                    합니다.
                  </p>

                  <h3 className="font-bold text-[#1f2937] mb-[8px]">
                    제2조 (서비스 이용)
                  </h3>

                  <p className="mb-[18px]">
                    회원은 본 약관에 동의함으로써 CLASS:ON에서 제공하는
                    클래스 조회, 예약 및 기타 서비스를 이용할 수 있습니다.
                  </p>

                  <h3 className="font-bold text-[#1f2937] mb-[8px]">
                    제3조 (회원의 의무)
                  </h3>

                  <p className="mb-[18px]">
                    회원은 서비스 이용 과정에서 관련 법령과 본 약관을
                    준수해야 하며, 타인의 정보를 부정하게 사용해서는 안
                    됩니다.
                  </p>

                  <h3 className="font-bold text-[#1f2937] mb-[8px]">
                    제4조 (회원 탈퇴의 제한)
                  </h3>

                  <p className="mb-[12px]">
                    회원은 자유롭게 회원 탈퇴를 요청할 수 있습니다. 다만,
                    원활한 클래스 운영 및 예약·결제 처리를 위해 다음의
                    경우에는 회원 탈퇴가 제한될 수 있습니다.
                  </p>

                  <p className="mb-[8px]">
                    1. 일반 회원의 경우 현재 수강 중이거나 수강 예정인
                    클래스가 있거나 환불 절차가 진행 중인 경우 회원 탈퇴가
                    제한됩니다.
                  </p>

                  <p className="mb-[8px]">
                    2. 강사 회원의 경우 현재 진행 중이거나 진행 예정인
                    클래스가 있거나 담당 클래스에 환불 처리가 진행 중인
                    예약 건이 있는 경우 회원 탈퇴가 제한됩니다.
                  </p>

                  <p>
                    3. 탈퇴 제한 사유가 없는 경우 회원은 자유롭게 회원 탈퇴를
                    요청할 수 있습니다.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-[#1f2937] mb-[8px]">
                    제1조 (개인정보의 수집 및 이용 목적)
                  </h3>

                  <p className="mb-[18px]">
                    CLASS:ON은 회원가입 및 서비스 제공을 위해 필요한
                    개인정보를 수집하고 이용합니다.
                  </p>

                  <h3 className="font-bold text-[#1f2937] mb-[8px]">
                    제2조 (개인정보 수집내역)
                  </h3>

                  <p className="mb-[18px]">
                    회원가입 과정에서 이메일, 비밀번호, 닉네임, 전화번호,
                    주소 등의 정보를 수집할 수 있습니다.
                  </p>

                  <h3 className="font-bold text-[#1f2937] mb-[8px]">
                    제3조 (개인정보의 보유 및 이용기간)
                  </h3>

                  <p className="mb-[18px]">
                    회원의 개인정보는 회원가입 및 서비스 이용 기간 동안
                    서비스 제공을 위해 필요한 범위 내에서 보유·이용됩니다.
                  </p>

                  <p>
                    회원이 탈퇴하는 경우 회원이 작성한 게시물을 제외한
                    회원의 모든 개인정보와 결제내역은 즉시 폐기됩니다.
                  </p>
                </>
              )}
            </div>

            {/* 모달 확인 */}
            <div className="flex justify-end px-[24px] py-[18px] border-t border-[#ebe6e0]">
              <button
                type="button"
                className="flex w-fit justify-center items-center min-h-[50px] px-[26px] py-3 rounded-lg bg-[#e56b00] text-white font-bold text-[17px] hover:opacity-90 transition-opacity"
                onClick={handleTermsConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}