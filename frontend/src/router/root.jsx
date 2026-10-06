import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import { Shell, Access } from "../layouts/Layout";
import { ButtonLink } from "../components/common/ButtonLink";
import { Heading } from "../components/common/Heading";

import MainPage from "../pages/main/MainPage";
import ClassListPage from "../pages/class/ClassListPage";
import ClassDetailPage from "../pages/class/ClassDetailPage";
import FavoritePage from "../pages/class/FavoritePage";
import FavoriteComparePage from "../pages/class/FavoriteComparePage";
import ReservationPage from "../pages/class/ReservationPage";
import ReservationListPage from "../pages/class/ReservationListPage";
import ReservationDetailPage from "../pages/class/ReservationDetailPage";
import PaymentPage from "../pages/class/PaymentPage";
import PaymentDetailPage from "../pages/class/PaymentDetailPage";
import ReviewAddPage from "../pages/class/ReviewAddPage";
import ReviewListPage from "../pages/class/ReviewListPage";

import LoginPage from "../pages/member/LoginPage";
import SignupPage from "../pages/member/SignupPage";
import MyPage from "../pages/member/MyPage";

import InstructorDashboard from "../pages/instructor/InstructorDashboard";
import InstructorClassPage from "../pages/instructor/InstructorClassPage";
import InstructorClassForm from "../pages/instructor/InstructorClassForm";
import SchedulePage from "../pages/instructor/SchedulePage";

