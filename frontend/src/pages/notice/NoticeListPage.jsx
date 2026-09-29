import NoticeListComponent
    from "../../components/notice/NoticeListComponent";

const NoticeListPage = ({ onRead }) => {

    return (
        <div>
            <NoticeListComponent onRead={onRead} />
        </div>
    );
};

export default NoticeListPage;