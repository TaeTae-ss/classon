import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import "./index.css";
import root from "./router/root.jsx";

createRoot(document.getElementById("root")).render(
    <RouterProvider router={root} />
);