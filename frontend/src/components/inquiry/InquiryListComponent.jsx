import { useEffect, useState } from "react";
import { getMyInquiryList } from "../../api/inquiryApi";

const InquiryListComponent = ({
    inqMemNo = 1,
    onRead,
    onRegister,
}) => {

    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchInquiries = async () => {

            try {
                setLoading(true);

                // TODO: JWT 연동 후 inqMemNo 제거
                const data = await getMyInquiryList(inqMemNo);

                setInquiries(data ?? []);

            } catch (error) {
                console.error("문의 목록 조회 오류:", error);
                setInquiries([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();

    }, [inqMemNo]);

    return (
        <div className="inquiry-area">

            <div className="inquiry-list-header">
                <h2 className="inquiry-title">
                    문의 내역
                </h2>

                <button
                    type="button"
                    className="inquiry-write-btn"
                    onClick={onRegister}>
                    문의하기
                </button>
            </div>

            {loading ? (
                <div className="inquiry-empty">
                    문의 목록을 불러오는 중입니다.
                </div>
            ) : inquiries.length === 0 ? (
                <div className="inquiry-empty">
                    등록된 문의가 없습니다.
                </div>
            ) : (
                <div className="inquiry-table-wrap">

                    <table className="inquiry-table">
                        <thead>
                            <tr>
                                <th className="inquiry-no">
                                    번호
                                </th>

                                <th>
                                    문의 제목
                                </th>

                                <th className="inquiry-status">
                                    처리 상태
                                </th>

                                <th className="inquiry-date">
                                    작성일
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {inquiries.map((inquiry) => (
                                <tr
                                    key={inquiry.inqNo}
                                    onClick={() =>
                                        onRead?.(inquiry.inqNo)}>
                                    <td>
                                        {inquiry.inqNo}
                                    </td>

                                    <td className="inquiry-table-title">
                                        {inquiry.inqTitle}
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

                                    <td>
                                        {inquiry.inqCreatedAt
                                            ? new Date(
                                                inquiry.inqCreatedAt
                                            ).toLocaleDateString("ko-KR")
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InquiryListComponent;