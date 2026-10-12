import { useEffect, useState } from "react";
import useFavorite from "../../hooks/useFavorite";
import { usePagination } from "../../hooks/usePagination";
import { Workspace } from "../../components/common/Workspace";
import { Heading } from "../../components/common/Heading";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Card } from "../../components/common/Card";
import { Empty } from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";

export default function FavoritePage() {
  const { favorites, handleToggleFavorite } = useFavorite();
  const [selected, setSelected] = useState([]);

  // 찜 목록에서 클래스 정보만 추출
  const favoriteClasses = favorites
    .filter((f) => f.product != null)
    .map((f) => f.product);

  const pagination = usePagination(favoriteClasses);

  // 찜 해제한 클래스는 비교 선택 목록에서도 제거
  useEffect(() => {
    setSelected((prev) =>
      prev.filter((id) =>
        favorites.some((f) => f.clsNo === id)
      )
    );
  }, [favorites]);

  return (
    <Workspace>
      <Heading
        title="내가 찜한 클래스"
        description="마음에 드는 클래스를 모아두고 비교해보세요."
        action={
          selected.length === 2 ? (
            <ButtonLink
              to={`/favorites/compare?ids=${selected.join(",")}`}
              secondary
            >
              선택 비교 ({selected.length}/2)
            </ButtonLink>
          ) : (
            <button
              type="button"
              disabled
              className="px-5 py-3 rounded-lg bg-gray-200 text-gray-400 cursor-not-allowed"
            >
              선택 비교 ({selected.length}/2)
            </button>
          )
        }
      />

      {favoriteClasses.length ? (
        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-md:gap-3 max-[420px]:grid-cols-1">
          {pagination.items.map((c) => (
            <Card
              key={c.clsNo}
              item={c}
              liked={true}
              onToggleFavorite={handleToggleFavorite}
              selected={selected.includes(c.clsNo)}
              select={(id) =>
                setSelected((v) =>
                  v.includes(id)
                    ? v.filter((x) => x !== id)
                    : v.length < 2
                      ? [...v, id]
                      : v
                )
              }
            />
          ))}
        </div>
      ) : (
        <Empty to="/class" label="클래스 찾아보기">
          찜한 클래스가 없습니다.
        </Empty>
      )}

      <Pagination {...pagination} />
    </Workspace>
  );
}