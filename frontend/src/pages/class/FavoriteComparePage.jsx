import { useSearchParams } from "react-router";
import useFavorite from "../../hooks/useFavorite";
import { money } from "../../mocks/data";
import { Workspace } from "../../components/common/Workspace";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import { Art } from "../../components/common/Art";
import { ButtonLink } from "../../components/common/ButtonLink";

function FragmentRow({ label, value }) {
  return (
    <>
      <dt className="text-[#374151]">{label}</dt>
      <dd className="m-0 font-semibold">{value}</dd>
    </>
  );
}

export default function FavoriteComparePage() {
  const [params] = useSearchParams();
  const { favorites } = useFavorite();

  // 비교 페이지로 전달된 클래스 번호
  const ids = (params.get("ids") || "")
    .split(",")
    .map(Number)
    .filter((id) => Number.isFinite(id) && id > 0);

  // 실제 찜 목록에서 선택한 클래스 찾기
  const selectedClasses = ids
    .map((id) => favorites.find((f) => f.clsNo === id))
    .filter((f) => f?.product != null);

  if (selectedClasses.length !== 2) {
    return (
      <Workspace>
        <Heading title="클래스 비교" />
        <Empty to="/member/favorites" label="찜 목록에서 선택">
          찜 목록에서 클래스 2개를 선택해주세요.
        </Empty>
      </Workspace>
    );
  }

  return (
    <Workspace>
      <Heading
        title="클래스 비교"
        description="두 클래스를 한눈에 비교해보세요."
        action={
          <ButtonLink to="/member/favorites" secondary>
            ← 찜 목록으로 돌아가기
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-2 gap-[26px] [&>*]:min-w-0 max-md:grid-cols-1">
        {selectedClasses.map((favorite) => {
          const c = favorite.product;

          const address = [
            favorite.clsRoadAddr,
            favorite.clsDetailAddr,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <section
              className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]"
              key={c.clsNo}
            >
              <Art item={c} />

              <h2 style={{ marginTop: 20 }}>{c.clsName}</h2>

              <dl className="grid grid-cols-[150px_1fr] gap-[17px] my-[26px] max-md:grid-cols-[120px_1fr] max-[420px]:grid-cols-[100px_minmax(0,1fr)]">
                {[
                  ["강사", c.instructorName ?? "-"],
                  ["카테고리", c.catName ?? "-"],
                  ["난이도", c.clsLevel ?? "-"],
                  ["수강료", money(c.clsPrice)],
                  ["수업 시간", favorite.clsDuration != null
                    ? `${favorite.clsDuration}분`
                    : "-"],
                  ["최대 정원", favorite.maxCapacity != null
                    ? `${favorite.maxCapacity}명`
                    : "-"],
                  ["평점", c.rating != null ? `★ ${c.rating}` : "평점 없음"],
                  ["장소", address || "-"],
                ].map(([k, v]) => (
                  <FragmentRow key={k} label={k} value={v} />
                ))}
              </dl>

              <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
                <ButtonLink secondary to={`/class/${c.clsNo}`}>
                  클래스 상세보기
                </ButtonLink>
              </div>
              
            </section>
            
          );
        })}
      </div>
    </Workspace>
  );
}