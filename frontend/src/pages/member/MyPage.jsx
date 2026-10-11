import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useStore } from "../../mocks/data";
import {
  getMember,
  updateMember,
  updatePassword,
  updateProfileImage,
  checkWithdrawal,
  deleteMember,
} from "../../api/memberApi";
import {
  applyInstructor,
  getInstructorRequestByMemNo,
  uploadInstructorDocument,
} from "../../api/instructorApi";
import { getCookie, removeCookie } from "../../util/cookieUtil";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";
import { Workspace } from "../../components/common/Workspace";

const SERVER_URL = "http://localhost:8080";
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/;
const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

// API 응답 데이터 확인
const getResponseData = (response) => {
  return response?.data?.data ?? response?.data ?? response;
};

// 전화번호 형식 변환
const formatPhone = (phone) => {
  if (!phone) return "";

  const numbers = phone.replace(/\D/g, "");

  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  if (numbers.length === 10) {
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  return phone;
};

// 회원 정보 응답을 화면에서 사용하는 형태로 변환
const toMemberProfile = (data) => ({
  email: data.memEmail || "",
  nickname: data.memNickname || "",
  phone: data.memPhone || "",
  address: data.memAddress || "",
  detail: data.memAddressDetail || "",
  img: data.memImg || "",
  memPwUpdate: data.memPwUpdate || null,
  memCreatedAt: data.memCreatedAt || null,
});

// 비밀번호 변경일 기준 90일 경과 여부 확인
const isPasswordExpired = (profile) => {
  const passwordDate = profile.memPwUpdate || profile.memCreatedAt;

  if (!passwordDate) return false;

  const updatedAt = new Date(passwordDate);

  if (Number.isNaN(updatedAt.getTime())) return false;

  return Date.now() - updatedAt.getTime() >= NINETY_DAYS;
};

// 강사 신청 상태 표시
const getInstructorStatus = (status) => {
  switch (status) {
    case "NEW":
      return "관리자 검토 중";
    case "APPROVED":
      return "승인 완료";
    case "REJECTED":
      return "신청 반려";
    default:
      return status || "상태 확인 중";
  }
};

export default function MyPage({ instructor = false, edit = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [role] = useStore("role", "PUBLIC");

  // 강사 권한 확인
  const isInstructor = instructor || role === "INSTRUCTOR";

  const [profile, setProfile] = useState({
    email: "",
    nickname: "",
    phone: "",
    address: "",
    detail: "",
    img: "",
    memPwUpdate: null,
    memCreatedAt: null,
  });

  const [form, setForm] = useState({
    email: "",
    nickname: "",
    phone: "",
    address: "",
    detail: "",
    img: "",
  });

  // 비밀번호 입력 상태
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 백엔드에서 조회한 강사 신청 정보
  const [request, setRequest] = useState(null);

  // 강사 신청 화면 상태
  const [applying, setApplying] = useState(false);
  const [submittingApplication, setSubmittingApplication] = useState(false);
  const [introduction, setIntroduction] = useState("");
  const [career, setCareer] = useState("");

  // 증빙 서류는 각각 한 파일씩 선택
  const [certificateFile, setCertificateFile] = useState(null);
  const [careerFile, setCareerFile] = useState(null);
  const [otherFile, setOtherFile] = useState(null);

  // 회원 탈퇴 상태
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);
  const [withdrawalCheck, setWithdrawalCheck] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [checkingWithdrawal, setCheckingWithdrawal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const fileInputRef = useRef(null);

  const base = isInstructor
    ? "/instructor/mypage"
    : "/member/mypage";

  // 비밀번호 입력 초기화
  const resetPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // 회원 정보 조회
  const fetchMember = async (memNo) => {
    const response = await getMember(memNo);
    const data = getResponseData(response);
    const memberProfile = toMemberProfile(data);

    setProfile(memberProfile);

    setForm({
      email: memberProfile.email,
      nickname: memberProfile.nickname,
      phone: memberProfile.phone,
      address: memberProfile.address,
      detail: memberProfile.detail,
      img: memberProfile.img,
    });

    return memberProfile;
  };

  // 강사 신청 정보 조회
  const fetchInstructorRequest = async (memNo) => {
    try {
      const response = await getInstructorRequestByMemNo(memNo);
      const data = getResponseData(response);

      setRequest(data || null);
    } catch (error) {
      // 신청 내역이 없는 경우에는 신청 버튼 표시
      if (error.response?.status === 404) {
        setRequest(null);
        return;
      }

      console.error("강사 신청 정보 조회 실패:", error);
      setRequest(null);
    }
  };

  // 페이지 이동 시 기존 메시지 제거
  useEffect(() => {
    setMessage("");
  }, [location.pathname]);

  // 회원 정보 및 강사 신청 정보 최초 조회
  useEffect(() => {
    const loadMember = async () => {
      try {
        const member = getCookie("member");

        if (!member?.memNo) {
          console.error("회원 번호가 없습니다.");
          setMessage("회원 정보를 확인할 수 없습니다. 다시 로그인해 주세요.");
          return;
        }

        await fetchMember(member.memNo);

        // 일반 회원 마이페이지에서만 강사 신청 내역 조회
        if (!isInstructor) {
          await fetchInstructorRequest(member.memNo);
        }
      } catch (error) {
        console.error("회원 정보 조회 실패:", error);
        setMessage("회원 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [isInstructor]);

  // 프로필 이미지 주소
  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    return `${SERVER_URL}${imagePath}`;
  };

  // 프로필 이미지 선택창
  const handleProfileImageClick = () => {
    if (!edit || saving) return;

    fileInputRef.current?.click();
  };

  // 프로필 이미지 업로드
  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage(
        "JPG, PNG, WEBP 형식의 이미지만 업로드할 수 있습니다."
      );

      e.target.value = "";
      return;
    }

    try {
      const member = getCookie("member");

      if (!member?.memNo) {
        setMessage("회원 번호가 없습니다.");
        return;
      }

      await updateProfileImage(member.memNo, file);
      await fetchMember(member.memNo);

      // 이미지 업로드 성공 시 기존 메시지 제거
      setMessage("");
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      setMessage("프로필 이미지 업로드에 실패했습니다.");
    } finally {
      e.target.value = "";
    }
  };

  // 회원 정보 및 비밀번호 수정
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    const phone = form.phone.replace(/\D/g, "");
    const address = form.address.trim();

    // 주소 또는 핸드폰이 비어 있는지 확인
    if (!phone || !address) {
      setMessage("주소와 핸드폰 번호를 입력해 주세요.");
      return;
    }

    // 전화번호 확인
    if (phone.length !== 11 || !phone.startsWith("010")) {
      setMessage(
        "전화번호는 010으로 시작하는 11자리 숫자를 입력해주세요."
      );
      return;
    }

    // 비밀번호 변경 입력 여부 확인
    const hasCurrentPassword = currentPassword.length > 0;
    const hasNewPassword = newPassword.length > 0;
    const hasConfirmPassword = confirmPassword.length > 0;

    const wantsPasswordChange =
      hasCurrentPassword || hasNewPassword || hasConfirmPassword;

    // 세 칸 모두 비어 있으면 비밀번호 변경을 생략
    if (wantsPasswordChange) {
      if (
        !hasCurrentPassword ||
        !hasNewPassword ||
        !hasConfirmPassword
      ) {
        setMessage(
          "비밀번호를 변경하려면 현재 비밀번호, 새 비밀번호, 비밀번호 확인을 모두 입력해 주세요."
        );
        return;
      }

      // 새 비밀번호 형식 확인
      if (!PASSWORD_REGEX.test(newPassword)) {
        setMessage(
          "새 비밀번호는 영문과 숫자를 포함하여 8~20자로 입력해 주세요."
        );
        return;
      }

      // 새 비밀번호와 확인 값 일치 여부 확인
      if (newPassword !== confirmPassword) {
        setMessage(
          "새 비밀번호와 비밀번호 확인이 일치하지 않습니다."
        );
        return;
      }

      // 기존 비밀번호와 새 비밀번호가 같은지 확인
      if (currentPassword === newPassword) {
        setMessage(
          "현재 비밀번호와 다른 비밀번호를 입력해 주세요."
        );
        return;
      }
    }

    setMessage("");

    try {
      setSaving(true);

      const member = getCookie("member");

      if (!member?.memNo) {
        setMessage("회원 번호가 없습니다. 다시 로그인해 주세요.");
        return;
      }

      // 비밀번호를 변경하는 경우에만 비밀번호 변경 API 호출
      if (wantsPasswordChange) {
        await updatePassword(member.memNo, {
          currentPassword,
          newPassword,
        });
      }

      // 회원 정보 수정
      await updateMember(member.memNo, {
        memNickname: form.nickname,
        memPhone: phone,
        memAddress: address,
        memAddressDetail: form.detail,
        memImg: form.img || null,
      });

      // 변경된 회원 정보를 다시 조회
      await fetchMember(member.memNo);

      // 비밀번호 입력값 초기화
      resetPasswordFields();

      // 저장 후 마이페이지로 이동
      navigate(base);
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);

      const status = error.response?.status;
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.data?.message;

      if (status === 401 || status === 403) {
        setMessage(
          serverMessage ||
            "현재 비밀번호를 확인하거나 다시 로그인해 주세요."
        );
      } else {
        setMessage(
          serverMessage ||
            "회원 정보 수정에 실패했습니다. 입력값을 확인해 주세요."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // 강사 신청 화면 닫기
  const handleCancelApplication = () => {
    setApplying(false);
    setIntroduction("");
    setCareer("");
    setCertificateFile(null);
    setCareerFile(null);
    setOtherFile(null);
    setMessage("");
  };

  // 강사 신청
  const handleInstructorApplication = async (e) => {
    e.preventDefault();

    if (submittingApplication) return;

    const trimmedIntroduction = introduction.trim();
    const trimmedCareer = career.trim();

    // 필수 항목 확인
    if (!trimmedIntroduction || !certificateFile || !careerFile) {
      setMessage(
        "자기소개, 자격증, 경력증명서는 필수 항목입니다. 모두 입력하거나 파일을 첨부해 주세요."
      );
      return;
    }

    const member = getCookie("member");

    if (!member?.memNo) {
      setMessage("회원 번호가 없습니다. 다시 로그인해 주세요.");
      return;
    }

    setMessage("");
    setSubmittingApplication(true);

    let reqNo = null;

    try {
      // 강사 신청 정보 등록
      const response = await applyInstructor(member.memNo, {
        reqIntroduction: trimmedIntroduction,
        reqCareer: trimmedCareer,
      });

      const result = getResponseData(response);

      // 신청 API는 신청 번호를 반환
      reqNo =
        typeof result === "number"
          ? result
          : Number(result?.reqNo ?? result);

      if (!Number.isFinite(reqNo) || reqNo <= 0) {
        throw new Error("강사 신청 번호를 확인할 수 없습니다.");
      }

      // 신청 번호를 먼저 저장해 중복 신청 방지
      setRequest({
        reqNo,
        memNo: member.memNo,
        reqIntroduction: trimmedIntroduction,
        reqCareer: trimmedCareer,
        reqStatus: "NEW",
      });

      // 선택한 서류를 각각 한 개씩 업로드
      await uploadInstructorDocument(reqNo, certificateFile);
      await uploadInstructorDocument(reqNo, careerFile);

      if (otherFile) {
        await uploadInstructorDocument(reqNo, otherFile);
      }

      setApplying(false);
      setIntroduction("");
      setCareer("");
      setCertificateFile(null);
      setCareerFile(null);
      setOtherFile(null);
      setMessage("");
    } catch (error) {
      console.error("강사 신청 실패:", error);

      if (reqNo) {
        // 신청 정보는 등록됐으나 서류 업로드가 실패한 경우
        setApplying(false);
        setMessage(
          "강사 신청 정보는 등록되었지만 서류 업로드 중 오류가 발생했습니다. 관리자에게 확인해 주세요."
        );
      } else {
        const serverMessage =
          error.response?.data?.message ||
          error.response?.data?.data?.message;

        setMessage(
          serverMessage ||
            "강사 신청에 실패했습니다. 입력 내용을 확인해 주세요."
        );
      }
    } finally {
      setSubmittingApplication(false);
    }
  };

  // 회원 탈퇴 가능 여부 확인
  const handleCheckWithdrawal = async () => {
    if (checkingWithdrawal || withdrawing) return;

    const member = getCookie("member");

    if (!member?.memNo) {
      setMessage("회원 번호가 없습니다. 다시 로그인해 주세요.");
      return;
    }

    setMessage("");
    setCheckingWithdrawal(true);

    try {
      const response = await checkWithdrawal(member.memNo);
      const result = getResponseData(response);

      setWithdrawalCheck(result);

      if (result?.canWithdraw === false) {
        setWithdrawalOpen(false);
        setMessage(
          result.message ||
            "현재 진행 중이거나 예정된 예약·클래스가 있어 탈퇴할 수 없습니다."
        );
        return;
      }

      if (result?.canWithdraw === true) {
        setAgreedToTerms(false);
        setWithdrawalOpen(true);
        return;
      }

      setMessage(
        result?.message ||
          "회원 탈퇴 가능 여부를 확인하지 못했습니다. 다시 시도해 주세요."
      );
    } catch (error) {
      console.error("회원 탈퇴 가능 여부 확인 실패:", error);

      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.data?.message;

      setMessage(
        serverMessage ||
          "회원 탈퇴 가능 여부를 확인하지 못했습니다. 다시 시도해 주세요."
      );
    } finally {
      setCheckingWithdrawal(false);
    }
  };

  // 회원 탈퇴 취소
  const handleCancelWithdrawal = () => {
    setWithdrawalOpen(false);
    setWithdrawalCheck(null);
    setAgreedToTerms(false);
  };

  // 회원 탈퇴
  const handleWithdrawal = async () => {
    if (withdrawing) return;

    if (!agreedToTerms) {
      setMessage("회원 탈퇴 약관에 동의해 주세요.");
      return;
    }

    const member = getCookie("member");

    if (!member?.memNo) {
      setMessage("회원 번호가 없습니다. 다시 로그인해 주세요.");
      return;
    }

    // 최종 탈퇴 확인
    const confirmed = window.confirm(
      "정말로 탈퇴하시겠습니까? 탈퇴 후에는 계정을 복구할 수 없습니다."
    );

    if (!confirmed) return;

    setMessage("");
    setWithdrawing(true);

    try {
      await deleteMember(member.memNo);

      // 탈퇴 성공 시 로그인 쿠키 삭제
      removeCookie("member");

      setWithdrawalOpen(false);
      setWithdrawalCheck(null);
      setAgreedToTerms(false);

      window.alert("회원 탈퇴가 완료되었습니다.");

      navigate("/");
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);

      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.data?.message;

      setMessage(
        serverMessage ||
          "회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <Workspace kind={isInstructor ? "instructor" : "member"}>
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          회원 정보를 불러오는 중입니다.
        </section>
      </Workspace>
    );
  }

  return (
    <Workspace kind={isInstructor ? "instructor" : "member"}>
      {!edit && isPasswordExpired(profile) && (
        <div
          className="mb-[20px] flex items-start gap-3 rounded-lg border border-red-300 border-l-4 border-l-red-600 bg-red-50 px-[17px] py-[16px] text-red-800"
          role="alert"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3m0 4h.01M10.3 3.86 2.6 17.2A2 2 0 0 0 4.33 20h15.34a2 2 0 0 0 1.73-2.8L13.7 3.86a2 2 0 0 0-3.4 0Z"
              />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <p className="font-bold text-red-800">
                비밀번호 변경이 필요합니다
              </p>

              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                보안 경고
              </span>
            </div>

            <p className="text-[14px] leading-[1.7] text-red-700">
              비밀번호 변경 후 90일이 경과했습니다.
              계정 보안을 위해 비밀번호를 변경해 주세요.
            </p>
          </div>
        </div>
      )}

      <Heading
        title={
          edit
            ? "내 정보 수정"
            : isInstructor
              ? "강사 마이페이지"
              : "마이페이지"
        }
        description="내 정보를 확인하고 클래스 활동을 관리하세요."
      />

      <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
        <div className="flex items-center gap-[22px] mb-[29px]">
          {/* 프로필 사진 */}
          <div
            className={`group relative w-[84px] h-[84px] rounded-full bg-[#ffead5] text-[#ee7c1e] grid place-items-center text-[31px] overflow-hidden ${
              edit ? "cursor-pointer" : "cursor-default"
            }`}
            title={edit ? "프로필 사진 변경" : "프로필 사진"}
            onClick={handleProfileImageClick}
          >
            {profile.img ? (
              <img
                src={getProfileImageUrl(profile.img)}
                alt="프로필 사진"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{profile.nickname?.[0] || ""}</span>
            )}

            {edit && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-white text-[12px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                사진 변경
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleProfileImageChange}
            />
          </div>

          <div>
            <h3>{profile.nickname}</h3>
            <p>
              {isInstructor ? "강사" : "회원"} · {profile.email}
            </p>
          </div>
        </div>

        {edit ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-0">
              {/* 이메일 */}
              <Field
                label="이메일"
                type="email"
                required
                disabled
                value={form.email}
                className="bg-[#f5f5f5] text-[#888] cursor-default"
              />

              {/* 닉네임 */}
              <Field
                label="닉네임"
                type="text"
                required
                disabled
                value={form.nickname}
                className="bg-[#f5f5f5] text-[#888] cursor-default"
              />

              {/* 핸드폰 */}
              <Field
                label="핸드폰"
                type="tel"
                required
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/\D/g, "").slice(0, 11),
                  })
                }
              />

              {/* 주소 */}
              <Field
                label="주소"
                type="text"
                required
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: e.target.value,
                  })
                }
              />

              {/* 상세 주소 */}
              <Field
                label="상세 주소"
                type="text"
                value={form.detail}
                onChange={(e) =>
                  setForm({
                    ...form,
                    detail: e.target.value,
                  })
                }
              />

              {/* 비밀번호 변경 */}
              <div className="mt-[25px] border-t border-[#ebe6e0] pt-[24px]">
                <h3 className="text-[18px] font-bold text-[#1f2937] mb-2">
                  비밀번호 변경
                </h3>

                <p className="text-[13px] text-[#6b7280] mb-[18px]">
                  비밀번호를 변경하지 않으려면 아래 항목을 모두 비워 두세요.
                </p>

                <Field
                  label="현재 비밀번호"
                  type="password"
                  value={currentPassword}
                  autoComplete="current-password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <Field
                  label="새 비밀번호"
                  type="password"
                  value={newPassword}
                  autoComplete="new-password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <Field
                  label="새 비밀번호 확인"
                  type="password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <p className="text-[13px] leading-[1.7] text-[#888]">
                  영문과 숫자를 포함하여 8~20자로 입력해 주세요.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
              {/* 저장 */}
              <ButtonLink
                button
                type="submit"
                secondary
                disabled={saving}
                onClick={handleSubmit}
              >
                {saving ? "저장 중..." : "저장"}
              </ButtonLink>

              {/* 취소 */}
              <ButtonLink
                secondary
                to={base}
                onClick={() => {
                  setForm({
                    email: profile.email,
                    nickname: profile.nickname,
                    phone: profile.phone,
                    address: profile.address,
                    detail: profile.detail,
                    img: profile.img,
                  });

                  resetPasswordFields();
                  setMessage("");
                }}
              >
                취소
              </ButtonLink>
            </div>
          </form>
        ) : (
          <>
            <dl className="grid grid-cols-[150px_1fr] gap-[17px] my-[26px] max-md:grid-cols-[120px_1fr] max-[420px]:grid-cols-[100px_minmax(0,1fr)]">
              {[
                ["이메일", profile.email],
                ["닉네임", profile.nickname],
                ["핸드폰", formatPhone(profile.phone)],
                [
                  "주소",
                  `${profile.address || ""} ${profile.detail || ""}`.trim(),
                ],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "contents" }}>
                  <dt className="text-[#888]">{k}</dt>
                  <dd className="m-0 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>

            {/* 내 정보 수정 */}
            <div className="flex justify-end">
              <ButtonLink to={`${base}/edit`}>
                내 정보 수정
              </ButtonLink>
            </div>
          </>
        )}
      </section>

      {/* 강사 신청 */}
      {!isInstructor && !edit && (
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          <Heading
            title="강사 신청"
            description="당신의 경험을 새로운 배움으로 나눠주세요."
          />

          {request ? (
            <>
              <span className="inline-block px-3 py-[3px] rounded-[24px] bg-[#fff0df] text-[#df700e] text-[13px] font-bold">
                {getInstructorStatus(request.reqStatus)}
              </span>

              <p className="mt-3">
                자기소개: {request.reqIntroduction || ""}
              </p>

              <p className="mt-3">
                강의 경력 및 활동 이력: {request.reqCareer || ""}
              </p>
            </>
          ) : applying ? (
            <form onSubmit={handleInstructorApplication}>
              {/* 자기소개 */}
              <Field
                label={
                  <>
                    자기소개{" "}
                    <span className="font-bold text-[#DF700E]">(*필수)</span>
                  </>
                }
              >
                <textarea
                  rows={6}
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="강사로서 자신을 소개해 주세요."
                  className="w-full min-h-[150px] resize-y rounded-lg border border-[#e5ddd5] px-4 py-3 text-[15px] leading-[1.7] outline-none focus:border-[#f97316]"
                />
              </Field>

              {/* 강의 경력 및 활동 이력 */}
              <Field label="강의 경력 및 활동 이력">
                <textarea
                  rows={6}
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  placeholder="관련 경력, 강의 경험 및 활동 이력을 작성해 주세요."
                  className="w-full min-h-[150px] resize-y rounded-lg border border-[#e5ddd5] px-4 py-3 text-[15px] leading-[1.7] outline-none focus:border-[#f97316]"
                />
              </Field>

              {/* 자격증 */}
              <Field
                label={
                  <>
                    자격증{" "}
                    <span className="font-bold text-[#DF700E]">(*필수)</span>
                  </>
                }
              >
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setCertificateFile(e.target.files?.[0] || null)
                  }
                  className="block w-full rounded-lg border border-[#e5ddd5] bg-white px-3 py-2 text-[13px] file:mr-3 file:rounded-md file:border-0 file:bg-[#fff0df] file:px-3 file:py-1.5 file:font-semibold file:text-[#df700e]"
                />

                {certificateFile && (
                  <p className="mt-1.5 break-all text-[12px] text-[#6b7280]">
                    {certificateFile.name}
                  </p>
                )}
              </Field>

              {/* 경력증명서 */}
              <Field
                label={
                  <>
                    경력증명서{" "}
                    <span className="font-bold text-[#DF700E]">(*필수)</span>
                  </>
                }
              >
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setCareerFile(e.target.files?.[0] || null)
                  }
                  className="block w-full rounded-lg border border-[#e5ddd5] bg-white px-3 py-2 text-[13px] file:mr-3 file:rounded-md file:border-0 file:bg-[#fff0df] file:px-3 file:py-1.5 file:font-semibold file:text-[#df700e]"
                />

                {careerFile && (
                  <p className="mt-1.5 break-all text-[12px] text-[#6b7280]">
                    {careerFile.name}
                  </p>
                )}
              </Field>

              {/* 기타 서류 */}
              <Field label="기타 서류">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setOtherFile(e.target.files?.[0] || null)
                  }
                  className="block w-full rounded-lg border border-[#e5ddd5] bg-white px-3 py-2 text-[13px] file:mr-3 file:rounded-md file:border-0 file:bg-[#fff0df] file:px-3 file:py-1.5 file:font-semibold file:text-[#df700e]"
                />

                {otherFile && (
                  <p className="mt-1.5 break-all text-[12px] text-[#6b7280]">
                    {otherFile.name}
                  </p>
                )}
              </Field>

              <p className="text-[13px] leading-[1.8] text-[#999]">
                PDF, JPG, JPEG, PNG 파일을 업로드할 수 있습니다.
                자기소개, 자격증, 경력증명서는 필수이며 기타 서류는 선택 사항입니다.
              </p>

              {/* 버튼은 오른쪽 끝에 나란히 배치 */}
              <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
                <button
                  type="submit"
                  disabled={submittingApplication}
                  className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  {submittingApplication ? "신청 중..." : "신청 완료"}
                </button>

                <button
                  type="button"
                  disabled={submittingApplication}
                  className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                  onClick={handleCancelApplication}
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
              onClick={() => setApplying(true)}
            >
              강사 신청하기
            </button>
          )}
        </section>
      )}

      {message && (
        <p
          className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[16px]"
          role="alert"
        >
          {message}
        </p>
      )}

      {/* 회원 탈퇴 버튼 */}
      {!edit && (
        <div className="flex justify-end mb-[26px]">
          <button
            type="button"
            disabled={checkingWithdrawal || withdrawing}
            className="bg-transparent border-0 p-[7px] text-[#b75b46] cursor-pointer disabled:opacity-50"
            onClick={handleCheckWithdrawal}
          >
            {checkingWithdrawal ? "탈퇴 가능 여부 확인 중..." : "회원 탈퇴"}
          </button>
        </div>
      )}

      {/* 회원 탈퇴 모달 */}
      {withdrawalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="withdrawal-title"
        >
          <section className="w-full max-w-[520px] rounded-xl bg-white p-6 shadow-xl max-md:p-[18px]">
            {/* 기존 모달 제목 유지 */}
            <h2
              id="withdrawal-title"
              className="mb-4 text-xl font-bold text-[#1f2937]"
            >
              회원 탈퇴
            </h2>

            {/* 기존 경고 안내 문구 유지 */}
            <p className="mb-4 text-[14px] leading-[1.8] text-[#4b5563]">
              탈퇴하면 계정에 연결된 개인정보가 삭제되며, 탈퇴 후에는
              계정을 복구할 수 없습니다.
            </p>

            {/* 탈퇴 가능 여부 알림 상자 유지 */}
            {withdrawalCheck?.message && (
              <p className="mb-4 rounded-lg bg-[#fff7ed] p-3 text-[14px] text-[#9a3412]">
                {withdrawalCheck.message}
              </p>
            )}

            {/* 탈퇴 확인 사항 */}
            <div className="mb-5 rounded-lg border border-[#ebe6e0] bg-[#fffdf9] p-4">
              <p className="mb-2 font-semibold text-[#1f2937]">
                탈퇴 전 확인 사항
              </p>

              <ul className="list-disc space-y-1 pl-5 text-[13px] leading-[1.8] text-[#6b7280]">
                <li>탈퇴 후에는 계정 복구가 불가능합니다.</li>
                <li>
                  진행 중인 예약, 결제, 환불 및 클래스 상태에 따라 탈퇴가 제한될 수 있습니다.
                </li>
                <li>
                  탈퇴 완료 시 예약, 결제, 환불은 불가하며 해당 내역은 즉시 삭제됩니다.
                </li>
                <li>탈퇴 완료 시 개인정보는 즉시 삭제됩니다.</li>
              </ul>
            </div>

            {/* 약관 동의 */}
            <label className="mb-6 flex cursor-pointer items-start gap-2 text-[14px] leading-[1.7] text-[#1f2937]">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1"
              />
              <span>
                위 내용을 확인했으며 회원 탈퇴 및 개인정보 삭제에 동의합니다.
              </span>
            </label>

            {/* 버튼은 기존처럼 오른쪽 정렬 */}
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                disabled={withdrawing}
                onClick={handleCancelWithdrawal}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#edddcf] bg-white px-5 py-2 font-bold text-[#e56b00] disabled:opacity-50"
              >
                취소
              </button>

              <button
                type="button"
                disabled={!agreedToTerms || withdrawing}
                onClick={handleWithdrawal}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#b75b46] bg-[#b75b46] px-5 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {withdrawing ? "탈퇴 처리 중..." : "탈퇴하기"}
              </button>
            </div>
          </section>
        </div>
      )}
    </Workspace>
  );
}