import { useState } from "react";
import { loginPost } from "../../api/memberApi";

const LoginForm = () => {
  // 입력값 관리
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
      // 로그인 API 호출
      const response = await loginPost(loginData);

      console.log(response);
    } catch (error) {
      // 로그인 오류 확인
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          placeholder="이메일"
          value={memEmail}
          onChange={(e) => setMemEmail(e.target.value)}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="비밀번호"
          value={memPassword}
          onChange={(e) => setMemPassword(e.target.value)}
        />
      </div>

      <div>
        <button type="submit">로그인</button>
        <button type="button">회원가입</button>
      </div>
    </form>
  );
};

export default LoginForm;