import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useStore, classes, money } from "../../mocks/data";
import AdminReview from "../../components/review/AdminReview";
import { usePagination } from "../../hooks/usePagination";
import { Workspace } from "../../components/common/Workspace";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";
import {
  getAdminMemberList,
  getAdminMemberDetail,
} from "../../api/adminApi";

// API 응답 데이터 추출
const unwrapResponse = (response) => response?.data ?? response;

// 회원 권한 표시
const getMemberRole = (role) => {
  if (role === "INSTRUCTOR") return "INS";
  return role || "-";
};

// 날짜 표시
const formatMemberDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
};

// 회원 관리
function AdminMemberManagement() {
  const [members, setMembers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

// 회원 관리 메뉴 재클릭 시 초기화
useEffect(() => {
  const handleRefresh = () => {
    setKeyword("");
    setSearch("");
    setPage(1);
    setDetail(null);
    setRefreshKey((prev) => prev + 1);
  };

  window.addEventListener("admin-members-refresh", handleRefresh);

  return () => {
    window.removeEventListener("admin-members-refresh", handleRefresh);
  };
}, []);

  // 회원 목록 조회 및 서버 페이지네이션
  useEffect(() => {
    let cancelled = false;

    const fetchMembers = async () => {
      setLoading(true);
      setError("");

      try {
        const trimmedKeyword = search.trim();

        // 이메일 검색과 닉네임 검색 구분
        const searchType =
          trimmedKeyword.includes("@") ||
          trimmedKeyword.includes(".")
            ? "email"
            : "nickname";

        const response = await getAdminMemberList({
          page,
          size: 10,
          ...(trimmedKeyword
            ? {
                searchType,
                keyword: trimmedKeyword,
              }
            : {}),
        });

        const data = unwrapResponse(response);

        if (cancelled) return;

        setMembers(data?.dtoList ?? []);
        setTotalCount(data?.totalCount ?? 0);
        setPages(Math.max(1, data?.totalPage ?? 1));
      } catch (err) {
        if (cancelled) return;

        setMembers([]);
        setTotalCount(0);
        setPages(1);
        setError(
          err.response?.data?.message ||
            "회원 목록을 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMembers();

    return () => {
      cancelled = true;
    };
  }, [page, search, refreshKey]);

  // 검색
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(keyword.trim());
    setDetail(null);
  };

  // 회원 상세 조회
  const handleDetail = async (memNo) => {
    setError("");

    try {
      const response = await getAdminMemberDetail(memNo);
      const data = unwrapResponse(response);

      setDetail(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "회원 상세 정보를 불러오지 못했습니다.",
      );
    }
  };

  const detailLabels = {
    memNo: "회원 번호",
    memEmail: "이메일",
    memNickname: "닉네임",
    memPhone: "전화번호",
    memAddress: "주소",
    memAddressDetail: "상세 주소",
    memImg: "프로필 이미지",
    memRole: "권한",
    memCreatedAt: "가입일",
    memPwUpdate: "비밀번호 변경일",
  };

  const detailEntries = detail
    ? Object.entries(detail).filter(([key]) =>
        Object.hasOwn(detailLabels, key),
      )
    : [];

  return (
    <Workspace kind="admin">
      <Heading
        title="회원 관리"
        description="등록된 정보를 조회하고 관리할 수 있습니다."
      />

      <p className="text-right text-[14px] text-[#85888d]">
        전체 {totalCount}건
      </p>

      {detail && (
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          <h2>상세 정보</h2>

          {detailEntries.map(([key, value]) => (
            <p key={key}>
              <strong>{detailLabels[key]}</strong>:{" "}
                {key === "memImg" ? (
                  value ? (
                    <img
                      src={
                        value.startsWith("http")
                          ? value
                          : `http://localhost:8080${value}`
                      }
                      alt="회원 프로필 이미지"
                      className="mt-2 w-24 h-24 rounded-full object-cover border border-[#ebe6e0]"
                    />
                  ) : (
                    "-"
                  )
                ) : key === "memCreatedAt" || key === "memPwUpdate" ? (
                  formatMemberDate(value)
                ) : value == null || value === "" ? (
                  "-"
                ) : (
                  String(value)
                )}
            </p>
          ))}

          <button
            type="button"
            className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3]"
            onClick={() => setDetail(null)}
          >
            닫기
          </button>
        </section>
      )}

      {error && (
        <p className="my-4 text-center text-[#ac4326]" role="alert">
          {error}
        </p>
      )}

      <div className="overflow-x-auto border border-[#eee5db] rounded-[10px] bg-white">
        <table className="w-full border-collapse text-[14px] whitespace-nowrap [&_tr:last-child>td]:border-b-0">
          <thead>
            <tr>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                번호
              </th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                이름
              </th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                이메일
              </th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                권한
              </th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                관리
              </th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              members.map((member) => (
                <tr key={member.memNo}>
                  <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    {member.memNo}
                  </td>
                  <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    {member.memNickname || "-"}
                  </td>
                  <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    {member.memEmail || "-"}
                  </td>
                  <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    {getMemberRole(member.memRole)}
                  </td>
                  <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    <button
                      type="button"
                      className="border-0 bg-transparent text-[#e47719] px-2 py-[3px]"
                      onClick={() => handleDetail(member.memNo)}
                    >
                      상세
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <p className="py-6 text-center text-[#85888d]">
          회원 정보를 불러오는 중입니다.
        </p>
      )}

      {!loading && !error && members.length === 0 && (
        <Empty>조회된 정보가 없습니다.</Empty>
      )}

      <form
        className="flex justify-center gap-3 mt-6 mb-6 [zoom:0.9]"
        onSubmit={handleSearch}
      >
        <input
          aria-label="회원 관리 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="회원명 / 이메일 검색"
        />
        <button className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3]">
          검색
        </button>
      </form>

      <Pagination
        page={page}
        pages={pages}
        onChange={(nextPage) => {
          setPage(nextPage);
          setDetail(null);
        }}
      />
    </Workspace>
  );
}

export default function AdminManagePage({ kind = "classes" }) {
  if (kind === "reviews") {
    return (
      <Workspace kind="admin">
        <AdminReview />
      </Workspace>
    );
  }

  const [items, setItems] = useStore("classes", classes);
  const [classList] = useStore("classes", classes);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [detail, setDetail] = useState(null);

  const title = "클래스 관리";

  // 후기 블라인드 처리
  const blindReview = (id) => {
    const current = items.find((review) => review.id === id);

    if (!current || current.blinded) return;

    const at = new Date().toISOString();

    const updated = {
      ...current,
      blinded: true,
      blindedAt: at,
      moderationHistory: [
        ...(current.moderationHistory || []),
        { action: "BLIND", actor: "ADMIN", at },
      ],
    };

    setItems((reviews) =>
      reviews.map((review) => (review.id === id ? updated : review)),
    );

    setDetail((previous) => (previous?.id === id ? updated : previous));
  };

  const filtered = items.filter((x) =>
    JSON.stringify(x).toLowerCase().includes(search.toLowerCase()),
  );

  const pagination = usePagination(filtered);

  // 회원 관리는 실제 API 사용
  if (kind === "members") {
    return <AdminMemberManagement />;
  }

  return (
    <Workspace kind="admin">
      <Heading
        title={title}
        description="등록된 정보를 조회하고 관리할 수 있습니다."
      />

      <p className="text-right text-[14px] text-[#85888d]">
        전체 {filtered.length}건
      </p>

      {detail && (
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          <h2>상세 정보</h2>

          {Object.entries(detail)
            .filter(([k]) => !["art", "color"].includes(k))
            .map(([k, v]) => (
              <p key={k}>
                <strong>
                  {{
                    id: "번호",
                    name: "이름",
                    email: "이메일",
                    role: "권한",
                    title: "클래스명",
                    instructor: "강사",
                    category: "카테고리",
                    price: "수강료",
                    capacity: "정원",
                    duration: "수업 시간",
                    difficulty: "난이도",
                    location: "장소",
                    description: "설명",
                    author: "작성자",
                    content: "후기 내용",
                    rating: "평점",
                    date: "작성일",
                    classId: "클래스 번호",
                    memberId: "회원 번호",
                    reservationId: "예약 번호",
                    blinded: "공개 상태",
                    blindedAt: "블라인드 처리 일시",
                    moderationHistory: "처리 이력",
                  }[k] || k}
                </strong>
                :{" "}
                {k === "blinded"
                  ? v
                    ? "블라인드"
                    : "공개"
                  : k === "moderationHistory"
                    ? v
                        .map(
                          (entry) =>
                            `블라인드 · ${new Date(entry.at).toLocaleString(
                              "ko-KR",
                              { timeZone: "Asia/Seoul" },
                            )}`,
                        )
                        .join(" / ")
                    : k === "blindedAt"
                      ? new Date(v).toLocaleString("ko-KR", {
                          timeZone: "Asia/Seoul",
                        })
                      : String(v)}
              </p>
            ))}

          <button
            className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3]"
            onClick={() => setDetail(null)}
          >
            닫기
          </button>
        </section>
      )}

      {confirm && (
        <div className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]">
          선택한 예시 데이터를 삭제할까요?
          <div className="flex gap-3 items-center flex-wrap mt-[29px]">
            <button
              className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3]"
              onClick={() => {
                setItems((v) => v.filter((x) => x.id !== confirm));
                setConfirm(null);
                setDetail(null);
              }}
            >
              삭제 확인
            </button>

            <button
              className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3]"
              onClick={() => setConfirm(null)}
            >
              취소
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-[#eee5db] rounded-[10px] bg-white">
        <table className="w-full border-collapse text-[14px] whitespace-nowrap [&_tr:last-child>td]:border-b-0">
          <thead>
            <tr>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                번호
              </th>
              <th className="text-left text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                클래스명
              </th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                강사
              </th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                카테고리
              </th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                가격
              </th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">
                관리
              </th>
            </tr>
          </thead>

          <tbody>
            {pagination.items.map((x) => (
              <tr key={x.id}>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  {x.id}
                </td>
                <td className="text-left py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  <Link className="text-[#d97215]" to={`/class/${x.id}`}>
                    {x.title}
                  </Link>
                </td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  {x.instructor}
                </td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  {x.category}
                </td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  {money(x.price)}
                </td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  <button
                    className="border-0 bg-transparent text-[#e47719] px-2 py-[3px]"
                    onClick={() => setDetail(x)}
                  >
                    상세
                  </button>
                  <button
                    className="border-0 bg-transparent text-[#e47719] px-2 py-[3px]"
                    onClick={() => setConfirm(x.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        className="flex justify-center gap-3 mt-6 mb-6 [zoom:0.9]"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(keyword);
        }}
      >
        <input
          aria-label={`${title} 검색`}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="클래스명 / 강사 / 카테고리 검색"
        />
        <button className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3]">
          검색
        </button>
      </form>

      {!filtered.length && <Empty>조회된 정보가 없습니다.</Empty>}

      <Pagination {...pagination} />
    </Workspace>
  );
}