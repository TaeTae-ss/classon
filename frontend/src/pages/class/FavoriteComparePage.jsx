import { useSearchParams } from "react-router";
import { classes, findClass, money, useStore } from "../../mocks/data";
import { Workspace } from "../../components/common/Workspace";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import { Art } from "../../components/common/Art";
import { ButtonLink } from "../../components/common/ButtonLink";

function FragmentRow({ label, value }) {
  return (
    <>
      <dt className="text-[#888]">{label}</dt>
      <dd className="m-0 font-semibold">{value}</dd>
    </>
  );
}

export default function FavoriteComparePage() {
  const [params] = useSearchParams();
  const [favorites] = useStore("favorites", [1, 2]);
  const [list] = useStore("classes", classes);
  const ids = (params.get("ids") || "")
    .split(",")
    .map(Number)
    .filter((id) => favorites.includes(id));
  if (ids.length !== 2)
    return (
      <Workspace>
        <Heading title="클래스 비교" />
        <Empty to="/member/favorites" label="찜 목록에서 선택">
          찜 목록에서 클래스 2개를 선택해주세요.
        </Empty>
      </Workspace>
    );
  return (
    <Workspace>
      <Heading
        title="클래스 비교"
        description="두 클래스를 한눈에 비교해보세요."
      />
      <div className="grid grid-cols-2 gap-[26px] [&>*]:min-w-0 max-md:grid-cols-1">
        {ids.map((id) => {
          const c = findClass(id, list);
          return c ? (
            <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]" key={id}>
              <Art item={c} />
              <h2 style={{ marginTop: 20 }}>{c.title}</h2>
              <dl className="grid grid-cols-[150px_1fr] gap-[17px] my-[26px] max-md:grid-cols-[120px_1fr] max-[420px]:grid-cols-[100px_minmax(0,1fr)]">
                {[
                  ["강사", c.instructor],
                  ["카테고리", c.category],
                  ["난이도", c.difficulty],
                  ["수강료", money(c.price)],
                  ["수업 시간", `${c.duration}분`],
                  ["최대 정원", `${c.capacity}명`],
                  ["평점", `★ ${c.rating}`],
                  ["장소", c.location],
                ].map(([k, v]) => (
                  <FragmentRow key={k} label={k} value={v} />
                ))}
              </dl>
              <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
                <ButtonLink secondary to={`/class/${id}`}>
                  더 알아보기
                </ButtonLink>
                <ButtonLink to={`/reservation?clsNo=${id}`}>
                  예약하기
                </ButtonLink>
              </div>
            </section>
          ) : null;
        })}
      </div>
    </Workspace>
  );
}
