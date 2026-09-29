import NoticeReadComponent from "../../components/notice/NoticeReadComponent";

const NoticeReadPage = ({
    notNo,
    onList,
}) => {

    return (
        <NoticeReadComponent
            notNo={notNo}
            onList={onList}
        />
    );
};

export default NoticeReadPage;