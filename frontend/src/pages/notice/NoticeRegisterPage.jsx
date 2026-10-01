import { useNavigate } from "react-router";
import NoticeRegisterComponent from "../../components/notice/NoticeRegisterComponent";
import "../../css/common.css";
import "../../css/notice/notice.css";

const NoticeRegisterPage = () => {

    const navigate = useNavigate();

    return (
        <NoticeRegisterComponent
            onCancel={() =>
                navigate("/notice/admin")
            }
            onSuccess={() =>
                navigate("/notice/admin")
            }/>
    );
};

export default NoticeRegisterPage;