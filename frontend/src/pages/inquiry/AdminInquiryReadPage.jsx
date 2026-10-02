import { useNavigate, useParams } from "react-router";
import AdminInquiryReadComponent from "../../components/inquiry/AdminInquiryReadComponent";
import "../../css/common.css";
import "../../css/inquiry/inquiry.css";

const AdminInquiryReadPage = () => {

    const navigate = useNavigate();
    const { repNo } = useParams();

    return (
        <AdminInquiryReadComponent
            repNo={repNo}
            onList={() =>
                navigate("/inquiry/admin")
            }
        />
    );
};

export default AdminInquiryReadPage;