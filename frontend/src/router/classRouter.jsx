import { Route } from "react-router";
import { Access } from "../layouts/Layout";

import ClassListPage from "../pages/class/ClassListPage";
import ClassDetailPage from "../pages/class/ClassDetailPage";

import ReservationPage from "../pages/class/ReservationPage";
import ReservationListPage from "../pages/class/ReservationListPage";
import ReservationDetailPage from "../pages/class/ReservationDetailPage";

import PaymentPage from "../pages/class/PaymentPage";
import PaymentDetailPage from "../pages/class/PaymentDetailPage";

import ReviewAddPage from "../pages/class/ReviewAddPage";

const classRouter = (
    <>

        {/* 클래스 */}
        <Route path="class" element={<ClassListPage />} />
        <Route path="class/list" element={<ClassListPage />} />
        <Route path="class/:clsNo" element={<ClassDetailPage />} />

        {/* 회원용 클래스 기능 */}
        <Route element={<Access roles={["USER", "INS"]} />}>

            <Route
                path="reservation"
                element={<ReservationPage />}
            />

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

            <Route
                path="payment/detail/:payNo"
                element={<PaymentDetailPage />}
            />

            <Route
                path="payment/:payNo/success"
                element={<PaymentDetailPage complete />}
            />

            <Route
                path="payment/:rsvNo"
                element={<PaymentPage />}
            />

        </Route>

    </>
);

export default classRouter;