import { useNavigate, useParams } from "react-router";
import InquiryReadComponent from "../../components/inquiry/InquiryReadComponent";

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