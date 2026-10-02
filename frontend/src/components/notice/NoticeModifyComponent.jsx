import { useEffect, useState } from "react";

import {
    getNotice,
    putNotice,
} from "../../api/noticeApi";

const NoticeModifyComponent = ({
    notNo,
    onCancel,
    onSuccess,
}) => {

    const [notice, setNotice] = useState({
        notTitle: "",
        notContent: "",
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);


    useEffect(() => {

           if (!notNo) {
            setLoading(false);
            return;
        }

        getNotice(notNo)
            .then((data) => {

                setNotice({
                    notTitle: data.notTitle ?? "",
                    notContent: data.notContent ?? "",
                });

            })
            .catch((error) => {

                console.error(
                    "공지사항 조회 실패:",
                    error
                );

                alert("공지사항을 불러오지 못했습니다.");
                
                onCancel?.();

            })
            .finally(() => {

                setLoading(false);

            });

    }, [notNo]);


    // 입력값 변경
    const handleChange = (e) => {

        const { name, value } = e.target;

        setNotice((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // 수정 처리
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

        if (!window.confirm("공지사항을 수정하시겠습니까?")) {
            return;
        }

        try {

            setSubmitting(true);

            await putNotice(notNo,
                {
                    notTitle: notice.notTitle.trim(),
                    notContent: notice.notContent.trim(),
                }
            );

            alert("공지사항이 수정되었습니다.");

            onSuccess?.();

        } catch (error) {

            console.error("공지사항 수정 실패:", 
                error
            );

            alert("공지사항 수정에 실패했습니다.");

        } finally {

            setSubmitting(false);

        }
    };


    if (loading) {

        return (
            <div className="notice-message">
                공지사항을 불러오는 중입니다.
            </div>
        );

    }


    return (
        <section className="notice-container">

            <h1 className="notice-title">
                공지사항 수정
            </h1>


            <form
                className="notice-form"
                onSubmit={handleSubmit}>

                {/* 제목 */}

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
                        maxLength={200}
                        placeholder="공지사항 제목을 입력하세요."/>
                </div>


                {/* 내용 */}

                <div className="notice-form-group">

                    <label htmlFor="notContent">
                        내용
                    </label>

                    <textarea
                        id="notContent"
                        name="notContent"
                        value={notice.notContent}
                        onChange={handleChange}
                        rows={12}
                        placeholder="공지사항 내용을 입력하세요."/>
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
                            ? "수정 중..."
                            : "수정"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default NoticeModifyComponent;