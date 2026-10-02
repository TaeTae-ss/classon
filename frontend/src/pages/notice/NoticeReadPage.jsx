import { useNavigate, useParams } from "react-router";
import NoticeReadComponent from "../../components/notice/NoticeReadComponent";
import "../../css/common.css";
import "../../css/notice/notice.css";

const NoticeReadPage = () => {

    const { notNo } = useParams();
    const navigate = useNavigate();

    return (
        <NoticeReadComponent
            notNo={Number(notNo)}
            onList={() =>
                navigate("/notice/list")
            }/>
    );
};

export default NoticeReadPage;