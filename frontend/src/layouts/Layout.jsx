import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import BasicLayout from "./BasicLayout";
import { readStore } from "../mocks/data";
import { ButtonLink } from "../components/common/ButtonLink";
import { Heading } from "../components/common/Heading";

export function Shell() {
  const [serverError, setServerError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const handleServerError = (event) => {
      setServerError(event.detail);
    };

    window.addEventListener("server-error", handleServerError);

    return () => {
      window.removeEventListener("server-error", handleServerError);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setServerError("");
    }
  }, [location.pathname]);

  return (
    <BasicLayout>
      <div className="co-page">
        {serverError ? (
          <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px] max-w-[648px] mx-auto my-[46px]">
            <Heading
              title="서버 오류가 발생했습니다."
              description={serverError}
            />
            <button
              type="button"
              onClick={() => {
                setServerError("");
                window.location.assign("/");
              }}
              className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg font-bold text-[17px] leading-[1.3] no-underline cursor-pointer transition-[background-color,color,border-color,opacity] duration-150 hover:bg-[#ea6500] hover:text-white hover:border-[#ea6500] hover:opacity-100 bg-accent text-white border border-accent"
            >
              메인으로
            </button>
          </section>
        ) : (
          <Outlet />
        )}
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
          description="이 화면은 지정된 권한으로 볼 수 있습니다."
        />
        <ButtonLink to="/">메인으로</ButtonLink>
      </section>
    );

  return <Outlet />;
}