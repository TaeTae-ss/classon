import { useNavigate } from "react-router";
import InquiryRegisterComponent from "../../components/inquiry/InquiryRegisterComponent";
import "../../css/common.css";
import "../../css/inquiry/inquiry.css";

const InquiryRegisterPage = () => {

    const navigate = useNavigate();

    return (
        <InquiryRegisterComponent
            onSuccess={(inqNo) =>
                navigate(`/inquiry/read/${inqNo}`)
            }
            onCancel={() =>
                navigate("/inquiry/list")
            }
        />
    );
};

export default InquiryRegisterPage;