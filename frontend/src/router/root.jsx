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
        children: noticeRouter(),
    },
    {
        path: "/inquiry",
        children: inquiryRouter(),
    },
]);

export default root;