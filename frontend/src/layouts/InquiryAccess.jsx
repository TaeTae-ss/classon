import { Navigate, Outlet, useLocation } from "react-router";
import { getCookie } from "../util/cookieUtil";

export default function InquiryAccess() {
  const location = useLocation();

  const member = getCookie("member");

  // 로그인 정보가 없으면 로그인 페이지로 이동
  if (!member?.accessToken) {
    const returnTo = encodeURIComponent(
      location.pathname + location.search
    );

    return (
      <Navigate
        to={`/auth/login?returnTo=${returnTo}`}
        replace
      />
    );
  }

  return <Outlet />;
}