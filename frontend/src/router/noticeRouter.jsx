import { Navigate } from "react-router";

const noticeRouter = () => {
    return [
        {
            index: true,
            element: <Navigate to="list" replace />,
        },
        {
            path: "list",
            HydrateFallback: () => <div>Loading...</div>,
            lazy: async () => {
                const { default: Component } = await import(
                    "../pages/notice/NoticeListPage.jsx"
                );
                return { Component };
            },
        },
        {
            path: "read/:notNo",
            HydrateFallback: () => <div>Loading...</div>,
            lazy: async () => {
                const { default: Component } = await import(
                    "../pages/notice/NoticeReadPage.jsx"
                );
                return { Component };
            },
        },
        {
            path: "admin",
            HydrateFallback: () => <div>Loading...</div>,
            lazy: async () => {
                const { default: Component } = await import(
                    "../pages/notice/AdminNoticeListPage.jsx"
                );
                return { Component };
            },
        },
        {
            path: "admin/register",
            HydrateFallback: () => <div>Loading...</div>,
            lazy: async () => {
                const { default: Component } = await import(
                    "../pages/notice/NoticeRegisterPage.jsx"
                );
                return { Component };
            },
        },
        {
            path: "admin/read/:notNo",
            HydrateFallback: () => <div>Loading...</div>,
            lazy: async () => {
                const { default: Component } = await import(
                    "../pages/notice/AdminNoticeReadPage.jsx"
                );
                return { Component };
            },
        },
        {
            path: "admin/modify/:notNo",
            HydrateFallback: () => <div>Loading...</div>,
            lazy: async () => {
                const { default: Component } = await import(
                    "../pages/notice/NoticeModifyPage.jsx"
                );
                return { Component };
            },
        },
    ];
};

export default noticeRouter;