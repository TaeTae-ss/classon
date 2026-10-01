import { createBrowserRouter } from "react-router";
import { Shell, Access } from "../publishing/Layout";

import { ButtonLink, Heading } from "../publishing/ui";
import * as Class from "../publishing/ClassPages";
import * as Member from "../publishing/MemberPages";
import * as Instructor from "../publishing/InstructorPages";
import * as Board from "../publishing/BoardPages";
import * as Admin from "../publishing/AdminPages";
import "../css/common.css";
const user = (e) => <Access roles={["USER", "INS"]}>{e}</Access>;
const ins = (e) => <Access roles={["INS"]}>{e}</Access>;
const admin = (e) => <Access roles={["ADMIN"]}>{e}</Access>;
const routes = [];
const add = (paths, element) =>
  paths.split("|").forEach((path) => routes.push({ path, element }));
add("auth/login", <Member.LoginPage />);
add("auth/signup", <Member.SignupPage />);
add("class|class/list", <Class.ClassListPage />);
add("class/:clsNo", <Class.ClassDetailPage />);
add("member/mypage", user(<Member.MyPage />));
add("member/mypage/edit", user(<Member.MyPage edit />));
add("instructor/mypage", ins(<Member.MyPage instructor />));
add("instructor/mypage/edit", ins(<Member.MyPage instructor edit />));
add("member/favorites", user(<Class.FavoritePage />));
add("favorites/compare", user(<Class.FavoriteComparePage />));
add("member/reviews", user(<Class.ReviewListPage />));
add(
  "reservation|reservation/available/:schNo|reservation/duplicate/:schNo",
  user(<Class.ReservationPage />),
);
add("reservation/member/:memNo", user(<Class.ReservationListPage />));
add(
  "reservation/schedule/:schNo",
  ins(<Class.ReservationListPage instructor schedule />),
);
add(
  "reservation/instructor/:memNo",
  ins(<Class.ReservationListPage instructor />),
);
add("reservation/:rsvNo", user(<Class.ReservationDetailPage />));
add("reservation/:rsvNo/edit", user(<Class.ReservationPage edit />));
add("reservation/:rsvNo/cancel", user(<Class.ReservationDetailPage cancel />));
add("reservation/:rsvNo/status", admin(<Class.ReservationDetailPage status />));
add("reservation/:rsvNo/review", user(<Class.ReviewAddPage />));
add("payment/member/:memNo", user(<Class.ReservationListPage payment />));
add(
  "payment/reservation/:rsvNo|payment/detail/:payNo",
  user(<Class.PaymentDetailPage />),
);
add("payment/:payNo/success", user(<Class.PaymentDetailPage complete />));
add("payment/:payNo/status", admin(<Class.PaymentDetailPage status />));
add("payment/:rsvNo", user(<Class.PaymentPage />));
add("notice|notice/list", <Board.BoardListPage />);
add("notice/read/:notNo|notice/:notNo", <Board.BoardReadPage />);
add("admin", admin(<Admin.AdminDashboard />));
add("admin/members", admin(<Admin.AdminManagePage kind="members" />));
add("admin/classes", admin(<Admin.AdminManagePage />));
add("admin/reviews", admin(<Admin.AdminManagePage kind="reviews" />));
add("admin/reservations", admin(<Admin.AdminReservationPage />));
add(
  "admin/notice|admin/notice/list|notice/admin",
  admin(<Board.BoardListPage admin />),
);
add(
  "admin/notice/register|notice/admin/register",
  admin(<Board.BoardFormPage />),
);
add(
  "admin/notice/read/:notNo|admin/notice/:notNo|notice/admin/read/:notNo",
  admin(<Board.BoardReadPage admin />),
);
add(
  "admin/notice/modify/:notNo|admin/notice/:notNo/edit|notice/admin/modify/:notNo",
  admin(<Board.BoardFormPage edit />),
);
add("inquiry|inquiry/list", user(<Board.BoardListPage inquiry />));
add("inquiry/register|reports/register", user(<Board.BoardFormPage inquiry />));
add(
  "inquiry/read/:inqNo|reports/:repNo",
  user(<Board.BoardReadPage inquiry />),
);
add(
  "admin/inquiry/list|admin/reports|inquiry/admin",
  admin(<Board.BoardListPage inquiry admin />),
);
add(
  "admin/inquiry/read/:inqNo|admin/reports/:repNo|inquiry/admin/read/:repNo",
  admin(<Board.BoardReadPage inquiry admin />),
);
add("instructor", ins(<Instructor.InstructorDashboard />));
add("instructor/classes", ins(<Instructor.InstructorClassPage />));
add("instructor/classes/register", ins(<Instructor.InstructorClassForm />));
add(
  "instructor/classes/:clsNo/edit",
  ins(<Instructor.InstructorClassForm edit />),
);
add("instructor/schedules", ins(<Instructor.SchedulePage />));
add("instructor/reviews", ins(<Class.ReviewListPage instructor />));
add(
  "*",
  <section className="co-panel co-narrow">
    <Heading
      title="페이지를 찾을 수 없습니다."
      description="주소를 확인하거나 메인 페이지로 이동해주세요."
    />
    <ButtonLink to="/">메인으로</ButtonLink>
  </section>,
);
const root = createBrowserRouter([
  {
    element: <Shell />,
    children: [{ index: true, element: <Class.MainPage /> }, ...routes],
  },
]);
export default root;
