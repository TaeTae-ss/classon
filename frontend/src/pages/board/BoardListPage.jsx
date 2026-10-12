import { useEffect, useState } from "react";
import { Link } from "react-router";
import Pagination from "../../components/common/Pagination";
import { getNoticeList } from "../../api/noticeApi";
import { getAdminInquiryList, getMyInquiryList } from "../../api/inquiryApi";
import { getCookie } from "../../util/cookieUtil";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import { Workspace } from "../../components/common/Workspace";

const PAGE_SIZE = 8;
const statusNames = {
  RECEIVED: "접수",
  PROCESSING: "처리 중",
  COMPLETED: "처리 완료",
  접수: "접수",
  처리중: "처리 중",
  "처리 중": "처리 중",
  완료: "처리 완료",
  "처리 완료": "처리 완료",
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("ko-KR");
};

export default function BoardListPage({ inquiry = false, admin = false }) {
  const [inquiryItems, setInquiryItems] = useState([]);
  const [noticeItems, setNoticeItems] = useState([]);
  const [adminInquiryItems, setAdminInquiryItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const base = admin
    ? inquiry ? "/admin/inquiry" : "/admin/notice"
    : inquiry ? "/inquiry" : "/notice";

  useEffect(() => {
    if (inquiry) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getNoticeList(page, search);
        if (!active) return;
        setNoticeItems(data?.dtoList ?? []);
        setTotalCount(data?.totalCount ?? 0);
        setTotalPage(data?.totalPage ?? 1);
      } catch (err) {
        if (!active) return;
        console.error("공지사항 목록 조회 실패:", err);
        setError("공지사항을 불러오지 못했습니다.");
        setNoticeItems([]);
        setTotalCount(0);
        setTotalPage(1);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [inquiry, page, search]);

  useEffect(() => {
    if (!inquiry || !admin) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getAdminInquiryList({
          page,
          keyword: search,
          status: status === "ALL" ? "" : status,
        });
        if (!active) return;
        setAdminInquiryItems(data?.dtoList ?? []);
        setTotalCount(data?.totalCount ?? 0);
        setTotalPage(data?.totalPage ?? 1);
      } catch (err) {
        if (!active) return;
        console.error("관리자 문의 목록 조회 실패:", err);
        setError("문의 목록을 불러오지 못했습니다.");
        setAdminInquiryItems([]);
        setTotalCount(0);
        setTotalPage(1);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [inquiry, admin, page, search, status]);

  useEffect(() => {
    if (!inquiry || admin) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const member = getCookie("member");
        const memNo = member?.memNo;
        if (!memNo) throw new Error("로그인 회원 번호가 없습니다.");
        const data = await getMyInquiryList(memNo);
        if (!active) return;
        setInquiryItems(Array.isArray(data) ? data : data?.dtoList ?? []);
      } catch (err) {
        if (!active) return;
        console.error("내 문의 목록 조회 실패:", err);
        setError("문의 목록을 불러오지 못했습니다.");
        setInquiryItems([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [inquiry, admin]);

  const filteredInquiries = inquiryItems
    .filter((item) => {
      const matchesStatus = status === "ALL" ||
        (statusNames[item.inqStatus] ?? item.inqStatus) === (statusNames[status] ?? status);
      const text = `${item.inqTitle ?? ""} ${item.inqContent ?? ""}`.toLowerCase();
      return matchesStatus && text.includes(search.toLowerCase());
    })
    .sort((a, b) => Number(b.inqNo) - Number(a.inqNo));

  const inquiryPageItems = filteredInquiries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const items = inquiry ? (admin ? adminInquiryItems : inquiryPageItems) : noticeItems;
  const count = inquiry && !admin ? filteredInquiries.length : totalCount;
  const pages = inquiry && !admin
    ? Math.max(1, Math.ceil(filteredInquiries.length / PAGE_SIZE))
    : Math.max(1, totalPage);

  const body = (
    <>
      <Heading
        title={inquiry ? (admin ? "문의 관리" : "내 문의") : (admin ? "공지사항 관리" : "공지사항")}
        description={inquiry ? "접수한 문의와 처리 상태를 확인하세요." : "CLASS:ON의 새로운 소식과 이용 안내를 확인하세요."}
        action={(admin && !inquiry) || (!admin && inquiry) ? (
          <ButtonLink to={`${base}/register`}>{inquiry ? "문의 작성" : "공지 등록"}</ButtonLink>
        ) : null}
      />

      <p className="text-right text-[14px] text-[#85888d]">전체 {count}건</p>

      {loading ? (
        <p className="text-center py-10 text-[#85888d]">
          {inquiry ? "문의 목록을 불러오는 중입니다." : "공지사항을 불러오는 중입니다."}
        </p>
      ) : error ? (
        <Empty>{error}</Empty>
      ) : (
        <>
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
                {items.map((item) => {
                  const id = inquiry ? item.inqNo : item.notNo;
                  const title = inquiry ? item.inqTitle : item.notTitle;
                  const date = formatDate(inquiry ? item.inqCreatedAt : item.notCreatedAt);
                  const inquiryStatus = inquiry ? item.inqStatus : undefined;
                  return (
                    <tr key={id}>
                      <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{id}</td>
                      {inquiry && admin && (
                        <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">회원 {item.inqMemNo}</td>
                      )}
                      <td className="text-left py-[18px] px-[17px] border-b border-[#f0ebe6]">
                        <Link className="text-[#d97215]" to={`${base}/read/${id}`}>{title}</Link>
                      </td>
                      <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{date}</td>
                      {inquiry && (
                        <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                          <span className="inline-block px-3 py-[3px] rounded-[24px] bg-[#fff0df] text-[#df700e] text-[13px] font-bold">
                            {statusNames[inquiryStatus] ?? inquiryStatus ?? "-"}
                          </span>
                        </td>
                      )}
                      {admin && !inquiry && (
                        <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                          <Link className="text-[#d97215]" to={`${base}/modify/${id}`}>수정</Link>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ paddingTop: "calc(24px / 0.9)" }}>
            <form
              className="flex justify-center gap-3 mb-6 [zoom:0.9]"
              onSubmit={(e) => { e.preventDefault(); setSearch(keyword); setPage(1); }}
            >
              {inquiry && (
                <select
                  aria-label="처리 상태"
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                >
                  <option value="ALL">전체 상태</option>
                  <option value="접수">접수</option>
                  <option value="처리중">처리 중</option>
                  <option value="완료">처리 완료</option>
                </select>
              )}
              <input
                aria-label="제목 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="제목 또는 내용 검색"
              />
              <button type="submit" className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer">검색</button>
            </form>
          </div>

          {!items.length && <Empty>검색 결과가 없습니다.</Empty>}
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}
    </>
  );

  return admin ? (
    <Workspace kind="admin">{body}</Workspace>
  ) : inquiry ? (
    <Workspace>{body}</Workspace>
  ) : body;
}
