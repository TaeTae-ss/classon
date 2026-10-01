import { useNavigate, useParams } from "react-router";
import NoticeModifyComponent from "../../components/notice/NoticeModifyComponent";
import "../../css/common.css";
import "../../css/notice/notice.css";

const NoticeModifyPage = () => {

    const { notNo } = useParams();
    const navigate = useNavigate();

    return (
        <NoticeModifyComponent
            notNo={Number(notNo)}
            onCancel={() =>
                navigate(
                    `/notice/admin/read/${notNo}`
                )
            }
            onSuccess={() =>
                navigate(
                    `/notice/admin/read/${notNo}`
                )
            }/>
    );
};

export default NoticeModifyPage;