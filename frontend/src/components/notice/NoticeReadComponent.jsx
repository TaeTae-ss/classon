import { useEffect, useState } from "react";
import { getNotice } from "../../api/noticeApi";


const NoticeReadComponent = ({
    notNo,
    onList,
}) => {

    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    useEffect(() => {

        if (!notNo) {
            setError(true);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(false);

        getNotice(notNo)
            .then((data) => {

                setNotice(data);

            })
            .catch((error) => {

                console.error(
                    "공지사항 상세 조회 실패:",
                    error
                );

                setError(true);

            })
            .finally(() => {

                setLoading(false);

            });

    }, [notNo]);


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


    if (loading) {

        return (
            <div className="notice-message">
                공지사항을 불러오는 중입니다.
            </div>
        );
    }


    if (error || !notice) {

        return (
            <section className="notice-container">

                <div className="notice-message">
                    공지사항을 불러오지 못했습니다.
                </div>

                <div className="notice-form-buttons">

                    <button
                        type="button"
                        className="notice-cancel-button"
                        onClick={onList}>
                        목록으로
                    </button>

                </div>

            </section>
        );
    }


    return (
        <section className="notice-container">

            <h1 className="notice-title">
                공지사항
            </h1>


            <div className="notice-read">

                <div className="notice-read-title">
                    {notice.notTitle}
                </div>


                <div className="notice-read-info">

                    <span>
                        작성일
                    </span>

                    <span>
                        {formatDate(
                            notice.notCreatedAt
                        )}
                    </span>
                </div>


                <div className="notice-read-content">
                    {notice.notContent}
                </div>
            </div>


            <div className="notice-form-buttons">

                <button
                    type="button"
                    className="notice-cancel-button"
                    onClick={onList}>
                    목록으로
                </button>

            </div>
        </section>
    );
};

export default NoticeReadComponent;