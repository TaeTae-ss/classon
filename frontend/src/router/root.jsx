import { createBrowserRouter } from "react-router";
import authRouter from "./authRouter.jsx";
import noticeRouter from "./noticeRouter.jsx";
import inquiryRouter from "./inquiryRouter.jsx";

const root = createBrowserRouter([
    {
        path: "/",
        HydrateFallback: () => <div>Loading...</div>,
        lazy: async () => {
            const { default: Component } = await import("../pages/main/MainPage");
            return { Component };
        },
    },
    {
        path: "/auth",
        HydrateFallback: () => <div>Loading...</div>,
        children: authRouter(),
    },

    {
        path: "/notice",
        HydrateFallback: () => <div>Loading...</div>,
        lazy: async () => {
            const { default: Component } = await import("../pages/notice/IndexPage");
            return { Component };
        },
        children: noticeRouter(),
    },

    {
        path: "/inquiry",
        HydrateFallback: () => <div>Loading...</div>,
        lazy: async () => {
            const { default: Component } = await import("../pages/inquiry/IndexPage");
            return { Component };
        },
        children: inquiryRouter(),
    },
]);

export default root;