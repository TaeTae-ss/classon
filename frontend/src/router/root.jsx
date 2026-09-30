import { createBrowserRouter } from "react-router";

import noticeRouter from "./noticeRouter.jsx";
import inquiryRouter from "./inquiryRouter.jsx";

const root = createBrowserRouter([
    {
        path: "/notice",
        HydrateFallback: () => <div>Loading...</div>,
        lazy: async () => {
            const { default: Component } = await import(
                "../pages/notice/IndexPage.jsx"
            );
            return { Component };
        },
        children: noticeRouter(),
    },

    {
        path: "/inquiry",
        HydrateFallback: () => <div>Loading...</div>,
        lazy: async () => {
            const { default: Component } = await import(
                "../pages/inquiry/IndexPage.jsx"
            );
            return { Component };
        },
        children: inquiryRouter(),
    },
]);

export default root;