import { useState } from "react";
import { useNavigate } from "react-router";
import { loginPost } from "../../api/memberApi";
import { setCookie } from "../../util/cookieUtil";
import "../../css/member/LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [memEmail, setMemEmail] = useState("");
  const [memPassword, setMemPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 로그인 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    if (!memEmail.trim()) {
      setEmailError("이메일을 입력해 주세요.");
      return;
    }

    if (!memPassword.trim()) {
      setPasswordError("비밀번호를 입력해 주세요.");
      return;
    }

    const loginData = {
      memEmail,
      memPassword,
    };

    try {
      const response = await loginPost(loginData);

      setCookie("member", {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      }, 1);
      window.location.href = "/";
    } catch {
      alert("이메일 혹은 비밀번호를 잘못 입력하셨습니다.");

      setMemEmail("");
      setMemPassword("");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>

      <div className="login-input-wrap">
        <input
          className="login-input"
          type="email"
          placeholder={emailError ? "" : "이메일"}
          value={memEmail}
          onChange={(e) => {
            setMemEmail(e.target.value);
            setEmailError("");
          }}
        />

        {emailError && (
          <span className="login-error">
            {emailError}
          </span>
        )}
      </div>

      <div className="login-input-wrap">
        <input
          className="login-input"
          type="password"
          placeholder={passwordError ? "" : "비밀번호"}
          value={memPassword}
          onChange={(e) => {
            setMemPassword(e.target.value);
            setPasswordError("");
          }}
        />

        {passwordError && (
          <span className="login-error">
            {passwordError}
          </span>
        )}
      </div>

      <div className="login-buttons">

        <button type="submit" className="orange-button">
        로그인
        </button>

        <button
          type="button"
          className="orange-light-button"
          onClick={() => navigate("/auth/signup")}
          >
            회원가입
        </button>
      </div>

      <div className="password-find">
        <button type="button">
          비밀번호 찾기
        </button>
      </div>

    </form>
  );
};

export default LoginForm;