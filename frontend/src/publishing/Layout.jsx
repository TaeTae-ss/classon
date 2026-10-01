import { Navigate, Outlet, useLocation } from "react-router";
import BasicLayout from "../layouts/BasicLayout";
import { readStore } from "./data";
import { DemoBar, ButtonLink, Heading } from "./ui";
import "../css/common.css";
export function Shell() {
  return (
    <BasicLayout>
      <div className="co-page">
        <DemoBar />
        <Outlet />
      </div>
    </BasicLayout>
  );
}
export function Access({ roles, children }) {
  const location = useLocation();
  const role = readStore("role", "PUBLIC");
  if (role === "PUBLIC")
    return (
      <Navigate
        to={`/auth/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  if (!roles.includes(role))
    return (
      <section className="co-panel co-narrow">
        <Heading
          title="접근 권한을 확인해주세요."
          description="이 화면은 지정된 권한으로 볼 수 있습니다. 상단에서 미리보기 권한을 변경해주세요."
        />
        <ButtonLink to="/">메인으로</ButtonLink>
      </section>
    );
  return children;
}
