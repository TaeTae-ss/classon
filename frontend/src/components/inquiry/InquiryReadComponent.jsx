import { useEffect, useState } from "react";
import { getInquiry } from "../../api/inquiryApi";

const InquiryReadComponent = ({
    repNo,
    onList,
}) => {

    const [inquiry, setInquiry] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!repNo) {
            return;
        }

        const fetchInquiry = async () => {

            try {
                setLoading(true);

                const data = await getInquiry(repNo);

                setInquiry(data);

            } catch (error) {
                console.error("문의 상세 조회 오류:", error);
                setInquiry(null);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiry();

    }, [repNo]);

    if (loading) {
        return (
            <div className="inquiry-area">
                <div className="inquiry-empty">
                    문의 내용을 불러오는 중입니다.
                </div>
            </div>
        );
    }

    if (!inquiry) {
        return (
            <div className="inquiry-area">
                <div className="inquiry-empty">
                    문의 정보를 찾을 수 없습니다.
                </div>

                <div className="inquiry-read-buttons">
                    <button onClick={onList}>
                        목록
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="inquiry-area">

            <h2 className="inquiry-title">
                문의 상세
            </h2>

            <div className="inquiry-read-box">

                <div className="inquiry-read-row">
                    <div className="inquiry-read-label">
                        문의 제목
                    </div>

                    <div className="inquiry-read-value">
                        {inquiry.inqTitle}
                    </div>
                </div>

                <div className="inquiry-read-row">
                    <div className="inquiry-read-label">
                        처리 상태
                    </div>

                    <div className="inquiry-read-value">
                        <span
                            className={`status-badge ${
                                inquiry.inqStatus === "완료"
                                    ? "complete"
                                    : inquiry.inqStatus === "처리중"
                                    ? "processing"
                                    : "received"}`}>
                            {inquiry.inqStatus}
                        </span>
                    </div>
                </div>

                <div className="inquiry-read-row">
                    <div className="inquiry-read-label">
                        작성일
                    </div>

                    <div className="inquiry-read-value">
                        {inquiry.inqCreatedAt
                            ? new Date(
                                inquiry.inqCreatedAt
                            ).toLocaleString("ko-KR")
                            : "-"}
                    </div>
                </div>

                <div className="inquiry-read-row content">
                    <div className="inquiry-read-label">
                        문의 내용
                    </div>

                    <div className="inquiry-read-value inquiry-read-content">
                        {inquiry.inqContent}
                    </div>
                </div>

            </div>

            <div className="inquiry-answer-box">

                <h3>관리자 답변</h3>

                <div className="inquiry-answer-content">
                    {inquiry.admComment
                        ? inquiry.admComment
                        : "아직 등록된 답변이 없습니다."}
                </div>

                {inquiry.proCreatedAt && (
                    <div className="inquiry-answer-date">
                        답변일&nbsp;
                        {new Date(
                            inquiry.proCreatedAt
                        ).toLocaleString("ko-KR")}
                    </div>
                )}

            </div>

            <div className="inquiry-read-buttons">
                <button
                    type="button"
                    onClick={onList}>
                    목록
                </button>
            </div>

        </div>
    );
};

export default InquiryReadComponent;