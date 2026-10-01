import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import store from "./store.js";
import "@flaticon/flaticon-uicons/css/all/all.css"; //돋보기 아이콘

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>
);