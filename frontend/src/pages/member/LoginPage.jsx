import LoginForm from "../../components/member/LoginForm";
import "../../css/common.css";

const LoginPage = () => {

  return (
    <main className="classon_main app-background">

      <div className="app-container">

        <h1 className="page-title">
          로그인
        </h1>

        <LoginForm />

      </div>

    </main>
  );
};

export default LoginPage;