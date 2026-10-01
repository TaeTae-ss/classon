import { useEffect, useState } from "react";
import { getNotice, deleteNotice } from "../../api/noticeApi";


const AdminNoticeReadComponent = ({
    notNo,
    onList,
    onModify,
    onDeleted,
}) => {

    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);


    // 공지 상세 조회
    useEffect(() => {

    if (!notNo) {
        setLoading(false);
        return;
    }

    setLoading(true);

    getNotice(notNo)
        .then((data) => {

            setNotice(data);

        })
        .catch((error) => {

            console.error(
                "관리자 공지사항 상세 조회 실패:",
                error
            );

            alert("공지사항을 불러오지 못했습니다.");

            onList?.();

        })
        .finally(() => {

            setLoading(false);

        });

}, [notNo]);


    // 날짜 표시
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


    // 삭제
    const handleDelete = async () => {

        const result = window.confirm(
            "정말 이 공지사항을 삭제하시겠습니까?"
        );

        if (!result) {
            return;
        }

        try {

            setDeleting(true);

            await deleteNotice(notNo);

            alert("공지사항이 삭제되었습니다.");

            onDeleted?.();

        } catch (error) {

            console.error(
                "공지사항 삭제 실패:",
                error
            );

            alert("공지사항 삭제에 실패했습니다.");

        } finally {

            setDeleting(false);

        }
    };


    if (loading) {

        return (
            <div className="notice-message">
                공지사항을 불러오는 중입니다.
            </div>
        );
    }


    if (!notice) {

        return (
            <div className="notice-message">
                공지사항을 찾을 수 없습니다.
            </div>
        );
    }


    return (
        <section className="notice-container">

            <h1 className="notice-title">
                공지사항 상세
            </h1>


            <div className="notice-read">

                {/* 제목 */}

                <div className="notice-read-title">
                    {notice.notTitle}
                </div>


                {/* 작성일 */}

                <div className="notice-read-info">

                    <span className="notice-read-date-label">
                        작성일 :
                    </span>

                    <span>
                        {formatDate(
                            notice.notCreatedAt
                        )}
                    </span>

                </div>


                {/* 내용 */}

                <div className="notice-read-content">
                    {notice.notContent}
                </div>

            </div>
            
            <div className="admin-notice-read-buttons">
                
                <button type="button"
                className="admin-list-button"
                onClick={onList}>
                    목록
                </button>
                
                <button type="button" 
                className="admin-modify-button"
                onClick={onModify}>
                    수정
                </button>
                
                <button type="button" 
                className="admin-delete-button" 
                onClick={handleDelete} 
                disabled={deleting}>
                    {deleting ? "삭제 중..." : "삭제"}
                </button>
                
                </div>
        </section>
    );
};

export default AdminNoticeReadComponent;