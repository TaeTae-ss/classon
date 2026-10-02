import { useNavigate, useParams } from "react-router";
import InquiryReadComponent from "../../components/inquiry/InquiryReadComponent";
import "../../css/common.css";
import "../../css/inquiry/inquiry.css";

const InquiryReadPage = () => {

    const navigate = useNavigate();
    const { repNo } = useParams();

    return (
        <InquiryReadComponent
            repNo={repNo}
            onList={() =>
                navigate("/inquiry/list")}/>
    );
};

export default InquiryReadPage;