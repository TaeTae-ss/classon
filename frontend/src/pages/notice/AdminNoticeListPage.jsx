import AdminNoticeListComponent from "../../components/notice/AdminNoticeListComponent";

const AdminNoticeListPage = ({
    onRegister,
    onRead,
    onModify,
}) => {

    return (
        <AdminNoticeListComponent
            onRegister={onRegister}
            onRead={onRead}
            onModify={onModify}/>
    );
};

export default AdminNoticeListPage;