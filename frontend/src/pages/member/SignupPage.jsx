import SignupForm from "../../components/member/SignupForm";
import BasicLayout from "../../layouts/BasicLayout.jsx";
import "../../css/common.css";

const SignupPage = () => {

  return (
    <BasicLayout>

      <div className="classon_main signup-page">

        <div className="signup-content">

          <h1 className="page-title">
            회원가입
          </h1>

          <SignupForm />

        </div>

      </div>

    </BasicLayout>
  );
};

export default SignupPage;