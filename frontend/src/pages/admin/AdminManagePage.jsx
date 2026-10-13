
import { useEffect, useState } from "react";
import { Link } from "react-router";

import AdminReview from "../../components/review/AdminReview";
import { Workspace } from "../../components/common/Workspace";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";

import {
  getAdminMemberList,
  getAdminMemberDetail,
  getAdminClassList,
} from "../../api/adminApi";
import { getClassDetail } from "../../api/classApi";

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

        const searchType =
          trimmedKeyword.includes("@") || trimmedKeyword.includes(".")
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
              {["번호", "이름", "이메일", "권한", "관리"].map((label) => (
                <th
                  key={label}
                  className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]"
                >
                  {label}
                </th>
              ))}
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

// 관리자 클래스 관리
function AdminClassManagement() {
  const [classes, setClasses] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 관리자 클래스 목록 조회
  useEffect(() => {
    let cancelled = false;

    const fetchClasses = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getAdminClassList({
          keyword: search,
          page,
          size: 10,
        });

        const data = unwrapResponse(response);

        if (cancelled) return;

        setClasses(data?.dtoList ?? []);
        setTotalCount(data?.totalCount ?? 0);
        setPages(Math.max(1, data?.totalPage ?? 1));
      } catch (err) {
        if (cancelled) return;

        setClasses([]);
        setTotalCount(0);
        setPages(1);
        setError(
          err.response?.data?.message ||
            "클래스 목록을 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchClasses();

    return () => {
      cancelled = true;
    };
  }, [page, search]);

  // 검색
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(keyword.trim());
    setDetail(null);
  };

  // 클래스 상세 조회
  const handleDetail = async (clsNo) => {
    setError("");

    try {
      const response = await getClassDetail(clsNo);
      const data = unwrapResponse(response);

      setDetail(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "클래스 상세 정보를 불러오지 못했습니다.",
      );
    }
  };

  const detailLabels = {
    clsNo: "클래스 번호",
    clsName: "클래스명",
    catName: "카테고리",
    instructorName: "강사",
    maxCapacity: "정원",
    rating: "평점",
    clsPrice: "수강료",
    clsDesc: "클래스 설명",
    clsRoadAddr: "도로명 주소",
    clsDetailAddr: "상세 주소",
    clsImgOrigin: "대표 이미지",
  };

  const formatPrice = (price) =>
    price == null ? "-" : `${Number(price).toLocaleString("ko-KR")}원`;

  const formatValue = (key, value) => {
    if (value == null || value === "") return "-";
    if (key === "clsPrice") return formatPrice(value);
    if (key === "rating") return Number(value).toFixed(1);

    return String(value);
  };

  return (
    <Workspace kind="admin">
      <Heading
        title="클래스 관리"
        description="등록된 정보를 조회하고 관리할 수 있습니다."
      />

      <p className="text-right text-[14px] text-[#85888d]">
        전체 {totalCount}건
      </p>

      {detail && (
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          <h2 className="mb-4 font-bold text-lg">상세 정보</h2>

          {Object.entries(detail)
            .filter(([key]) => Object.hasOwn(detailLabels, key))
            .map(([key, value]) => (
              <p key={key} className="mb-3 break-words">
                <strong>{detailLabels[key]}</strong>:{" "}
                {key === "clsImgOrigin" && value ? (
                  <span className="block mt-2">
                    <img
                      src={
                        value.startsWith("http")
                          ? value
                          : `http://localhost:8080${value}`
                      }
                      alt="클래스 대표 이미지"
                      className="max-w-xs max-h-64 rounded-lg object-cover"
                    />
                  </span>
                ) : (
                  formatValue(key, value)
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
              {["번호", "클래스명", "강사", "카테고리", "가격", "관리"].map(
                (label) => (
                  <th
                    key={label}
                    className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]"
                  >
                    {label}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {!loading &&
              classes.map((item) => (
                <tr key={item.clsNo}>
                  <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    {item.clsNo}
                  </td>
                  <td className="text-left py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    <Link
                      className="text-[#d97215]"
                      to={`/class/${item.clsNo}`}
                    >
                      {item.clsName}
                    </Link>
                  </td>
                  <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    {item.instructorName || "-"}
                  </td>
                  <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    {item.catName || "-"}
                  </td>
                  <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    {formatPrice(item.clsPrice)}
                  </td>
                  <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    <button
                      type="button"
                      className="border-0 bg-transparent text-[#e47719] px-2 py-[3px]"
                      onClick={() => handleDetail(item.clsNo)}
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
          클래스 정보를 불러오는 중입니다.
        </p>
      )}

      {!loading && !error && classes.length === 0 && (
        <Empty>조회된 정보가 없습니다.</Empty>
      )}

      <form
        className="flex justify-center gap-3 mt-6 mb-6 [zoom:0.9]"
        onSubmit={handleSearch}
      >
        <input
          aria-label="클래스 관리 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="클래스명 / 강사 / 카테고리 검색"
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

  if (kind === "members") {
    return <AdminMemberManagement />;
  }

  return <AdminClassManagement />;
}
