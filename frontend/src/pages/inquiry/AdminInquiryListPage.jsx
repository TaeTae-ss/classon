import { useNavigate } from "react-router";
import AdminInquiryListComponent from "../../components/inquiry/AdminInquiryListComponent";
import "../../css/common.css";
import "../../css/inquiry/inquiry.css";

const AdminInquiryListPage = () => {

    const navigate = useNavigate();

    return (
        <AdminInquiryListComponent
            onRead={(repNo) =>
                navigate(`/inquiry/admin/read/${repNo}`)
            }
        />
    );
};

export default AdminInquiryListPage;