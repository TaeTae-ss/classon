import LoginPage from "../pages/member/LoginPage";
import SignupPage from "../pages/member/SignupPage";

const authRouter = () => {
  return [
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "signup",
      element: <SignupPage />,
    },
  ];
};

export default authRouter;