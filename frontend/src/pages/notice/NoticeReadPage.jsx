import { useNavigate, useParams } from "react-router";
import NoticeReadComponent from "../../components/notice/NoticeReadComponent";

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