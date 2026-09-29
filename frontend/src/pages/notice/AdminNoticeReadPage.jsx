import { useNavigate, useParams } from "react-router";
import AdminNoticeReadComponent from "../../components/notice/AdminNoticeReadComponent";

const AdminNoticeReadPage = () => {

    const { notNo } = useParams();
    const navigate = useNavigate();

    return (
        <AdminNoticeReadComponent
            notNo={Number(notNo)}
            onList={() =>
                navigate("/notice/admin")
            }
            onModify={(noticeNo) =>
                navigate(
                    `/notice/admin/modify/${noticeNo}`
                )}
            onDeleted={() =>
                navigate("/notice/admin")
            }/>
    );
};

export default AdminNoticeReadPage;