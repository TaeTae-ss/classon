import { useEffect, useState } from "react";
import { getAdminInquiryList } from "../../api/inquiryApi";

const AdminInquiryListComponent = ({
    onRead,
}) => {

    const [result, setResult] = useState({
        dtoList: [],
        pageNumberList: [],
        prev: false,
        next: false,
        prevPage: 0,
        nextPage: 0,
        totalCount: 0,
        totalPage: 0,
        currentPage: 1,
    });

    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchInquiryList = async () => {

            try {
                setLoading(true);

                const data = await getAdminInquiryList({
                    page,
                    size: 10,
                    keyword: searchKeyword,
                    status,
                });

                setResult(data);

            } catch (error) {
                console.error(
                    "관리자 문의 목록 조회 오류:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInquiryList();

    }, [page, searchKeyword, status]);


    const handleSearch = (e) => {
        e.preventDefault();

        setPage(1);
        setSearchKeyword(keyword.trim());
    };


    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setPage(1);
    };


    return (
        <div className="inquiry-area">

            <h2 className="inquiry-title">
                문의 관리
            </h2>

            <div className="admin-inquiry-search">

                <select
                    value={status}
                    onChange={handleStatusChange}>
                    <option value="">
                        전체
                    </option>

                    <option value="접수">
                        접수
                    </option>

                    <option value="처리중">
                        처리중
                    </option>

                    <option value="완료">
                        완료
                    </option>
                </select>

                <form
                    className="admin-inquiry-search-form"
                    onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)
                        }
                        placeholder="문의 제목 또는 내용을 검색하세요."/>

                    <button type="submit">
                        검색
                    </button>
                </form>
            </div>


            {loading ? (

                <div className="inquiry-empty">
                    문의 목록을 불러오는 중입니다.
                </div>

            ) : result.dtoList.length === 0 ? (

                <div className="inquiry-empty">
                    등록된 문의가 없습니다.
                </div>

            ) : (

                <>
                    <div className="inquiry-table-wrap">

                        <table className="inquiry-table">

                           <thead>
                             <tr>
                                <th className="inquiry-no">
                                    번호
                                </th>
                                
                                <th className="inquiry-member">
                                    회원번호
                                </th>
                                
                                <th>
                                    제목
                                </th>
                                
                                <th className="inquiry-date">
                                    접수 일시
                                </th>
                                
                                <th className="inquiry-status">
                                    처리 상태
                                </th>
                                </tr>
                                </thead>

                            <tbody>

                                {result.dtoList.map((inquiry) => (

                                    <tr
                                        key={inquiry.inqNo}
                                        onClick={() =>
                                            onRead?.(inquiry.inqNo)}>

                                        <td>
                                            {inquiry.inqNo}
                                        </td>
                                        
                                        <td>
                                            {inquiry.inqMemNo}
                                        </td>

                                        <td className="inquiry-table-title">
                                            {inquiry.inqTitle}
                                        </td>

                                                    <td>
                                                        {inquiry.inqCreatedAt
                                                        ? new Date(inquiry.inqCreatedAt).toLocaleDateString("ko-KR")
                                                        : "-"}
                                                    </td>

                                        <td>
                                            <span
                                                className={`status-badge ${
                                                    inquiry.inqStatus === "완료"
                                                        ? "complete"
                                                        : inquiry.inqStatus === "처리중"
                                                        ? "processing"
                                                        : "received"}`}>
                                                {inquiry.inqStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="inquiry-pagination">

                        {result.prev && (
                            <button
                                type="button"
                                onClick={() =>
                                    setPage(result.prevPage)}>
                                &lt;
                            </button>
                        )}

                        {result.pageNumberList.map(
                            (pageNumber) => (

                                <button
                                    type="button"
                                    key={pageNumber}
                                    className={
                                        result.currentPage ===
                                        pageNumber
                                            ? "active"
                                            : ""}
                                    onClick={() =>
                                        setPage(pageNumber)}>
                                    {pageNumber}
                                </button>
                            )
                        )}

                        {result.next && (
                            <button
                                type="button"
                                onClick={() =>
                                    setPage(
                                        result.nextPage)}>
                                &gt;
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminInquiryListComponent;