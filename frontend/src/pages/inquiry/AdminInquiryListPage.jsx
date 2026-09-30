import { useNavigate } from "react-router";
import AdminInquiryListComponent from "../../components/inquiry/AdminInquiryListComponent";

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