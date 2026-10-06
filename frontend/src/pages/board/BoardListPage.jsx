import Pagination from "../../components/common/Pagination";
import { useState } from "react";
import { Link } from "react-router";
import { useStore, initialNotices, initialInquiries } from "../../mocks/data";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import { Workspace } from "../../components/common/Workspace";

const statusNames = {
  RECEIVED: "접수",
  PROCESSING: "처리 중",
  COMPLETED: "처리 완료",
};
export default function BoardListPage({ inquiry = false, admin = false }) {
  const [items] = useStore(
    inquiry ? "inquiries" : "notices",
    inquiry ? initialInquiries : initialNotices,
  );
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const base = admin
    ? inquiry
      ? "/admin/inquiry"
      : "/admin/notice"
    : inquiry
      ? "/inquiry"
      : "/notice";
  const filtered = items
    .filter(
      (item) =>
        (!inquiry || admin || item.memberId === 1) &&
        (status === "ALL" || item.status === status) &&
        `${item.title} ${item.content}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) => b.id - a.id);
  const body = (
    <>
      <Heading
        title={
          inquiry
            ? admin
              ? "문의 및 신고 관리"
              : "내 문의 및 신고"
            : admin
              ? "공지사항 관리"
              : "공지사항"
        }
        description={
          inquiry
            ? "접수한 문의와 처리 상태를 확인하세요."
            : "CLASS:ON의 새로운 소식과 이용 안내를 확인하세요."
        }
        action={
          (admin && !inquiry) || (!admin && inquiry) ? (
            <ButtonLink to={`${base}/register`}>
              {inquiry ? "문의 작성" : "공지 등록"}
            </ButtonLink>
          ) : null
        }
      />
      <p className="text-right text-[14px] text-[#85888d]">전체 {filtered.length}건</p>
      <div className="overflow-x-auto border border-[#eee5db] rounded-[10px] bg-white">
        <table className="w-full border-collapse text-[14px] whitespace-nowrap [&_tr:last-child>td]:border-b-0">
          <thead>
            <tr>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">번호</th>
              {inquiry && admin && (
                <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">작성자</th>
              )}
              <th className="text-left text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">제목</th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">{inquiry ? "접수일" : "작성일"}</th>
              {inquiry && (
                <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">처리 상태</th>
              )}
              {admin && !inquiry && (
                <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">관리</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.slice((page - 1) * 8, page * 8).map((item) => (
              <tr key={item.id}>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{item.id}</td>
                {inquiry && admin && (
                  <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">회원 {item.memberId}</td>
                )}
                <td className="text-left py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  <Link className="text-[#d97215]" to={`${base}/read/${item.id}`}>{item.title}</Link>
                </td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{item.date}</td>
                {inquiry && (
                  <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    <span className="inline-block px-3 py-[3px] rounded-[24px] bg-[#fff0df] text-[#df700e] text-[13px] font-bold">{statusNames[item.status]}</span>
                  </td>
                )}
                {admin && !inquiry && (
                  <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    <Link className="text-[#d97215]" to={`${base}/modify/${item.id}`}>수정</Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="flex justify-center gap-3 mb-6 [zoom:0.9]"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(keyword);
          setPage(1);
        }}
      >
        {inquiry && (
          <select
            aria-label="처리 상태"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">전체 상태</option>
            {Object.entries(statusNames).map(([v, label]) => (
              <option value={v} key={v}>
                {label}
              </option>
            ))}
          </select>
        )}
        <input
          aria-label="제목 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="제목 또는 내용 검색"
        />
        <button className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer">검색</button>
      </form>
      {!filtered.length && <Empty>검색 결과가 없습니다.</Empty>}
      <Pagination page={page} pages={Math.max(1, Math.ceil(filtered.length / 8))} onChange={setPage} />
    </>
  );
  return admin ? (
    <Workspace kind="admin">{body}</Workspace>
  ) : inquiry ? (
    <Workspace>{body}</Workspace>
  ) : (
    body
  );
}
