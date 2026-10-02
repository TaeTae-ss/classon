import { useEffect, useState } from "react";
import {
    getAdminInquiry,
    patchInquiryStatus,
    patchInquiryComment,
} from "../../api/inquiryApi";

const AdminInquiryReadComponent = ({
    repNo,
    onList,
}) => {

    const [inquiry, setInquiry] = useState(null);
    const [status, setStatus] = useState("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);


    const fetchInquiry = async () => {

        if (!repNo) {
            return;
        }

        try {
            setLoading(true);

            const data = await getAdminInquiry(repNo);

            setInquiry(data);
            setStatus(data.inqStatus ?? "접수");
            setComment(data.admComment ?? "");

        } catch (error) {
            console.error(
                "관리자 문의 상세 조회 오류:",
                error
            );

            setInquiry(null);

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchInquiry();
    }, [repNo]);


    const handleStatusSave = async () => {

        try {

            await patchInquiryStatus(
                repNo,
                status
            );

            alert("처리 상태가 변경되었습니다.");

            await fetchInquiry();

        } catch (error) {

            console.error(
                "문의 상태 변경 오류:",
                error
            );

            alert("처리 상태 변경에 실패했습니다.");
        }
    };


    const handleCommentSave = async () => {

        if (!comment.trim()) {
            alert("답변 내용을 입력해주세요.");
            return;
        }

        if (comment.length > 255) {
            alert("답변은 255자 이하로 입력해주세요.");
            return;
        }

        try {

            await patchInquiryComment(
                repNo,
                comment
            );

            alert("답변이 등록되었습니다.");

            await fetchInquiry();

        } catch (error) {

            console.error(
                "문의 답변 등록 오류:",
                error
            );

            alert("답변 등록에 실패했습니다.");
        }
    };


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
                    <button
                        type="button"
                        onClick={onList}>
                        목록
                    </button>
                </div>

            </div>
        );
    }


    return (
        <div className="inquiry-area">

            <h2 className="inquiry-title">
                문의 상세/처리
            </h2>

            <div className="inquiry-read-box">

                <div className="inquiry-read-row">

                    <div className="inquiry-read-label">
                        문의 번호
                    </div>

                    <div className="inquiry-read-value">
                        {inquiry.inqNo}
                    </div>

                    <div className="inquiry-read-row">
                        <div className="inquiry-read-label">
                            작성 회원 번호
                    </div>
                    
                    <div className="inquiry-read-value">
                        {inquiry.inqMemNo}
                    </div>
                </div>
                </div>

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
                        접수 일시
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


            {/* 처리 상태 */}

            <div className="admin-inquiry-process">

                <h3>문의 처리</h3>

                <div className="admin-process-row">

                    <label>
                        처리 상태
                    </label>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)}>
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

                    <button
                        type="button"
                        onClick={handleStatusSave}>
                        상태 변경
                    </button>
                </div>

                <div className="admin-process-row">
                    <label>
                        처리 완료 일시
                    </label>
                    
                <div className="admin-process-date">
                    {inquiry.proCreatedAt
                    ? new Date(inquiry.proCreatedAt)
                    .toLocaleString("ko-KR")
                    : "-"}
                </div>
                </div>

                <div className="admin-comment-area">

                    <label>
                        관리자 답변
                    </label>

                    <textarea
                        value={comment}
                        onChange={(e) =>
                            setComment(e.target.value)}
                        maxLength={255}
                        placeholder="문의에 대한 답변을 입력해주세요."/>

                    <div className="admin-comment-info">
                        {comment.length} / 255
                    </div>
                </div>

                <div className="admin-comment-buttons">

                    <button
                        type="button"
                        onClick={handleCommentSave}>
                        답변 등록
                    </button>
                </div>
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

export default AdminInquiryReadComponent;