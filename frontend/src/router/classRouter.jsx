import { lazy, Suspense } from "react";

const ClassListPage = lazy(
    () => import("../pages/class/ClassListPage")
);

const ClassReadPage = lazy(
    () => import("../pages/class/ClassReadPage")
);

const Loading = () => (
    <div className="py-20 text-center text-gray-500">
        Loading...
    </div>
);

const classRouter = () => {
    return [
        {
            path: "list",
            element: (
                <Suspense fallback={<Loading />}>
                    <ClassListPage />
                </Suspense>
            ),
        },
        {
            path: ":classNo",
            element: (
                <Suspense fallback={<Loading />}>
                    <ClassReadPage />
                </Suspense>
            ),
        },
    ];
};

export default classRouter;