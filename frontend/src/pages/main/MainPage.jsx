import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Art } from "../../components/common/Art";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Card } from "../../components/common/Card";
import { getClassList } from "../../api/classApi";
import { getCategories } from "../../api/categoryApi";

const bannerImages = Object.values(
  import.meta.glob("../../assets/banners/*.{jpg,jpeg,png,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  })
);

export default function MainPage() {

  const categoryIcons = {
    공예: "fi fi-rr-tools",
    미술: "fi fi-rr-palette",
    아웃도어: "fi fi-rr-trees",
    요리: "fi fi-rr-restaurant",
    음악: "fi fi-rr-music",
    피트니스: "fi fi-rr-gym",
  };

  const [classes, setClasses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    if (bannerImages.length === 0) return;

    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClassList({ page: 1, size: 4 });
        console.log("클래스 API 응답:", data);

        setClasses(data.dtoList ?? []);
      } catch (error) {
        console.error("클래스 목록 조회 실패:", error);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((error) => {
        console.error("카테고리 조회 실패:", error);
      });
  }, []);

  return (
    <>
            
      <section className="grid grid-cols-2 items-center gap-12 bg-[#FFF8F1] rounded-[24px] px-14 py-12 my-5 mb-14 max-[900px]:grid-cols-1 max-md:px-6 max-md:py-8 max-md:gap-8">

        {/* 왼쪽 소개 문구 */}
        <div className="py-4">
          <span className="inline-block text-[12px] font-bold tracking-[3px] text-[#a57950] mb-5">
            MAKE YOUR DAY, CLASS:ON
          </span>

          <h1 className="text-[42px] font-bold leading-[1.4] mb-6 tracking-[-1px] max-[1100px]:text-[36px] max-[420px]:text-[30px]">
            <span className="text-[#e57315]">
              취미를 켜다,
            </span>
            <br />
            일상에 즐거움을 더하다.
          </h1>

          <p className="text-[16px] leading-[1.9] text-[#78664f] mb-9 max-md:text-[14px]">
            망설였던 도전부터 새로운 발견까지.
            <br />
            나에게 맞는 원데이 클래스를 만나보세요.
          </p>

          <ButtonLink to="/class">
            클래스 둘러보기 →
          </ButtonLink>
        </div>

        {/* 배너 */}
        <div className="relative w-full h-[370px] overflow-hidden rounded-[20px] max-md:h-[270px]">
          {bannerImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`CLASS:ON 원데이 클래스 ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                bannerIndex === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

      </section>


      <section className="mb-[43px]">
        <h2 className="mb-5">관심 있는 분야를 찾아보세요</h2>

        <div className="grid grid-cols-6 gap-3 max-[900px]:grid-cols-3 max-md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.catNo}
              to={`/class?categoryId=${category.catNo}`}
              className="flex flex-col items-center justify-center gap-2
                min-h-[90px] rounded-[11px]
                border border-[#ebe6e0] bg-white
                transition-all duration-200
                hover:bg-[#fff7ef] hover:border-[#e57315]
                hover:-translate-y-[2px]"
              >
              <i
                className={`${categoryIcons[category.catName] || "fi fi-rr-apps"} text-[23px]`}
                aria-hidden="true"
              />

              <span className="text-[14px] font-medium">
                {category.catName}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2>새로운 취미를 발견해보세요</h2>
          <Link className="text-[#e57315] text-[14px]" to="/class">
            전체 보기 →
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-6 max-[900px]:grid-cols-2 max-md:gap-3 max-[420px]:grid-cols-1">
          {classes.map((c) => (
            <Card
              key={c.clsNo}
              item={c}
              showFavorite={false}
            />
          ))}
        </div>
      </section>
    </>
  );
}