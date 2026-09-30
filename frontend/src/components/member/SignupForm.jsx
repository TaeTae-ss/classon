import { useState } from "react";
import { signupPost, checkEmail, sendEmail, verifyEmail } from "../../api/memberApi";
import "../../css/member/SignupForm.css";

const SignupForm = () => {
   // 이메일
  const [memEmail, setMemEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [authError, setAuthError] = useState("");
  // 비밀번호
  const [memPassword, setMemPassword] = useState("");
  const [memPasswordConfirm, setMemPasswordConfirm] = useState("");
  // 닉네임
  const [memNickname, setMemNickname] = useState("");
  const [memPhone, setMemPhone] = useState("");
  const [memAddress, setMemAddress] = useState("");
  const [memAddressDetail, setMemAddressDetail] = useState("");
  const [memBirth, setMemBirth] = useState("");
  const [authCode, setAuthCode] = useState("");

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailChecked) {
    setEmailError("이메일 중복확인을 해주세요.");
    return;
   }

    const signupData = {
      memEmail,
      memPassword,
      memNickname,
      memPhone,
      memAddress,
      memBirth,
    };

    try {
      const response = await signupPost(signupData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

// 이메일 중복 확인
const handleCheckEmail = async () => {

  if (!memEmail) {
    setEmailError("이메일을 입력해 주세요.");
    return;
  }

  try {

   const available = await checkEmail(memEmail);

   if (available) {
      setEmailChecked(true);
      setEmailError("사용 가능한 이메일입니다.");
   } else {
      setEmailChecked(false);
      setEmailError("이미 사용 중인 이메일입니다.");
   }

  } catch (error) {

    setEmailChecked(false);
    setEmailError("이메일 중복 확인에 실패했습니다.");
    console.error(error);
  }
};

// 이메일 인증번호 발송
const handleSendEmail = async () => {

  if (!memEmail) {
    setAuthError("이메일을 입력해 주세요.");
    return;
  }

  try {
    await sendEmail(memEmail);

    setEmailSent(true);
    setAuthError("");

  } catch (error) {
    console.error(error);
    setAuthError("인증번호 발송에 실패했습니다.");
  }
};

// 이메일 인증번호 확인
const handleVerifyEmail = async () => {

  if (!authCode) {
    setAuthError("인증번호를 입력해 주세요.");
    return;
  }

  try {
    const verified = await verifyEmail(memEmail, authCode);

    if (verified) {
      setEmailVerified(true);
      setAuthError("");
      alert("인증되었습니다.");
    } else {
      setEmailVerified(false);
      alert("인증번호가 다릅니다.");
    }

  } catch (error) {
    console.error(error);
    alert("인증번호가 다릅니다.");
  }
};

  return (
    <form className="signup-form" onSubmit={handleSubmit}>

      <div className="signup-row">
         <label>이메일</label>

         <div className="signup-field">
            <div className="signup-field-button">
               <input
                  className="signup-input"
                  type="email"
                  value={memEmail}
                  onChange={(e) => {
                     setMemEmail(e.target.value);
                     setEmailChecked(false);
                     setEmailError("");
                  }}
               />

               <button
                  type="button"
                  onClick={handleCheckEmail}
               >
                  중복확인
               </button>
            </div>

            {emailError && (
               <p className="signup-error">
                  {emailError}
               </p>
            )}
         </div>
      </div>

      <div className="signup-row">
         <label>인증번호</label>

         <div className="signup-field">

            <div className="signup-field-button">
               <input
                  className="signup-input auth-code-input"
                  type="text"
                  value={authCode}
                  onChange={(e) => {
                     setAuthCode(e.target.value);
                     setAuthError("");
                     setEmailVerified(false);
                  }}
               />

               <button
                  type="button"
                  className="email-send-button"
                  onClick={handleSendEmail}
               >
                  {emailSent ? "인증번호 재발송" : "인증번호 발송"}
               </button>

               <button
                  type="button"
                  className="email-verify-button"
                  onClick={handleVerifyEmail}
               >
                  인증번호 확인
               </button>
            </div>

            {emailSent && !emailVerified && (
               <p className="signup-success">
                  메일이 발송되었습니다.
               </p>
            )}

            {authError && (
               <p className="signup-error">
                  {authError}
               </p>
            )}
         </div>
      </div>

      <div className="signup-row">
        <label>비밀번호</label>

        <input
          className="signup-input"
          type="password"
          value={memPassword}
          onChange={(e) => setMemPassword(e.target.value)}
        />
      </div>

      <div className="signup-row">
        <label>비밀번호 확인</label>

        <input
          className="signup-input"
          type="password"
          value={memPasswordConfirm}
          onChange={(e) => setMemPasswordConfirm(e.target.value)}
        />
      </div>

      <div className="signup-row">
        <label>닉네임</label>

        <div className="signup-field-button">
          <input
            className="signup-input"
            type="text"
            value={memNickname}
            onChange={(e) => setMemNickname(e.target.value)}
          />

          <button type="button">
            중복확인
          </button>
        </div>
      </div>

      <div className="signup-row">
        <label>전화번호</label>

        <input
          className="signup-input"
          type="tel"
          value={memPhone}
          onChange={(e) => setMemPhone(e.target.value)}
        />
      </div>

      <div className="signup-row">
        <label>주소</label>

        <div className="signup-field-button">
          <input
            className="signup-input"
            type="text"
            value={memAddress}
            onChange={(e) => setMemAddress(e.target.value)}
          />

          <button type="button">
            주소검색
          </button>
        </div>
      </div>

      <div className="signup-row">
        <label></label>

        <input
          className="signup-input"
          type="text"
          placeholder="상세주소"
          value={memAddressDetail}
          onChange={(e) => setMemAddressDetail(e.target.value)}
        />
      </div>

      <div className="signup-row">
        <label>생년월일</label>

        <input
          className="signup-input"
          type="date"
          value={memBirth}
          onChange={(e) => setMemBirth(e.target.value)}
        />
      </div>

      <div className="signup-submit">
        <button
          type="submit"
          className="orange-button"
        >
          회원가입
        </button>
      </div>

    </form>
  );
};

export default SignupForm;