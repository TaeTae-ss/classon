import { useState } from "react";
import { classes, useStore } from "../../mocks/data";
import { usePagination } from "../../hooks/usePagination";
import { Workspace } from "../../components/common/Workspace";
import { Heading } from "../../components/common/Heading";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Card } from "../../components/common/Card";
import { Empty } from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";

export default function FavoritePage() {
  const [favorites] = useStore("favorites", [1, 2]);
  const [list] = useStore("classes", classes);
  const [selected, setSelected] = useState([]);
  const pagination = usePagination(list.filter((c) => favorites.includes(c.id)));
  return (
    <Workspace>
      <Heading
        title="내가 찜한 클래스"
        description="마음에 드는 클래스를 모아두고 비교해보세요."
        action={
          <ButtonLink
            to={`/favorites/compare?ids=${selected.join(",")}`}
            secondary
          >
            선택 비교 ({selected.length}/2)
          </ButtonLink>
        }
      />
      {selected.length !== 2 && (
        <p className="text-right text-[14px] text-[#85888d]">비교할 클래스를 2개 선택해주세요.</p>
      )}
      {favorites.length ? (
        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-md:gap-3 max-[420px]:grid-cols-1">
          {pagination.items.map((c) => (
              <Card
                key={c.id}
                item={c}
                selected={selected.includes(c.id)}
                select={(id) =>
                  setSelected((v) =>
                    v.includes(id)
                      ? v.filter((x) => x !== id)
                      : v.length < 2
                        ? [...v, id]
                        : v,
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
