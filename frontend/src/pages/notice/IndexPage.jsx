import { Outlet } from "react-router";
import "../../css/common.css";
import "../../css/notice.css";

const IndexPage = () => {
    return (
        <div className="notice-area">
            <Outlet />
        </div>
    );
};

export default IndexPage;