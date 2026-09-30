import { Outlet } from "react-router";
import "../../css/common.css";
import "../../css/inquiry.css";

const IndexPage = () => {
    return (
        <div className="inquiry-area">
            <Outlet />
        </div>
    );
};

export default IndexPage;