import { useCallback, useEffect, useState } from "react";
import { Workspace } from "../../components/common/Workspace";
import {
  getAdminInstructorList,
  getAdminInstructorDocuments,
  getAdminInstructorDocument,
  updateAdminInstructorStatus,
} from "../../api/adminApi";
import Pagination from "../../components/common/Pagination";

const statusLabels = {
  NEW: "검토 대기",
  APPROVED: "승인 완료",
  REJECTED: "반려",
};

const statusStyles = {
  NEW: "bg-[#fff0df] text-[#e87512]",
  APPROVED: "bg-[#e8f7ed] text-[#27834b]",
  REJECTED: "bg-[#fff0f0] text-[#d84a4a]",
};

// API 응답에서 목록 데이터 추출
const getListData = (response) => {
  const data = response?.data ?? response;
  return Array.isArray(data) ? data : [];
};

export default function AdminInstructorPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [processing, setProcessing] = useState(false);

  // 신청 상태 필터
  const [selectedStatus, setSelectedStatus] = useState("ALL");

// 신청 목록 조회
const fetchRequests = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    const response = await getAdminInstructorList({
      page,
      size: 10,
    });

    // 응답 구조 확인 및 데이터 추출
    const data = response?.data ?? response;

    setRequests(data?.dtoList ?? []);
    setTotalPage(data?.totalPage ?? 1);
    setTotalCount(data?.totalCount ?? 0);
    setPage(data?.currentPage ?? page);
  } catch (err) {
    console.error("강사 신청 목록 조회 실패:", err);
    setError(
      err.response?.data?.message ||
        "강사 신청 목록을 불러오지 못했습니다.",
    );
  } finally {
    setLoading(false);
  }
}, [page]);

useEffect(() => {
  fetchRequests();
}, [fetchRequests]);

