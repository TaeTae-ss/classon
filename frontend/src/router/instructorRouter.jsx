import { Route } from "react-router";
import { Access } from "../layouts/Layout";

import MyPage from "../pages/member/MyPage";

import InstructorDashboard from "../pages/instructor/InstructorDashboard";
import InstructorClassPage from "../pages/instructor/InstructorClassPage";
import InstructorClassForm from "../pages/instructor/InstructorClassForm";
import SchedulePage from "../pages/instructor/SchedulePage";

import ReservationListPage from "../pages/class/ReservationListPage";
import ReviewListPage from "../pages/class/ReviewListPage";

const instructorRouter = (
    <Route element={<Access roles={["INS", "INSTRUCTOR"]} />}>

        <Route
            path="instructor/mypage"
            element={<MyPage instructor />}
        />

        <Route
            path="instructor/mypage/edit"
            element={<MyPage instructor edit />}
        />

        <Route
            path="instructor/reservations/schedule/:schNo"
            element={<ReservationListPage instructor schedule />}
        />

        <Route
            path="instructor/reservations"
            element={<ReservationListPage instructor />}
        />

        <Route
            path="instructor"
            element={<InstructorDashboard />}
        />

        <Route
            path="instructor/classes"
            element={<InstructorClassPage />}
        />

        <Route
            path="instructor/classes/register"
            element={<InstructorClassForm />}
        />

        <Route
            path="instructor/classes/:clsNo/edit"
            element={<InstructorClassForm edit />}
        />

        <Route
            path="instructor/schedules"
            element={<SchedulePage />}
        />

        <Route
            path="instructor/reviews"
            element={<ReviewListPage instructor />}
        />

    </Route>
);

export default instructorRouter;