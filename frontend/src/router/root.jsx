import { createBrowserRouter } from "react-router";
import authRouter from "./authRouter.jsx";
import noticeRouter from "./noticeRouter.jsx";

const root = createBrowserRouter([
    {
        path: "/auth",
        HydrateFallback: () => <div>Loading...</div>,
        children: authRouter(),
    },

    /*<{
        path: "/notice",
        HydrateFallback: () => <div>Loading...</div>,
        lazy: async () => {
            const { default: Component } = await import(
                "../pages/notice/IndexPage.jsx"
            );
            return { Component };
        },
        children: noticeRouter(),
    },>*/
]);

export default root;