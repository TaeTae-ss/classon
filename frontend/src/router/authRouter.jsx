import LoginPage from "../pages/member/LoginPage";

const authRouter = () => {
  return [
    {
      path: "login",
      element: <LoginPage />,
    },
  ];
};

export default authRouter;