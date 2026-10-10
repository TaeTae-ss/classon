import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { useStore } from "../../mocks/data";

import {
  getMember,
  updateMember,
  updatePassword,
  updateProfileImage,
} from "../../api/memberApi";

import { getCookie } from "../../util/cookieUtil";

import { ButtonLink } from "../../components/common/ButtonLink";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";
import { Workspace } from "../../components/common/Workspace";

const SERVER_URL = "http://localhost:8080";
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/;
const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

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

  const [request, setRequest] = useStore("instructorRequest", null);

  const [applying, setApplying] = useState(false);
  const [bio, setBio] = useState("");
  const [files, setFiles] = useState([]);

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
    const memberProfile = toMemberProfile(response.data);

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

  // 페이지 이동 시 기존 메시지 제거
  useEffect(() => {
    setMessage("");
  }, [location.pathname]);

  // 회원 정보 최초 조회
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
                <div
                  key={k}
                  style={{ display: "contents" }}
                >
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

      {!isInstructor && !edit && (
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          <Heading
            title="강사 신청"
            description="당신의 경험을 새로운 배움으로 나눠주세요."
          />

          {request ? (
            <>
              <span className="inline-block px-3 py-[3px] rounded-[24px] bg-[#fff0df] text-[#df700e] text-[13px] font-bold">
                {request.status}
              </span>

              <p style={{ marginTop: 14 }}>
                신청일: {request.date}
              </p>

              <p>{request.bio}</p>
              <p>{request.files.join(", ")}</p>

              <button
                type="button"
                className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                onClick={() => setRequest(null)}
              >
                신청 취소
              </button>
            </>
          ) : applying ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();

                setRequest({
                  bio,
                  files: files.map((f) => f.name),
                  date: "2026-10-01",
                  status: "관리자 검토 중",
                });

                setApplying(false);
              }}
            >
              <Field label="강사 소개 및 경력">
                <textarea
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="경력 및 활동 이력을 적어주세요."
                />
              </Field>

              <Field label="자격 및 경력 증명 서류">
                <input
                  required
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                />
              </Field>

              <p className="text-[13px] leading-[1.8] text-[#999]">
                미리보기에는 파일 이름만 보관하며 파일을 업로드하지 않습니다.
              </p>

              <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  신청 화면 완료
                </button>

                <button
                  type="button"
                  className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                  onClick={() => setApplying(false)}
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

      <button
        type="button"
        className="bg-transparent border-0 p-[7px] text-[#b75b46]!"
        onClick={() =>
          setMessage(
            "회원 탈퇴는 실제 계정과 예약·환불 상태 확인이 필요하므로 미리보기에서 처리하지 않습니다."
          )
        }
      >
        회원 탈퇴 안내
      </button>
    </Workspace>
  );
}