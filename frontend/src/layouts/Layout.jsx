import { Navigate, Outlet, useLocation } from "react-router";
import BasicLayout from "./BasicLayout";
import { readStore } from "../mocks/data";
import { DemoBar } from "../components/common/DemoBar";
import { ButtonLink } from "../components/common/ButtonLink";
import { Heading } from "../components/common/Heading";

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
export function Access({ roles }) {
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
      <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px] max-w-[648px] mx-auto my-[46px] [&>a]:flex [&>a]:w-fit [&>a]:max-w-full [&>a]:ml-auto">
        <Heading
          title="접근 권한을 확인해주세요."
          description="이 화면은 지정된 권한으로 볼 수 있습니다. 상단에서 미리보기 권한을 변경해주세요."
        />
        <ButtonLink to="/">메인으로</ButtonLink>
      </section>
    );
  return <Outlet />;
}
