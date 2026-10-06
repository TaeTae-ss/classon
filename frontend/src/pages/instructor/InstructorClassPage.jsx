import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { useState } from "react";
import { Link } from "react-router";
import { classes, useStore, money } from "../../mocks/data";
import { Heading } from "../../components/common/Heading";
import { Workspace } from "../../components/common/Workspace";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Empty } from "../../components/common/Empty";

export default function InstructorClassPage() {
  const [list, setList] = useStore("classes", classes);
  const [selected, setSelected] = useState(null);
  const pagination = usePagination(list);
  return (
    <Workspace kind="instructor">
      <Heading
        title="내 클래스 관리"
        action={
          <ButtonLink to="/instructor/classes/register">클래스 등록</ButtonLink>
        }
      />
      {selected && (
        <div className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]">
          이 클래스의 예시 데이터를 삭제할까요?
          <div className="flex gap-3 items-center flex-wrap mt-[29px]">
            <button
              className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer"
              onClick={() => {
                setList((v) => v.filter((c) => c.id !== selected));
                setSelected(null);
              }}
            >
              삭제 확인
            </button>
            <button
              className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer"
              onClick={() => setSelected(null)}
            >
              돌아가기
            </button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto border border-[#eee5db] rounded-[10px] bg-white">
        <table className="w-full border-collapse text-[14px] whitespace-nowrap [&_tr:last-child>td]:border-b-0">
          <thead>
            <tr>
              <th className="text-left text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">클래스명</th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">카테고리</th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">수강료</th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">관리</th>
            </tr>
          </thead>
          <tbody>
            {pagination.items.map((c) => (
              <tr key={c.id}>
                <td className="text-left py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  <Link className="text-[#d97215]" to={`/class/${c.id}`}>{c.title}</Link>
                </td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{c.category}</td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{money(c.price)}</td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  <Link className="text-[#d97215]" to={`/instructor/classes/${c.id}/edit`}>수정</Link>
                  <button
                    className="border-0 bg-transparent text-[#e47719] px-2 py-[3px]"
                    onClick={() => setSelected(c.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!list.length && <Empty>등록된 클래스가 없습니다.</Empty>}
      <Pagination {...pagination} />
    </Workspace>
  );
}
