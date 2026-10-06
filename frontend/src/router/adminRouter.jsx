import { Route } from "react-router";
import { Access } from "../layouts/Layout";

import ReservationDetailPage from "../pages/class/ReservationDetailPage";
import PaymentDetailPage from "../pages/class/PaymentDetailPage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminManagePage from "../pages/admin/AdminManagePage";
import AdminReservationPage from "../pages/admin/AdminReservationPage";

import BoardListPage from "../pages/board/BoardListPage";
import BoardReadPage from "../pages/board/BoardReadPage";
import BoardFormPage from "../pages/board/BoardFormPage";

const adminRouter = (
    <Route element={<Access roles={["ADMIN"]} />}>

        <Route
            path="reservation/:rsvNo/status"
            element={<ReservationDetailPage status />}
        />

        <Route
            path="payment/:payNo/status"
            element={<PaymentDetailPage status />}
        />

        <Route
            path="admin"
            element={<AdminDashboard />}
        />

        <Route
            path="admin/members"
            element={<AdminManagePage kind="members" />}
        />

        <Route
            path="admin/classes"
            element={<AdminManagePage />}
        />

        <Route
            path="admin/reviews"
            element={<AdminManagePage kind="reviews" />}
        />

        <Route
            path="admin/reservations"
            element={<AdminReservationPage />}
        />

        {/* 관리자 공지 */}
        <Route
            path="admin/notice"
            element={<BoardListPage admin />}
        />

        <Route
            path="admin/notice/list"
            element={<BoardListPage admin />}
        />

        <Route
            path="notice/admin"
            element={<BoardListPage admin />}
        />

        <Route
            path="admin/notice/register"
            element={<BoardFormPage />}
        />

        <Route
            path="notice/admin/register"
            element={<BoardFormPage />}
        />

        <Route
            path="admin/notice/read/:notNo"
            element={<BoardReadPage admin />}
        />

        <Route
            path="admin/notice/:notNo"
            element={<BoardReadPage admin />}
        />

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

        {/* 관리자 문의 */}
        <Route
            path="admin/inquiry/list"
            element={<BoardListPage inquiry admin />}
        />

        <Route
            path="admin/reports"
            element={<BoardListPage inquiry admin />}
        />

        <Route
            path="inquiry/admin"
            element={<BoardListPage inquiry admin />}
        />

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
);

export default adminRouter;