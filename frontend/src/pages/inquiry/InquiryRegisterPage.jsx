import { useNavigate } from "react-router";
import InquiryRegisterComponent from "../../components/inquiry/InquiryRegisterComponent";

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