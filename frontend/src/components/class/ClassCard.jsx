import Rating from "@mui/material/Rating";
import { useNavigate } from "react-router";

const ClassCard = ({
    classNo,
    title,
    instructor,
    rating,
    difficulty,
    image,
}) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/class/${classNo}`);
    };

    return (
        <div
            onClick={handleClick}
            className="
                cursor-pointer
                overflow-hidden
                rounded-2xl
                border border-orange-100
                bg-white
                shadow-sm
                transition
                duration-200
                hover:-translate-y-1
                hover:shadow-md
            "
        >
            <div className="h-48 bg-orange-50">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div
                        className="
                            flex h-full items-center justify-center
                            text-sm text-gray-400
                        "
                    >
                        클래스 이미지
                    </div>
                )}
            </div>

            <div className="p-5">

                <h3 className="mb-3 text-lg font-bold text-[#1F2937]">
                    {title}
                </h3>

                <div className="mb-3 flex items-center gap-2">

                    <Rating
                        value={rating}
                        precision={0.5}
                        readOnly
                        size="small"
                    />

                    <span className="text-sm font-semibold text-[#F97316]">
                        {rating}
                    </span>

                </div>

                <div className="flex items-center justify-between">

                    <span className="text-sm text-[#6B7280]">
                        {instructor}
                    </span>

                    <span
                        className="
                            rounded-full
                            bg-[#FFEDD5]
                            px-3 py-1
                            text-xs font-semibold
                            text-[#F97316]
                        "
                    >
                        {difficulty}
                    </span>

                </div>

            </div>
        </div>
    );
};

export default ClassCard;