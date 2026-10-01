import { useNavigate } from "react-router";
import NoticeListComponent from "../../components/notice/NoticeListComponent";
import "../../css/common.css";
import "../../css/notice/notice.css";

const NoticeListPage = () => {

    const navigate = useNavigate();

    const handleRead = (notNo) => {
        navigate(`/notice/read/${notNo}`);
    };

    return (
        <div>
            <NoticeListComponent onRead={handleRead} />
        </div>
    );
};

export default NoticeListPage;