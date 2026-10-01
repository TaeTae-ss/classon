import LoginForm from "../../components/member/LoginForm";
import BasicLayout from "../../layouts/BasicLayout.jsx";
import "../../css/common.css";

const LoginPage = () => {

  return (
    <BasicLayout>

      <div className="classon_main app-background">

        <div className="app-container">

          <h1 className="page-title">
            로그인
          </h1>

          <LoginForm />

        </div>

      </div>

    </BasicLayout>
  );
};

export default LoginPage;