useEffect(() => {
  fetchRequests();
}, [fetchRequests]);

  // 신청 상세 및 증빙자료 조회
  const handleViewDetail = async (request) => {
    setSelectedRequest(request);
    setDocuments([]);
    setRejectReason("");
    setRejectError("");
    setDetailError("");
    setDocumentsLoading(true);

    try {
      const response = await getAdminInstructorDocuments(request.reqNo);
      setDocuments(getListData(response));
    } catch (err) {
      console.error("증빙자료 조회 실패:", err);
      setDetailError(
        err.response?.data?.message ||
          "증빙자료를 불러오지 못했습니다.",
      );
    } finally {
      setDocumentsLoading(false);
    }
  };

  // 증빙자료 파일 조회
  const handleOpenDocument = async (document) => {
    if (!selectedRequest || !document.docNo) return;

    // 비동기 요청 전에 새 탭을 열어 팝업 차단 방지
    const newWindow = window.open("", "_blank");

    if (!newWindow) {
      setDetailError("팝업이 차단되었습니다. 팝업을 허용해 주세요.");
      return;
    }

    try {
      setDetailError("");

      // 관리자 인증이 적용된 파일 조회 API 호출
      const file = await getAdminInstructorDocument(
        selectedRequest.reqNo,
        document.docNo,
      );

      // 파일 데이터를 브라우저에서 열 수 있는 URL로 변환
      const fileUrl = URL.createObjectURL(file);

      newWindow.location.href = fileUrl;

      // 새 탭에서 파일을 사용할 시간을 확보한 뒤 URL 정리
      newWindow.onload = () => {
        URL.revokeObjectURL(fileUrl);
      };
    } catch (err) {
      console.error("증빙자료 파일 조회 실패:", err);
      newWindow.close();

      setDetailError(
        err.response?.data?.message ||
          "증빙자료 파일을 열지 못했습니다.",
      );
    }
  };

  // 신청 승인 또는 반려
  const handleStatusChange = async (reqStatus) => {
    if (!selectedRequest || processing) return;

    if (
      reqStatus === "REJECTED" &&
      (!rejectReason.trim() || rejectReason.trim().length > 100)
    ) {
      setRejectError("반려 사유를 1~100자로 입력해 주세요.");
      return;
    }

    const action = reqStatus === "APPROVED" ? "승인" : "반려";

    if (!window.confirm(`이 강사 신청을 ${action} 처리할까요?`)) {
      return;
    }

    setProcessing(true);
    setRejectError("");
    setDetailError("");

    try {
      await updateAdminInstructorStatus(
        selectedRequest.reqNo,
        reqStatus,
        rejectReason.trim(),
      );

      setSelectedRequest(null);
      setRejectReason("");
      await fetchRequests();
    } catch (err) {
      console.error("강사 신청 상태 변경 실패:", err);
      setDetailError(
        err.response?.data?.message ||
          `${action} 처리에 실패했습니다.`,
      );
    } finally {
      setProcessing(false);
    }
  };

  const pendingCount = requests.filter(
    (request) => request.reqStatus === "NEW",
  ).length;

  const approvedCount = requests.filter(
    (request) => request.reqStatus === "APPROVED",
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.reqStatus === "REJECTED",
  ).length;

  // 선택한 상태에 맞는 신청 목록 조회
  const filteredRequests =
    selectedStatus === "ALL"
      ? requests
      : requests.filter(
          (request) => request.reqStatus === selectedStatus,
        );

  return (
    <Workspace kind="admin">
      <div className="min-w-0 text-[#252b31]">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="mb-3 text-[28px] font-bold">
            강사 신청 관리
          </h1>
          <p className="text-[15px] text-[#858b93]">
            강사 신청 내용을 확인하고 승인 및 반려를 처리할 수 있습니다.
          </p>
        </div>

        {/* 신청 현황 */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setSelectedStatus("NEW")}
            aria-pressed={selectedStatus === "NEW"}
            className={`rounded-xl border bg-white p-5 text-left transition-colors ${
              selectedStatus === "NEW"
                ? "border-[#F97316] ring-1 ring-[#F97316]"
                : "border-[#ebe2d9] hover:border-[#F97316]"
            }`}
          >
            <p className="mb-3 text-sm text-[#858b93]">
              검토 대기
            </p>
            <p className="text-2xl font-bold text-[#f4770b]">
              {pendingCount}
              <span className="ml-1 text-sm font-normal text-[#858b93]">
                건
              </span>
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus("APPROVED")}
            aria-pressed={selectedStatus === "APPROVED"}
            className={`rounded-xl border bg-white p-5 text-left transition-colors ${
              selectedStatus === "APPROVED"
                ? "border-[#F97316] ring-1 ring-[#F97316]"
                : "border-[#ebe2d9] hover:border-[#F97316]"
            }`}
          >
            <p className="mb-3 text-sm text-[#858b93]">
              승인 완료
            </p>
            <p className="text-2xl font-bold text-[#27834b]">
              {approvedCount}
              <span className="ml-1 text-sm font-normal text-[#858b93]">
                건
              </span>
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus("REJECTED")}
            aria-pressed={selectedStatus === "REJECTED"}
            className={`rounded-xl border bg-white p-5 text-left transition-colors ${
              selectedStatus === "REJECTED"
                ? "border-[#F97316] ring-1 ring-[#F97316]"
                : "border-[#ebe2d9] hover:border-[#F97316]"
            }`}
          >
            <p className="mb-3 text-sm text-[#858b93]">
              반려
            </p>
            <p className="text-2xl font-bold text-[#d84a4a]">
              {rejectedCount}
              <span className="ml-1 text-sm font-normal text-[#858b93]">
                건
              </span>
            </p>
          </button>
        </div>

        {/* 신청 목록 */}
        <div className="overflow-hidden rounded-xl border border-[#ebe2d9] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebe2d9] px-5 py-5">
            <div>
              <h2 className="text-xl font-bold">
                강사 신청 목록
              </h2>
              <p className="mt-2 text-sm text-[#858b93]">
                총 {filteredRequests.length}건의 신청이 있습니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* 전체 보기 */}
              <button
                type="button"
                onClick={() => setSelectedStatus("ALL")}
                aria-pressed={selectedStatus === "ALL"}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  selectedStatus === "ALL"
                    ? "bg-[#F97316] text-white"
                    : "border border-[#ebe2d9] text-[#F97316] hover:bg-[#fff5eb]"
                }`}
              >
                전체 보기
              </button>

              {/* 새로고침 */}
              <button
                type="button"
                onClick={fetchRequests}
                disabled={loading}
                className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#F97316] transition-colors hover:bg-[#fff5eb] hover:text-[#ea580c] disabled:opacity-50"
              >
                새로고침
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-[#858b93]">
              신청 목록을 불러오는 중입니다.
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="mb-4 text-sm text-[#d84a4a]">
                {error}
              </p>
              <button
                type="button"
                onClick={fetchRequests}
                className="rounded-lg bg-[#f97316] px-4 py-2 text-sm font-semibold text-white"
              >
                다시 시도
              </button>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#858b93]">
              {requests.length === 0
                ? "등록된 강사 신청이 없습니다."
                : "선택한 상태의 강사 신청이 없습니다."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-[#faf8f5] text-[#777e86]">
                  <tr>
                    <th className="px-5 py-4 font-medium">
                      번호
                    </th>
                    <th className="px-5 py-4 font-medium">
                      신청 회원
                    </th>
                    <th className="px-5 py-4 font-medium">
                      이메일
                    </th>
                    <th className="px-5 py-4 font-medium">
                      신청 상태
                    </th>
                    <th className="px-5 py-4 text-center font-medium">
                      관리
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.reqNo}
                      className="border-t border-[#f0ece7] hover:bg-[#fffdfa]"
                    >
                      <td className="px-5 py-4">
                        {request.reqNo}
                      </td>
                      <td className="px-5 py-4 font-medium">
                        {request.memNickname ||
                          `회원 ${request.memNo}`}
                      </td>
                      <td className="px-5 py-4 text-[#555b63]">
                        {request.memEmail || "-"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[request.reqStatus] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {statusLabels[request.reqStatus] ||
                            request.reqStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleViewDetail(request)}
                          className="rounded-lg border border-[#f5c9a5] px-3 py-2 text-xs font-semibold text-[#e87512] hover:bg-[#fff5eb]"
                        >
                          상세 보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 페이지네이션 */}
          <Pagination
            page={page}
            pages={totalPage}
            onChange={setPage}
          />
          
        </div>

        {/* 신청 상세 모달 */}
        {selectedRequest && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 pt-36 pb-4"
            onClick={(e) => {
              if (e.target === e.currentTarget && !processing) {
                setSelectedRequest(null);
              }
            }}
          >
            <div className="max-h-[calc(100dvh-10rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
              <div className="sticky top-0 flex items-center justify-between border-b border-[#ebe6e0] bg-white px-6 py-5">
                <div>
                  <h2 className="text-xl font-bold">
                    강사 신청
                  </h2>
                </div>
              </div>

              <div className="space-y-6 p-6">
                {detailError && (
                  <p
                    role="alert"
                    className="rounded-lg bg-[#fff0f0] px-3 py-3 text-sm text-[#d84a4a]"
                  >
                    {detailError}
                  </p>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs text-[#858b93]">
                      신청 회원
                    </p>
                    <p className="font-semibold">
                      {selectedRequest.memNickname ||
                        `회원 ${selectedRequest.memNo}`}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs text-[#858b93]">
                      이메일
                    </p>
                    <p className="break-all font-medium">
                      {selectedRequest.memEmail || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs text-[#858b93]">
                      신청 상태
                    </p>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[selectedRequest.reqStatus] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {statusLabels[selectedRequest.reqStatus] ||
                        selectedRequest.reqStatus}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-bold">
                    자기소개
                  </h3>
                  <div className="whitespace-pre-wrap break-words rounded-lg bg-[#faf8f5] p-4 text-sm leading-7">
                    {selectedRequest.reqIntroduction ||
                      "작성된 내용이 없습니다."}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-bold">
                    경력 사항
                  </h3>
                  <div className="whitespace-pre-wrap break-words rounded-lg bg-[#faf8f5] p-4 text-sm leading-7">
                    {selectedRequest.reqCareer ||
                      "작성된 내용이 없습니다."}
                  </div>
                </div>

                {/* 반려 사유 */}
                {selectedRequest.reqStatus === "REJECTED" && (
                  <div>
                    <h3 className="mb-2 font-bold">반려 사유</h3>
                      <div className="whitespace-pre-wrap break-words rounded-lg border border-[#f5d0d0] bg-[#fff5f5] p-4 text-sm leading-7 text-[#b93838]">
                        {selectedRequest.rejReason}
                      </div>
                  </div>
                )}

                {/* 증빙자료 */}
                <div>
                  <h3 className="mb-3 font-bold">
                    제출 증빙자료
                  </h3>

                  {documentsLoading ? (
                    <p className="text-sm text-[#858b93]">
                      증빙자료를 불러오는 중입니다.
                    </p>
                  ) : documents.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-[#e5e7eb] p-5 text-center text-sm text-[#858b93]">
                      등록된 증빙자료가 없습니다.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {documents.map((document, index) => {
                        const fileName =
                          document.docName ||
                          document.originalFileName ||
                          document.fileName ||
                          `증빙자료 ${index + 1}`;

                        return (
                          <div
                            key={document.docNo ?? index}
                            className="flex items-start gap-3 rounded-lg border border-[#ebe6e0] p-4"
                          >
                            <span className="text-xl">📎</span>
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenDocument(document)
                                }
                                className="break-all text-left text-sm font-medium !text-[#F97316] !bg-transparent hover:!text-[#EA580C] hover:!bg-transparent"
                              >
                                {fileName}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 승인 및 반려 */}
                {selectedRequest.reqStatus === "NEW" ? (
                  <div className="border-t border-[#ebe6e0] pt-5">
                    <label
                      htmlFor="rejectReason"
                      className="mb-2 block text-sm font-semibold"
                    >
                      반려 사유
                    </label>

                    <textarea
                      id="rejectReason"
                      value={rejectReason}
                      onChange={(e) => {
                        setRejectReason(e.target.value);
                        setRejectError("");
                      }}
                      maxLength={100}
                      rows={3}
                      placeholder="반려 사유를 입력해 주세요. (최대 100자)"
                      className="w-full resize-none rounded-lg border border-[#ded8d1] p-3 text-sm outline-none focus:border-[#f97316]"
                    />

                    <p className="mt-1 text-right text-xs text-[#858b93]">
                      {rejectReason.length}/100
                    </p>

                    {/* 반려 사유 경고를 입력창 아래에 표시 */}
                    {rejectError && (
                      <p
                        role="alert"
                        className="mt-3 rounded-lg bg-[#fff0f0] px-3 py-3 text-sm text-[#d84a4a]"
                      >
                        {rejectError}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap justify-end gap-3">
                      <button
                        type="button"
                        disabled={processing}
                        onClick={() =>
                          handleStatusChange("REJECTED")
                        }
                        className="rounded-lg border border-[#e6aaaa] px-5 py-3 text-sm font-semibold text-[#c83e3e] hover:bg-[#fff5f5] disabled:opacity-50"
                      >
                        {processing ? "처리 중..." : "반려"}
                      </button>

                      <button
                        type="button"
                        disabled={processing}
                        onClick={() =>
                          handleStatusChange("APPROVED")
                        }
                        className="rounded-lg bg-[#f97316] px-5 py-3 text-sm font-semibold text-white hover:bg-[#ea6a0c] disabled:opacity-50"
                      >
                        {processing ? "처리 중..." : "승인"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="border-t border-[#ebe6e0] pt-4 text-sm text-[#858b93]">
                    이미 처리된 신청입니다. 승인 또는 반려 처리를 다시 할 수 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Workspace>
  );
}