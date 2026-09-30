import { Navigate } from "react-router";

const inquiryRouter = () => {
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
                    "../pages/inquiry/InquiryListPage.jsx"
                );
                return { Component };
            },
        },
        {
            path: "register",
            HydrateFallback: () => <div>Loading...</div>,
            lazy: async () => {
                const { default: Component } = await import(
                    "../pages/inquiry/InquiryRegisterPage.jsx"
                );
                return { Component };
            },
        },
        {
            path: "read/:repNo",
            HydrateFallback: () => <div>Loading...</div>,
            lazy: async () => {
                const { default: Component } = await import(
                    "../pages/inquiry/InquiryReadPage.jsx"
                );
                return { Component };
            },
        },
        {
            path: "admin",
            HydrateFallback: () => <div>Loading...</div>,
            lazy: async () => {
                const { default: Component } = await import(
                    "../pages/inquiry/AdminInquiryListPage.jsx"
                );
                return { Component };
            },
        },
        {
            path: "admin/read/:repNo",
            HydrateFallback: () => <div>Loading...</div>,
            lazy: async () => {
                const { default: Component } = await import(
                    "../pages/inquiry/AdminInquiryReadPage.jsx"
                );
                return { Component };
            },
        },
    ];
};

export default inquiryRouter;