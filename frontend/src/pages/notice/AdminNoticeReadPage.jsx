import { useNavigate, useParams } from "react-router";
import AdminNoticeReadComponent from "../../components/notice/AdminNoticeReadComponent";

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