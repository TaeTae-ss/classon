import { Route } from "react-router";

import BoardListPage from "../pages/board/BoardListPage";
import BoardReadPage from "../pages/board/BoardReadPage";
import BoardFormPage from "../pages/board/BoardFormPage";

const boardRouter = (
    <>
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

        {/* 문의 */}
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
    </>
);

export default boardRouter;