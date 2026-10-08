import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { initialProfile, useStore } from "../../mocks/data";
import { getMember, updateMember } from "../../api/memberApi";
import { getCookie } from "../../util/cookieUtil";

import { ButtonLink } from "../../components/common/ButtonLink";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";
import { Workspace } from "../../components/common/Workspace";

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

export default function MyPage({ instructor = false, edit = false }) {
  const navigate = useNavigate();

  const [role] = useStore("role", "PUBLIC");
  const isInstructor = instructor || role === "INS";

  const [profile, setProfile] = useState(initialProfile);
  const [form, setForm] = useState(initialProfile);
  const [loading, setLoading] = useState(!isInstructor);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [request, setRequest] = useStore("instructorRequest", null);
  const [applying, setApplying] = useState(false);
  const [bio, setBio] = useState("");
  const [files, setFiles] = useState([]);

  const base = isInstructor ? "/instructor/mypage" : "/member/mypage";

  // 회원 정보 조회
  useEffect(() => {
    if (isInstructor) return;

    const fetchMember = async () => {
      try {
        const member = getCookie("member");

        if (!member?.memNo) {
          console.error("회원 번호가 없습니다.");
          return;
        }

        const response = await getMember(member.memNo);
        const data = response.data;

        const memberProfile = {
          email: data.memEmail || "",
          nickname: data.memNickname || "",
          phone: data.memPhone || "",
          address: data.memAddress || "",
          detail: data.memAddressDetail || "",
          img: data.memImg || "",
        };

        setProfile(memberProfile);
        setForm(memberProfile);
      } catch (error) {
        console.error("회원 정보 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [isInstructor]);

  // 회원 정보 수정
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const member = getCookie("member");

      if (!member?.memNo) {
        console.error("회원 번호가 없습니다.");
        return;
      }

      await updateMember(member.memNo, {
        memNickname: form.nickname,
        memPhone: form.phone,
        memAddress: form.address,
        memAddressDetail: form.detail,
        memImg: form.img || null,
      });

      setProfile(form);
      navigate(base);
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);
      setMessage("회원 정보 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Workspace kind="member">
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          회원 정보를 불러오는 중입니다.
        </section>
      </Workspace>
    );
  }

  return (
    <Workspace kind={isInstructor ? "instructor" : "member"}>
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
            className="group relative w-[84px] h-[84px] rounded-full bg-[#ffead5] text-[#ee7c1e] grid place-items-center text-[31px] cursor-pointer overflow-hidden"
            title="프로필 사진 변경"
          >
            {profile.img ? (
              <img
                src={profile.img}
                alt="프로필 사진"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{profile.nickname?.[0] || ""}</span>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-white text-[12px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              사진 변경
            </div>
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
                required
                value={form.detail}
                onChange={(e) =>
                  setForm({
                    ...form,
                    detail: e.target.value,
                  })
                }
              />
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
              <ButtonLink secondary to={base}>
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
                  onChange={(e) =>
                    setFiles(Array.from(e.target.files))
                  }
                />
              </Field>

              <p className="text-[13px] leading-[1.8] text-[#999]">
                미리보기에는 파일 이름만 보관하며 파일을 업로드하지 않습니다.
              </p>

              <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
                <button
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
          className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#f3f7f2] text-[#477754] text-[16px]"
          role="status"
        >
          {message}
        </p>
      )}

      <button
        className="bg-transparent border-0 p-[7px] text-[#b75b46]!"
        onClick={() =>
          setMessage(
            "회원 탈퇴는 실제 계정과 예약·환불 상태 확인이 필요하므로 미리보기에서 처리하지 않습니다.",
          )
        }
      >
        회원 탈퇴 안내
      </button>
    </Workspace>
  );
}