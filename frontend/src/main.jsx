import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import "./index.css";
import root from "./router/root.jsx";
import store from "./store.js";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={root} />
    </Provider>
);