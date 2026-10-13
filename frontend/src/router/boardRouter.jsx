import { Route } from "react-router";
import InquiryAccess from "../layouts/InquiryAccess";
import BoardListPage from "../pages/board/BoardListPage";
import BoardReadPage from "../pages/board/BoardReadPage";
import BoardFormPage from "../pages/board/BoardFormPage";

const boardRouter = (
    <>
        {/* 공지사항 - 비로그인 접근 허용 */}
        <Route path="notice" element={<BoardListPage />} />
        <Route path="notice/list" element={<BoardListPage />} />

        <Route
            path="notice/read/:notNo"
            element={<BoardReadPage />}
        />

        <Route
            path="notice/:notNo"
            element={<BoardReadPage />}
        />

        {/* 문의 - 로그인한 회원만 접근 가능 */}
        <Route element={<InquiryAccess />}>
            <Route
                path="inquiry"
                element={<BoardListPage inquiry />}
            />

            <Route
                path="inquiry/list"
                element={<BoardListPage inquiry />}
            />

            <Route
                path="inquiry/register"
                element={<BoardFormPage inquiry />}
            />

            <Route
                path="reports/register"
                element={<BoardFormPage inquiry />}
            />

            <Route
                path="inquiry/read/:inqNo"
                element={<BoardReadPage inquiry />}
            />

            <Route
                path="reports/:repNo"
                element={<BoardReadPage inquiry />}
            />
        </Route>
    </>
);

export default boardRouter;