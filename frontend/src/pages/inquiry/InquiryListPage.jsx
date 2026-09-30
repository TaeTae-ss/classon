import { useNavigate } from "react-router";
import InquiryListComponent from "../../components/inquiry/InquiryListComponent";

const InquiryListPage = () => {

    const navigate = useNavigate();

    return (
        <InquiryListComponent
            inqMemNo={1}

            onRead={(inqNo) =>
                navigate(`/inquiry/read/${inqNo}`)
            }

            onRegister={() =>
                navigate("/inquiry/register")
            }
        />
    );
};

export default InquiryListPage;