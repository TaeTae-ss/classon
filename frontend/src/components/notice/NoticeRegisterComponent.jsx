import { useState } from "react";
import { postNotice } from "../../api/noticeApi";

const NoticeRegisterComponent = ({
    onCancel,
    onSuccess,
}) => {

    const [notice, setNotice] = useState({
        notTitle: "",
        notContent: "",
    });

    const [submitting, setSubmitting] = useState(false);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setNotice((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!notice.notTitle.trim()) {
            alert("공지사항 제목을 입력해주세요.");
            return;
        }

        if (!notice.notContent.trim()) {
            alert("공지사항 내용을 입력해주세요.");
            return;
        }

        try {

            setSubmitting(true);

            await postNotice({
                notTitle: notice.notTitle.trim(),
                notContent: notice.notContent.trim(),
            });

            alert("공지사항이 등록되었습니다.");

            onSuccess?.();

        } catch (error) {

            console.error(
                "공지사항 등록 실패:",
                error
            );

            alert("공지사항 등록에 실패했습니다.");

        } finally {

            setSubmitting(false);

        }
    };


    return (
        <section className="notice-container">

            <h1 className="notice-title">
                공지사항 등록
            </h1>

            <form
                className="notice-form"
                onSubmit={handleSubmit}>

                <div className="notice-form-group">

                    <label htmlFor="notTitle">
                        제목
                    </label>

                    <input
                        id="notTitle"
                        name="notTitle"
                        type="text"
                        value={notice.notTitle}
                        onChange={handleChange}
                        placeholder="공지사항 제목을 입력하세요."
                        maxLength={200}/>

                </div>


                <div className="notice-form-group">

                    <label htmlFor="notContent">
                        내용
                    </label>

                    <textarea
                        id="notContent"
                        name="notContent"
                        value={notice.notContent}
                        onChange={handleChange}
                        placeholder="공지사항 내용을 입력하세요."
                        rows={12}/>
                </div>


                <div className="notice-form-buttons">

                    <button
                        type="button"
                        className="notice-cancel-button"
                        onClick={onCancel}>
                        취소
                    </button>

                    <button
                        type="submit"
                        className="notice-submit-button"
                        disabled={submitting}>
                        {submitting
                            ? "등록 중..."
                            : "등록"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default NoticeRegisterComponent;