import { useState } from "react";

const LoginForm = () => {
  const [memEmail, setMemEmail] = useState("");
  const [memPassword, setMemPassword] = useState("");

  return (
    <form>
      <div>
        <label>이메일</label>
        <input
          type="email"
          value={memEmail}
          onChange={(e) => setMemEmail(e.target.value)}
        />
      </div>

      <div>
        <label>비밀번호</label>
        <input
          type="password"
          value={memPassword}
          onChange={(e) => setMemPassword(e.target.value)}
        />
      </div>

      <button type="submit">로그인</button>
    </form>
  );
};

export default LoginForm;