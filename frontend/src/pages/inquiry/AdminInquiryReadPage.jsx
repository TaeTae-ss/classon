import { useNavigate, useParams } from "react-router";
import AdminInquiryReadComponent from "../../components/inquiry/AdminInquiryReadComponent";

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