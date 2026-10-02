import { useNavigate, useParams } from "react-router";
import AdminNoticeReadComponent from "../../components/notice/AdminNoticeReadComponent";
import "../../css/common.css";
import "../../css/notice/notice.css";

const AdminNoticeReadPage = () => {

    const { notNo } = useParams();
    const navigate = useNavigate();

    const noticeNo = Number(notNo);

    return (
        <AdminNoticeReadComponent
            notNo={noticeNo}

            onList={() =>
                navigate("/notice/admin")
            }

            onModify={() =>
                navigate(
                    `/notice/admin/modify/${noticeNo}`
                )
            }

            onDeleted={() =>
                navigate("/notice/admin")
            }
        />
    );
};

export default AdminNoticeReadPage;