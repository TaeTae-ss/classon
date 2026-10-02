import { useState } from "react";
import Rating from "@mui/material/Rating";

const ClassReadComponent = () => {

   const schedules = [
    {
        id: 1,
        label: "10월 5일(월) 14:00 ~ 16:00",
        remainingSeats: 8,
    },
    {
        id: 2,
        label: "10월 7일(수) 19:00 ~ 21:00",
        remainingSeats: 5,
    },
    {
        id: 3,
        label: "10월 10일(토) 13:00 ~ 15:00",
        remainingSeats: 2,
    },
];

const [scheduleId, setScheduleId] = useState(1);
const [people, setPeople] = useState(1);

const selectedSchedule =
    schedules.find(
        (schedule) => schedule.id === Number(scheduleId)
    ) || schedules[0];

const totalPrice = classData.price * people;

    // 퍼블리싱용 임시 데이터
    // 나중에 API 데이터로 교체
    const classData = {
        classNo: 1,
        title: "React로 시작하는 웹 개발",
        instructor: "김강사",
        rating: 4.5,
        reviewCount: 28,
        category: "개발",
        difficulty: "초급",
        price: 50000,
        description:
            "React의 기본 개념부터 컴포넌트, 상태 관리까지 차근차근 배우는 클래스입니다.",
    };

    return (
        <div className="min-h-screen bg-[#FFFDF9]">
            <div className="mx-auto max-w-6xl px-6 py-12">

                {/* 상단 */}
                <div className="grid gap-10 lg:grid-cols-2">

                    {/* 클래스 이미지 */}
                    <div
                        className="
                            flex min-h-[360px]
                            items-center justify-center
                            overflow-hidden
                            rounded-2xl
                            bg-[#FFEDD5]
                            text-[#F97316]
                        "
                    >
                        클래스 이미지
                    </div>

                    {/* 클래스 정보 */}
                    <div className="flex flex-col justify-center">

                        <div className="mb-4 flex gap-2">
                            <span
                                className="
                                    rounded-full
                                    bg-[#FFEDD5]
                                    px-4 py-2
                                    text-sm font-semibold
                                    text-[#F97316]
                                "
                            >
                                {classData.category}
                            </span>

                            <span
                                className="
                                    rounded-full
                                    bg-gray-100
                                    px-4 py-2
                                    text-sm font-semibold
                                    text-[#6B7280]
                                "
                            >
                                {classData.difficulty}
                            </span>
                        </div>

                        <h1 className="mb-4 text-3xl font-bold text-[#1F2937]">
                            {classData.title}
                        </h1>

                        <p className="mb-4 text-[#6B7280]">
                            강사 {classData.instructor}
                        </p>

                        {/* 별점 */}
                        <div className="mb-7 flex items-center gap-3">
                            <Rating
                                value={classData.rating}
                                precision={0.5}
                                readOnly
                            />

                            <strong className="text-[#F97316]">
                                {classData.rating}
                            </strong>

                            <span className="text-sm text-[#6B7280]">
                                리뷰 {classData.reviewCount}개
                            </span>
                        </div>

                        <div className="mb-7 border-y border-gray-200 py-5">
                            <div className="flex items-center justify-between">
                                <span className="text-[#6B7280]">
                                    수강료
                                </span>

                                <strong className="text-2xl text-[#1F2937]">
                                    {classData.price.toLocaleString()}원
                                </strong>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="
                                w-full
                                rounded-xl
                                bg-[#F97316]
                                py-4
                                text-lg font-bold
                                text-white
                                transition
                                hover:bg-orange-600
                            "
                        >
                            예약하기
                        </button>
                    </div>
                </div>

                {/* 클래스 소개 */}
                <section
                    className="
                        mt-12
                        rounded-2xl
                        border border-orange-100
                        bg-white
                        p-8
                        shadow-sm
                    "
                >
                    <h2 className="mb-5 text-2xl font-bold text-[#1F2937]">
                        클래스 소개
                    </h2>

                    <p className="leading-8 text-[#6B7280]">
                        {classData.description}
                    </p>
                </section>

                {/* 강사 정보 */}
                <section
                    className="
                        mt-6
                        rounded-2xl
                        border border-orange-100
                        bg-white
                        p-8
                        shadow-sm
                    "
                >
                    <h2 className="mb-5 text-2xl font-bold text-[#1F2937]">
                        강사 정보
                    </h2>

                    <div className="flex items-center gap-5">
                        <div
                            className="
                                flex h-16 w-16
                                items-center justify-center
                                rounded-full
                                bg-[#FFEDD5]
                                font-bold
                                text-[#F97316]
                            "
                        >
                            강사
                        </div>

                        <div>
                            <p className="font-bold text-[#1F2937]">
                                {classData.instructor}
                            </p>

                            <p className="mt-1 text-sm text-[#6B7280]">
                                클래스 전문 강사
                            </p>
                        </div>
                    </div>
                </section>

                {/* 후기 */}
                <section
                    className="
                        mt-6
                        rounded-2xl
                        border border-orange-100
                        bg-white
                        p-8
                        shadow-sm
                    "
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-[#1F2937]">
                            수강 후기
                        </h2>

                        <button
                            type="button"
                            className="
                                rounded-xl
                                border border-[#F97316]
                                px-5 py-2
                                font-semibold
                                text-[#F97316]
                                hover:bg-[#FFEDD5]
                            "
                        >
                            후기 전체보기
                        </button>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-6">
                        <div className="flex items-center gap-3">
                            <Rating
                                value={5}
                                readOnly
                                size="small"
                            />

                            <span className="text-sm text-[#6B7280]">
                                수강생
                            </span>
                        </div>

                        <p className="mt-3 text-[#1F2937]">
                            초보자도 이해하기 쉽게 설명해주셔서 좋았습니다.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default ClassReadComponent;