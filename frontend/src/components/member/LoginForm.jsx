import { useState } from "react";
import { useNavigate } from "react-router";
import { loginPost } from "../../api/memberApi";
import { setCookie } from "../../util/cookieUtil";
import "../../css/member/LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [memEmail, setMemEmail] = useState("");
  const [memPassword, setMemPassword] = useState("");

  // 로그인 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

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

      // 메인 페이지 이동
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>

      <input
        className="login-input"
        type="email"
        placeholder="이메일"
        value={memEmail}
        onChange={(e) => setMemEmail(e.target.value)}
      />

      <input
        className="login-input"
        type="password"
        placeholder="비밀번호"
        value={memPassword}
        onChange={(e) => setMemPassword(e.target.value)}
      />

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