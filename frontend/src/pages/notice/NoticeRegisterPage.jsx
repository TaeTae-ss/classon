import NoticeRegisterComponent from "../../components/notice/NoticeRegisterComponent";

const NoticeRegisterPage = ({
    onCancel,
    onSuccess,
}) => {

    return (
        <NoticeRegisterComponent
            onCancel={onCancel}
            onSuccess={onSuccess}/>
    );
};

export default NoticeRegisterPage;