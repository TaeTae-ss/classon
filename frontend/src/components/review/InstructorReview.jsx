import { useEffect, useState } from "react";
import { getClassReviews } from "../../api/reviewApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../common/Pagination";

export default function InstructorReview() {
  const [openClsNo, setOpenClsNo] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // API 연결 전 임시 데이터
  const myClasses = [
    { clsNo: 1, clsName: "도자기 클래스" },
    { clsNo: 2, clsName: "베이킹 클래스" },
  ];

  const handleToggle = (clsNo) => {
    setOpenClsNo((prev) => (prev === clsNo ? null : clsNo));
  };

  useEffect(() => {
  if (openClsNo === null) {
    setReviews([]);
    return;
  }

  setLoading(true);
  setReviews([]);

  getClassReviews(openClsNo, "latest")
    .then((data) => {
      setReviews(data);
    })
    .catch((error) => {
      console.error("강사 클래스 후기 조회 실패:", error);
      setReviews([]);
    })
    .finally(() => {
      setLoading(false);
    });
}, [openClsNo]);

const pagination = usePagination(
    reviews.map((review) => ({
        ...review,
        id: review.revNo,
    })),
    5
    );

  return (
    <div className="space-y-3">
      {myClasses.map((item) => (
        <div key={item.clsNo} className="rounded-xl border border-[#ebe6e0] overflow-hidden">
          <button
            type="button"
            onClick={() => handleToggle(item.clsNo)}
            className={`w-full flex justify-between items-center p-4 text-left transition-colors
                ${
                openClsNo === item.clsNo
                    ? "bg-[#FFF0E1]"
                    : "bg-white hover:bg-[#FFF8F1]"
                }
            `}
            >
            <span className="font-medium text-[#172033]">
                {item.clsName}
            </span>

            <svg
                className={`w-5 h-5 text-[#85888d] transition-transform duration-200 ${
                    openClsNo === item.clsNo ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6 9 6 6 6-6"
            />
            </svg>
          </button>

          {openClsNo === item.clsNo && (
            <div className="border-t border-[#ebe6e0] bg-white p-4">
                {loading ? (
                <p>후기를 불러오는 중입니다.</p>
                ) : reviews.length === 0 ? (
                <p>등록된 후기가 없습니다.</p>
                ) : (
                <>
                    {pagination.items.map((review) => (
                        <div key={review.revNo} className="border-b py-3">
                        <p>
                            {"★".repeat(review.revRating)}
                            {"☆".repeat(5 - review.revRating)}
                        </p>

                        <p>
                            {review.revStatus === "Y"
                            ? "관리자에 의해 블라인드된 후기입니다."
                            : review.revContent}
                        </p>

                        <p className="text-sm text-gray-500">
                            {review.revCreatedAt?.replace("T", " ").slice(0, 16)}
                        </p>
                        </div>
                    ))}
                    <Pagination {...pagination} />
                </>

                )}
            </div>
            )}
        </div>
      ))}
    </div>
  );
}
