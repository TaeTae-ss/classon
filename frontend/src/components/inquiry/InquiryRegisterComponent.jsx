import { useState } from "react";
import { postInquiry } from "../../api/inquiryApi";

const InquiryRegisterComponent = ({ onSuccess, onCancel }) => {

    const [inqTitle, setInqTitle] = useState("");
    const [inqContent, setInqContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inqTitle.trim()) {
            alert("문의 제목을 입력해주세요.");
            return;
        }

        if (!inqContent.trim()) {
            alert("문의 내용을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);

            const inquiry = {
                // TODO: JWT 연동 후 제거
                inqMemNo: 1,
                inqTitle,
                inqContent,
            };

            const result = await postInquiry(inquiry);

            alert("문의가 등록되었습니다.");

            if (onSuccess) {
                onSuccess(result.inqNo);
            }

        } catch (error) {
            console.error("문의 등록 오류:", error);
            alert("문의 등록 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inquiry-area">

            <h2 className="inquiry-title">
                문의 작성
            </h2>

            <form
                className="inquiry-register-form"
                onSubmit={handleSubmit}>

                <div className="inquiry-form-row">
                    <label>문의 제목</label>

                    <input
                        type="text"
                        value={inqTitle}
                        onChange={(e) =>
                            setInqTitle(e.target.value)}
                        placeholder="문의 제목"
                        maxLength={100}/>
                </div>

                <div className="inquiry-form-row inquiry-content-row">
                    <label>내용</label>

                    <textarea
                        value={inqContent}
                        onChange={(e) =>
                            setInqContent(e.target.value)}
                        placeholder="문의 내용을 입력하세요."
                        maxLength={255}/>
                </div>

                <div className="inquiry-register-bottom">

                    <div className="inquiry-guide">
                        제목이나 내용에 본인 외에 문의하실
                        대상 및 내용을 잘 작성해주세요.
                    </div>

                    <div className="inquiry-button-group">

                        <button
                            type="button"
                            className="inquiry-cancel-btn"
                            onClick={onCancel}
                            disabled={loading}>
                            취소
                        </button>

                        <button
                            type="submit"
                            className="inquiry-submit-btn"
                            disabled={loading}>
                            {loading ? "등록 중..." : "등록"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default InquiryRegisterComponent;