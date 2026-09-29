import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { deleteNotice, getNoticeList } from "../../api/noticeApi";


const AdminNoticeListComponent = () => {

    const navigate = useNavigate();

    const [notices, setNotices] = useState([]);

    const [pageData, setPageData] = useState({
        pageNumberList: [],
        currentPage: 1,
        prev: false,
        next: false,
    });

    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");


    // 공지사항 목록 조회
    const loadNotices = () => {

        getNoticeList({
            page,
            size: 10,
            keyword: searchKeyword,
        })
            .then((data) => {

                setNotices(data.dtoList ?? []);
                setPageData(data);

            })
            .catch((error) => {

                console.error(
                    "관리자 공지사항 조회 실패:",
                    error
                );

            });
    };


    useEffect(() => {

        loadNotices();

    }, [page, searchKeyword]);


    // 검색
    const handleSearch = (e) => {

        e.preventDefault();

        setPage(1);
        setSearchKeyword(keyword.trim());
    };


    // 삭제
    const handleDelete = async (notNo) => {

        const confirmed = window.confirm(
            "공지사항을 삭제하시겠습니까?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteNotice(notNo);

            alert("공지사항이 삭제되었습니다.");

            // 삭제 후 현재 목록 다시 조회
            loadNotices();

        } catch (error) {

            console.error(
                "공지사항 삭제 실패:",
                error
            );

            alert("공지사항 삭제에 실패했습니다.");
        }
    };


    // 날짜 형식
    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString(
            "ko-KR",
            {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }
        );
    };


    return (
        <section className="notice-container">

            <div className="admin-notice-title-row">

                <h1 className="notice-title">
                    공지사항 관리
                </h1>

                <button
                    type="button"
                    className="notice-submit-button"
                    onClick={() =>
                        navigate("/notice/admin/register")}>
                    공지 등록
                </button>
            </div>


            {/* 검색 */}
            <form
                className="notice-search"
                onSubmit={handleSearch}>

                <input
                    type="text"
                    className="notice-search-input"
                    value={keyword}
                    onChange={(e) =>
                        setKeyword(e.target.value)}
                    placeholder="제목 또는 내용을 검색하세요."/>

                <button
                    type="submit"
                    className="notice-search-button">
                    검색
                </button>

            </form>


            {/* 목록 */}
            <table className="notice-table">

                <thead>
                    <tr>

                        <th className="notice-number">
                            번호
                        </th>

                        <th>
                            제목
                        </th>

                        <th className="notice-date">
                            작성일
                        </th>

                        <th className="admin-notice-manage">
                            관리
                        </th>

                    </tr>
                </thead>


                <tbody>

                    {notices.length === 0 ? (

                        <tr>
                            <td
                                colSpan="4"
                                className="notice-empty">
                                등록된 공지사항이 없습니다.
                            </td>
                        </tr>

                    ) : (

                        notices.map((notice) => (

                            <tr key={notice.notNo}>

                                <td>
                                    {notice.notNo}
                                </td>


                                <td className="notice-title-cell">
                                    <button
                                        type="button"
                                        className="notice-title-button"
                                        onClick={() =>
                                            navigate(
                                                `/notice/admin/read/${notice.notNo}`)}>
                                        {notice.notTitle}
                                    </button>
                                </td>


                                <td>
                                    {formatDate(
                                        notice.notCreatedAt)}
                                </td>


                                <td>
                                    <div className="admin-notice-actions">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/notice/admin/read/${notice.notNo}`)}>
                                            상세
                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/notice/admin/modify/${notice.notNo}`)}>
                                            수정
                                        </button>


                                        <button
                                            type="button"
                                            className="delete"
                                            onClick={() =>
                                                handleDelete(
                                                    notice.notNo)}>
                                            삭제
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>


            {/* 페이지네이션 */}
            <div className="notice-pagination">

                {pageData.prev && (

                    <button
                        type="button"
                        className="notice-page-button"
                        onClick={() =>
                            setPage(pageData.prevPage)}>‹
                    </button>
                )}

                {pageData.pageNumberList?.map(
                    (pageNumber) => (

                        <button
                            type="button"
                            key={pageNumber}
                            className={
                                `notice-page-button ${
                                    pageNumber ===
                                    pageData.currentPage
                                        ? "active"
                                        : ""}`}
                            onClick={() =>
                                setPage(pageNumber)}>
                            {pageNumber}
                        </button>
                    )
                )}

                {pageData.next && (

                    <button
                        type="button"
                        className="notice-page-button"
                        onClick={() =>
                            setPage(pageData.nextPage)}>›
                    </button>
                )}
            </div>
        </section>
    );
};

export default AdminNoticeListComponent;