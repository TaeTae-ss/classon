import { useEffect, useState } from "react";
import { getNoticeList } from "../../api/noticeApi";

const NoticeListComponent = ({ onRead }) => {

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

    useEffect(() => {

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
                    "공지사항 조회 실패:",
                    error
                );

            });

    }, [page, searchKeyword]);


    const handleSearch = (e) => {

        e.preventDefault();

        setPage(1);
        setSearchKeyword(keyword.trim());
    };

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

            <h1 className="notice-title">
                공지사항
            </h1>


            <form
                className="notice-search"
                onSubmit={handleSearch}>

                <input
                    className="notice-search-input"
                    type="text"
                    value={keyword}
                    onChange={(e) =>
                        setKeyword(e.target.value)}
                    placeholder="공지사항 검색"/>

                <button
                    className="notice-search-button" type="submit">
                    검색
                </button>
            </form>

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
                    </tr>
                </thead>


                <tbody>
                    {notices.length === 0 ? (
                        <tr>
                            <td
                                className="notice-empty"
                                colSpan="3">
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
                                       onClick={() => onRead?.(notice.notNo)}>
                                        {notice.notTitle}
                                    </button>
                                </td>

                                <td>
                                    {formatDate(
                                        notice.notCreatedAt
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="notice-pagination">

                {pageData.prev && (
                    <button
                        type="button"
                        className="notice-page-button"
                        onClick={() =>
                            setPage(pageData.prevPage)}>‹
                    </button>)}


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
                        </button>))}

                {pageData.next && (
                    <button
                        type="button"
                        className="notice-page-button"
                        onClick={() =>
                            setPage(pageData.nextPage)}>›
                    </button>)}
            </div>
        </section>
    );
};

export default NoticeListComponent;