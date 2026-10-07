import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router";

import { Shell } from "../layouts/Layout";
import { ButtonLink } from "../components/common/ButtonLink";
import { Heading } from "../components/common/Heading";

import MainPage from "../pages/main/MainPage";
import LoginPage from "../pages/member/LoginPage";
import SignupPage from "../pages/member/SignupPage";
import PasswordPage from "../pages/member/PasswordPage";

import memberRouter from "./memberRouter";
import classRouter from "./classRouter";
import boardRouter from "./boardRouter";
import instructorRouter from "./instructorRouter";
import adminRouter from "./adminRouter";

const notFound = (
    <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px] max-w-[648px] mx-auto my-[46px] [&>a]:flex [&>a]:w-fit [&>a]:max-w-full [&>a]:ml-auto">
        <Heading
            title="페이지를 찾을 수 없습니다."
            description="주소를 확인하거나 메인 페이지로 이동해주세요."
        />
        <ButtonLink to="/">메인으로</ButtonLink>
    </section>
);

const root = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Shell />}>

            {/* 기본 */}
            <Route index element={<MainPage />} />
            <Route path="auth/login" element={<LoginPage />} />
            <Route path="auth/signup" element={<SignupPage />} />
            <Route path="auth/password" element={<PasswordPage />} />

            {/* 회원 */}
            {memberRouter}

            {/* 클래스 */}
            {classRouter}

            {/* 게시판 */}
            {boardRouter}

            {/* 강사 */}
            {instructorRouter}

            {/* 관리자 */}
            {adminRouter}

            {/* 404 */}
            <Route path="*" element={notFound} />

        </Route>
    ),
);

export default root;