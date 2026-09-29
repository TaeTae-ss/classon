import AdminNoticeReadComponent from "../../components/notice/AdminNoticeReadComponent";

const AdminNoticeReadPage = ({
    notNo,
    onList,
    onModify,
    onDeleted,
}) => {

    return (
        <AdminNoticeReadComponent
            notNo={notNo}
            onList={onList}
            onModify={onModify}
            onDeleted={onDeleted}/>
    );
};

export default AdminNoticeReadPage;