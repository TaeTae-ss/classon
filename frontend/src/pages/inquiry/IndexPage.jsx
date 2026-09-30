import { Outlet } from "react-router";
import "../../css/common.css";
import "../../css/inquiry/inquiry.css";

const IndexPage = () => {
    return (
        <div className="inquiry-area">
            <Outlet />
        </div>
    );
};

export default IndexPage;