import SignupForm from "../../components/member/SignupForm";

const SignupPage = () => {

  return (
    <main className="classon_main app-background">

      <div className="app-container">

        <h1 className="page-title">
          회원가입
        </h1>

        <SignupForm />

      </div>

    </main>
  );
};

export default SignupPage;