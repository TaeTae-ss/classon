
import { Route } from "react-router";
import { Access } from "../layouts/Layout";

import AdminManagePage from "../pages/admin/AdminManagePage";
import AdminInstructorPage from "../pages/admin/AdminInstructorPage";

import BoardListPage from "../pages/board/BoardListPage";
import BoardReadPage from "../pages/board/BoardReadPage";
import BoardFormPage from "../pages/board/BoardFormPage";

const adminRouter = (
  <Route element={<Access roles={["ADMIN"]} />}>
    {/* 회원 관리 */}
    <Route
      path="admin/members"
      element={<AdminManagePage kind="members" />}
    />

    {/* 후기 관리 */}
    <Route
      path="admin/reviews"
      element={<AdminManagePage kind="reviews" />}
    />

    {/* 강사 신청 관리 */}
    <Route
      path="admin/instructor/list"
      element={<AdminInstructorPage />}
    />

    {/* 공지사항 관리 */}
    <Route
      path="admin/notice/list"
      element={<BoardListPage admin />}
    />

    <Route
      path="admin/notice/register"
      element={<BoardFormPage />}
    />

    <Route
      path="admin/notice/read/:notNo"
      element={<BoardReadPage admin />}
    />

    <Route
      path="admin/notice/modify/:notNo"
      element={<BoardFormPage edit />}
    />

    {/* 문의 관리 */}
    <Route
      path="admin/inquiry/list"
      element={<BoardListPage inquiry admin />}
    />

    <Route
      path="admin/inquiry/read/:inqNo"
      element={<BoardReadPage inquiry admin />}
    />
  </Route>
);

export default adminRouter;