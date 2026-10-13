
import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Heading } from "../../components/common/Heading";
import { Workspace } from "../../components/common/Workspace";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Empty } from "../../components/common/Empty";
import { getMyClasses } from "../../api/classApi";

export default function InstructorClassPage() {
  const [list, setList] = useState([]);
  const pagination = usePagination(list);

  useEffect(() => {
    getMyClasses()
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Workspace kind="instructor">
      <Heading
        title="내 클래스 관리"
        action={
          <ButtonLink to="/instructor/classes/register">
            클래스 등록
          </ButtonLink>
        }
      />

      <div className="overflow-x-auto border border-[#eee5db] rounded-[10px] bg-white">
        <table className="w-full border-collapse text-[14px] whitespace-nowrap [&_tr:last-child>td]:border-b-0">
          <thead>
            <tr>
              <th className="text-left text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                클래스명
              </th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                카테고리
              </th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                수강료
              </th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {pagination.items.map((c) => (
              <tr key={c.clsNo}>
                <td className="text-left py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  <Link
                    className="text-[#d97215]"
                    to={`/class/${c.clsNo}`}
                  >
                    {c.clsName}
                  </Link>
                </td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  {c.catName}
                </td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  {Number(c.clsPrice).toLocaleString("ko-KR")}원
                </td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  <Link
                    className="text-[#d97215]"
                    to={`/instructor/classes/${c.clsNo}/edit`}
                  >
                    수정
                  </Link>
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
