import { useState } from "react";
import ClassCard from "./ClassCard";

const ClassListComponent = () => {

    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("전체");

    const categories = [
        "전체",
        "개발",
        "디자인",
        "취미",
        "기타",
    ];

    // 퍼블리싱 확인용 임시 데이터
    // 나중에 API 데이터로 교체
    const classes = [
        {
            id: 1,
            title: "React로 시작하는 웹 개발",
            instructor: "김강사",
            rating: 4.5,
            difficulty: "초급",
            category: "개발",
        },
        {
            id: 2,
            title: "Spring Boot 백엔드 입문",
            instructor: "이강사",
            rating: 4.0,
            difficulty: "중급",
            category: "개발",
        },
        {
            id: 3,
            title: "처음 배우는 UI/UX 디자인",
            instructor: "박강사",
            rating: 4.5,
            difficulty: "초급",
            category: "디자인",
        },
        {
            id: 4,
            title: "나만의 캐릭터 그리기",
            instructor: "최강사",
            rating: 5.0,
            difficulty: "초급",
            category: "취미",
        },
        {
            id: 5,
            title: "Figma 실전 디자인",
            instructor: "정강사",
            rating: 4.5,
            difficulty: "중급",
            category: "디자인",
        },
        {
            id: 6,
            title: "사진으로 기록하는 일상",
            instructor: "한강사",
            rating: 4.0,
            difficulty: "초급",
            category: "취미",
        },
    ];

    const filteredClasses = classes.filter((item) => {

        const categoryMatch =
            category === "전체" ||
            item.category === category;

        const keywordMatch =
            item.title
                .toLowerCase()
                .includes(keyword.toLowerCase()) ||
            item.instructor
                .toLowerCase()
                .includes(keyword.toLowerCase());

        return categoryMatch && keywordMatch;
    });

    return (
        <div className="min-h-screen bg-[#FFFDF9]">

            <div className="mx-auto max-w-7xl px-6 py-12">

                {/* 제목 */}
                <div className="mb-10 text-center">

                    <h1 className="text-3xl font-bold text-[#1F2937]">
                        클래스 탐색
                    </h1>

                    <p className="mt-3 text-[#6B7280]">
                        원하는 클래스를 찾아보세요.
                    </p>

                </div>


                {/* 검색 */}
                <div className="mx-auto mb-8 flex max-w-2xl gap-3">

                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)
                        }
                        placeholder="클래스명 / 강사명 / 키워드 검색"
                        className="
                            flex-1
                            rounded-xl
                            border border-gray-200
                            bg-white
                            px-5 py-3
                            outline-none
                            transition
                            focus:border-[#F97316]
                            focus:ring-2
                            focus:ring-orange-100
                        "
                    />

                    <button
                        type="button"
                        className="
                            rounded-xl
                            bg-[#F97316]
                            px-7 py-3
                            font-semibold
                            text-white
                            transition
                            hover:bg-orange-600
                        "
                    >
                        검색
                    </button>

                </div>


                {/* 카테고리 */}
                <div className="mb-10 flex flex-wrap justify-center gap-3">

                    {categories.map((item) => (

                        <button
                            key={item}
                            type="button"
                            onClick={() =>
                                setCategory(item)
                            }
                            className={`
                                rounded-full
                                px-5 py-2
                                text-sm
                                font-semibold
                                transition

                                ${
                                    category === item
                                        ? "bg-[#F97316] text-white"
                                        : "bg-[#FFEDD5] text-[#F97316] hover:bg-orange-200"
                                }
                            `}
                        >
                            {item}
                        </button>

                    ))}

                </div>


                {/* 클래스 카드 */}
                {filteredClasses.length > 0 ? (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6
                            md:grid-cols-2
                            lg:grid-cols-3
                        "
                    >

                        {filteredClasses.map((item) => (

                            <ClassCard
                                key={item.id}
                                classNo={item.id}
                                title={item.title}
                                instructor={item.instructor}
                                rating={item.rating}
                                difficulty={item.difficulty}
                            />

                        ))}

                    </div>

                ) : (

                    <div
                        className="
                            rounded-2xl
                            bg-white
                            py-20
                            text-center
                            text-[#6B7280]
                        "
                    >
                        검색 결과가 없습니다.
                    </div>

                )}


                {/* 페이지네이션 */}
                <div className="mt-12 flex justify-center gap-2">

                    <button
                        type="button"
                        className="
                            h-10 w-10
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                        "
                    >
                        ‹
                    </button>

                    {[1, 2, 3, 4, 5].map((page) => (

                        <button
                            key={page}
                            type="button"
                            className={`
                                h-10 w-10
                                rounded-xl
                                font-semibold

                                ${
                                    page === 1
                                        ? "bg-[#F97316] text-white"
                                        : "border border-gray-200 bg-white text-[#6B7280]"
                                }
                            `}
                        >
                            {page}
                        </button>

                    ))}

                    <button
                        type="button"
                        className="
                            h-10 w-10
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                        "
                    >
                        ›
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ClassListComponent;