import BoardListPage from "../pages/board/BoardListPage";
import BoardReadPage from "../pages/board/BoardReadPage";
import BoardFormPage from "../pages/board/BoardFormPage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminManagePage from "../pages/admin/AdminManagePage";
import AdminReservationPage from "../pages/admin/AdminReservationPage";

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
      <Route index element={<MainPage />} />

      <Route path="auth/login" element={<LoginPage />} />
      <Route path="auth/signup" element={<SignupPage />} />

      <Route path="class" element={<ClassListPage />} />
      <Route path="class/list" element={<ClassListPage />} />
      <Route path="class/:clsNo" element={<ClassDetailPage />} />

      <Route path="notice" element={<BoardListPage />} />
      <Route path="notice/list" element={<BoardListPage />} />
      <Route path="notice/read/:notNo" element={<BoardReadPage />} />
      <Route path="notice/:notNo" element={<BoardReadPage />} />

      <Route element={<Access roles={["USER", "INS"]} />}>
        <Route path="member/mypage" element={<MyPage />} />
        <Route path="member/mypage/edit" element={<MyPage edit />} />
        <Route path="member/favorites" element={<FavoritePage />} />
        <Route path="favorites/compare" element={<FavoriteComparePage />} />
        <Route path="member/reviews" element={<ReviewListPage />} />

        <Route path="reservation" element={<ReservationPage />} />
        <Route
          path="reservation/available/:schNo"
          element={<ReservationPage />}
        />
        <Route
          path="reservation/duplicate/:schNo"
          element={<ReservationPage />}
        />
        <Route
          path="reservation/member/:memNo"
          element={<ReservationListPage />}
        />
        <Route
          path="reservation/:rsvNo"
          element={<ReservationDetailPage />}
        />
        <Route
          path="reservation/:rsvNo/edit"
          element={<ReservationPage edit />}
        />
        <Route
          path="reservation/:rsvNo/cancel"
          element={<ReservationDetailPage cancel />}
        />
        <Route
          path="reservation/:rsvNo/review"
          element={<ReviewAddPage />}
        />

        <Route
          path="payment/member/:memNo"
          element={<ReservationListPage payment />}
        />
        <Route
          path="payment/reservation/:rsvNo"
          element={<PaymentDetailPage />}
        />
        <Route path="payment/detail/:payNo" element={<PaymentDetailPage />} />
        <Route
          path="payment/:payNo/success"
          element={<PaymentDetailPage complete />}
        />
        <Route path="payment/:rsvNo" element={<PaymentPage />} />

        <Route path="inquiry" element={<BoardListPage inquiry />} />
        <Route path="inquiry/list" element={<BoardListPage inquiry />} />
        <Route path="inquiry/register" element={<BoardFormPage inquiry />} />
        <Route path="reports/register" element={<BoardFormPage inquiry />} />
        <Route
          path="inquiry/read/:inqNo"
          element={<BoardReadPage inquiry />}
        />
        <Route path="reports/:repNo" element={<BoardReadPage inquiry />} />
      </Route>

      <Route element={<Access roles={["INS"]} />}>
        <Route path="instructor/mypage" element={<MyPage instructor />} />
        <Route
          path="instructor/mypage/edit"
          element={<MyPage instructor edit />}
        />
        <Route
          path="reservation/schedule/:schNo"
          element={<ReservationListPage instructor schedule />}
        />
        <Route
          path="reservation/instructor/:memNo"
          element={<ReservationListPage instructor />}
        />

        <Route path="instructor" element={<InstructorDashboard />} />
        <Route path="instructor/classes" element={<InstructorClassPage />} />
        <Route
          path="instructor/classes/register"
          element={<InstructorClassForm />}
        />
        <Route
          path="instructor/classes/:clsNo/edit"
          element={<InstructorClassForm edit />}
        />
        <Route path="instructor/schedules" element={<SchedulePage />} />
        <Route
          path="instructor/reviews"
          element={<ReviewListPage instructor />}
        />
      </Route>

      <Route element={<Access roles={["ADMIN"]} />}>
        <Route
          path="reservation/:rsvNo/status"
          element={<ReservationDetailPage status />}
        />
        <Route
          path="payment/:payNo/status"
          element={<PaymentDetailPage status />}
        />

        <Route path="admin" element={<AdminDashboard />} />
        <Route
          path="admin/members"
          element={<AdminManagePage kind="members" />}
        />
        <Route path="admin/classes" element={<AdminManagePage />} />
        <Route
          path="admin/reviews"
          element={<AdminManagePage kind="reviews" />}
        />
        <Route
          path="admin/reservations"
          element={<AdminReservationPage />}
        />

        <Route path="admin/notice" element={<BoardListPage admin />} />
        <Route path="admin/notice/list" element={<BoardListPage admin />} />
        <Route path="notice/admin" element={<BoardListPage admin />} />
        <Route path="admin/notice/register" element={<BoardFormPage />} />
        <Route path="notice/admin/register" element={<BoardFormPage />} />
        <Route
          path="admin/notice/read/:notNo"
          element={<BoardReadPage admin />}
        />
        <Route path="admin/notice/:notNo" element={<BoardReadPage admin />} />
        <Route
          path="notice/admin/read/:notNo"
          element={<BoardReadPage admin />}
        />
        <Route
          path="admin/notice/modify/:notNo"
          element={<BoardFormPage edit />}
        />
        <Route
          path="admin/notice/:notNo/edit"
          element={<BoardFormPage edit />}
        />
        <Route
          path="notice/admin/modify/:notNo"
          element={<BoardFormPage edit />}
        />

        <Route
          path="admin/inquiry/list"
          element={<BoardListPage inquiry admin />}
        />
        <Route path="admin/reports" element={<BoardListPage inquiry admin />} />
        <Route path="inquiry/admin" element={<BoardListPage inquiry admin />} />
        <Route
          path="admin/inquiry/read/:inqNo"
          element={<BoardReadPage inquiry admin />}
        />
        <Route
          path="admin/reports/:repNo"
          element={<BoardReadPage inquiry admin />}
        />
        <Route
          path="inquiry/admin/read/:repNo"
          element={<BoardReadPage inquiry admin />}
        />
      </Route>

      <Route path="*" element={notFound} />
    </Route>,
  ),
);

export default root;
