import { Route } from "react-router";
import { Access } from "../layouts/Layout";

import MyPage from "../pages/member/MyPage";

import FavoritePage from "../pages/class/FavoritePage";
import FavoriteComparePage from "../pages/class/FavoriteComparePage";
import ReviewListPage from "../pages/class/ReviewListPage";

const memberRouter = (
    <Route element={<Access roles={["USER", "INS"]} />}>

        <Route
            path="member/mypage"
            element={<MyPage />}
        />

        <Route
            path="member/mypage/edit"
            element={<MyPage edit />}
        />

        <Route
            path="member/favorites"
            element={<FavoritePage />}
        />

        <Route
            path="favorites/compare"
            element={<FavoriteComparePage />}
        />

        <Route
            path="member/reviews"
            element={<ReviewListPage />}
        />

    </Route>
);

export default memberRouter;