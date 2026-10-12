import Pagination from "../../components/common/Pagination";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useStore, initialInquiries } from "../../mocks/data";
import { getNoticeList } from "../../api/noticeApi";
import { getAdminInquiryList } from "../../api/inquiryApi";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import { Workspace } from "../../components/common/Workspace";

const statusNames = {
  RECEIVED: "접수",
  PROCESSING: "처리 중",
  COMPLETED: "처리 완료",

  // 현재 DB의 실제 상태값도 표시
  접수: "접수",
  처리중: "처리 중",
  완료: "처리 완료",
};

export default function BoardListPage({ inquiry = false, admin = false }) {
  // 일반 회원 문의 화면은 아직 기존 mock 데이터 사용
  const [inquiryItems] = useStore("inquiries", initialInquiries);

  // 공지사항 실제 API 데이터
  const [noticeItems, setNoticeItems] = useState([]);

  // 관리자 문의 실제 API 데이터
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
    ? inquiry
      ? "/admin/inquiry"
      : "/admin/notice"
    : inquiry
      ? "/inquiry"
      : "/notice";

  // 공지사항 실제 API 조회
  useEffect(() => {
    if (inquiry) {
      return;
    }

    const fetchNotices = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getNoticeList(page, search);

        setNoticeItems(data?.dtoList ?? []);
        setTotalCount(data?.totalCount ?? 0);
        setTotalPage(data?.totalPage ?? 1);
      } catch (err) {
        console.error("공지사항 목록 조회 실패:", err);
        setError("공지사항을 불러오지 못했습니다.");
        setNoticeItems([]);
        setTotalCount(0);
        setTotalPage(1);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [inquiry, page, search]);

  // 관리자 문의 실제 API 조회
  useEffect(() => {
    if (!inquiry || !admin) {
      return;
    }

    const fetchAdminInquiries = async () => {
      try {
        setLoading(true);
        setError("");

        const apiStatus =
          status === "ALL" ? "" : status;

        const data = await getAdminInquiryList(
          page,
          search,
          apiStatus,
        );

        setAdminInquiryItems(data?.dtoList ?? []);
        setTotalCount(data?.totalCount ?? 0);
        setTotalPage(data?.totalPage ?? 1);
      } catch (err) {
        console.error("관리자 문의 목록 조회 실패:", err);
        setError("문의 목록을 불러오지 못했습니다.");
        setAdminInquiryItems([]);
        setTotalCount(0);
        setTotalPage(1);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInquiries();
  }, [inquiry, admin, page, search, status]);

  // 일반 회원 문의는 아직 기존 mock 처리
  const filteredInquiries = inquiryItems
    .filter(
      (item) =>
        (status === "ALL" || item.status === status) &&
        `${item.title ?? ""} ${item.content ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) => b.id - a.id);

  const inquiryPageItems = filteredInquiries.slice(
    (page - 1) * 8,
    page * 8,
  );

  // 현재 화면에서 사용할 데이터
  const items =
    inquiry && admin
      ? adminInquiryItems
      : inquiry
        ? inquiryPageItems
        : noticeItems;

  const count =
    inquiry && admin
      ? totalCount
      : inquiry
        ? filteredInquiries.length
        : totalCount;

  const pages =
    inquiry && admin
      ? Math.max(1, totalPage)
      : inquiry
        ? Math.max(1, Math.ceil(filteredInquiries.length / 8))
        : Math.max(1, totalPage);

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

      <p className="text-right text-[14px] text-[#85888d]">
        전체 {count}건
      </p>

      {loading ? (
        <p className="text-center py-10 text-[#85888d]">
          {inquiry
            ? "문의 목록을 불러오는 중입니다."
            : "공지사항을 불러오는 중입니다."}
        </p>
      ) : error ? (
        <Empty>{error}</Empty>
      ) : (
        <>
          <div className="overflow-x-auto border border-[#eee5db] rounded-[10px] bg-white">
            <table className="w-full border-collapse text-[14px] whitespace-nowrap [&_tr:last-child>td]:border-b-0">
              <thead>
                <tr>
                  <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    번호
                  </th>

                  {inquiry && admin && (
                    <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                      작성자
                    </th>
                  )}

                  <th className="text-left text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    제목
                  </th>

                  <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    {inquiry ? "접수일" : "작성일"}
                  </th>

                  {inquiry && (
                    <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                      처리 상태
                    </th>
                  )}

                  {admin && !inquiry && (
                    <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                      관리
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {items.map((item) => {
                  const isAdminInquiry = inquiry && admin;

                  const id = isAdminInquiry
                    ? item.inqNo
                    : inquiry
                      ? item.id
                      : item.notNo;

                  const title = isAdminInquiry
                    ? item.inqTitle
                    : inquiry
                      ? item.title
                      : item.notTitle;

                  const date = isAdminInquiry
                    ? item.inqCreatedAt
                      ? new Date(
                          item.inqCreatedAt,
                        ).toLocaleDateString("ko-KR")
                      : "-"
                    : inquiry
                      ? item.date
                      : item.notCreatedAt
                        ? new Date(
                            item.notCreatedAt,
                          ).toLocaleDateString("ko-KR")
                        : "-";

                  const inquiryStatus = isAdminInquiry
                    ? item.inqStatus
                    : item.status;

                  return (
                    <tr key={id}>
                      <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                        {id}
                      </td>

                      {inquiry && admin && (
                        <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                          회원 {item.inqMemNo}
                        </td>
                      )}

                      <td className="text-left py-[18px] px-[17px] border-b border-[#f0ebe6]">
                        <Link
                          className="text-[#d97215]"
                          to={`${base}/read/${id}`}
                        >
                          {title}
                        </Link>
                      </td>

                      <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                        {date}
                      </td>

                      {inquiry && (
                        <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                          <span className="inline-block px-3 py-[3px] rounded-[24px] bg-[#fff0df] text-[#df700e] text-[13px] font-bold">
                            {statusNames[inquiryStatus] ??
                              inquiryStatus ??
                              "-"}
                          </span>
                        </td>
                      )}

                      {admin && !inquiry && (
                        <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                          <Link
                            className="text-[#d97215]"
                            to={`${base}/modify/${id}`}
                          >
                            수정
                          </Link>
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

                  {admin ? (
                    <>
                      <option value="접수">접수</option>
                      <option value="처리중">처리 중</option>
                      <option value="완료">처리 완료</option>
                    </>
                  ) : (
                    Object.entries({
                      RECEIVED: "접수",
                      PROCESSING: "처리 중",
                      COMPLETED: "처리 완료",
                    }).map(([value, label]) => (
                      <option value={value} key={value}>
                        {label}
                      </option>
                    ))
                  )}
                </select>
              )}

              <input
                aria-label="제목 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="제목 또는 내용 검색"
              />

              <button className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer">
                검색
              </button>
            </form>
          </div>

          {!items.length && <Empty>검색 결과가 없습니다.</Empty>}

          <Pagination
            page={page}
            pages={pages}
            onChange={setPage}
          />
        </>
      )}
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