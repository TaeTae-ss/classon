import NoticeModifyComponent
    from "../../components/notice/NoticeModifyComponent";

const NoticeModifyPage = ({
    notNo,
    onCancel,
    onSuccess,
}) => {

    return (
        <NoticeModifyComponent
            notNo={notNo}
            onCancel={onCancel}
            onSuccess={onSuccess}/>
    );
};

export default NoticeModifyPage;