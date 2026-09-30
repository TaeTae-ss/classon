import { useState } from "react";
import { signupPost } from "../../api/memberApi";
import "../../css/member/SignupForm.css";

const SignupForm = () => {
  const [memEmail, setMemEmail] = useState("");
  const [memPassword, setMemPassword] = useState("");
  const [memPasswordConfirm, setMemPasswordConfirm] = useState("");
  const [memNickname, setMemNickname] = useState("");
  const [memPhone, setMemPhone] = useState("");
  const [memAddress, setMemAddress] = useState("");
  const [memAddressDetail, setMemAddressDetail] = useState("");
  const [memBirth, setMemBirth] = useState("");
  const [authCode, setAuthCode] = useState("");

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

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

  return (
    <form className="signup-form" onSubmit={handleSubmit}>

      <div className="signup-row">
        <label>이메일</label>

        <div className="signup-field-button">
          <input
            className="signup-input"
            type="email"
            value={memEmail}
            onChange={(e) => setMemEmail(e.target.value)}
          />

          <button type="button">
            중복확인
          </button>
        </div>
      </div>

      <div className="signup-row">
        <label>인증번호</label>

        <div className="signup-field-button">
          <input
            className="signup-input"
            type="text"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
          />

          <button type="button">
            인증
          </button>
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