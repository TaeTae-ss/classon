import { Link } from "react-router";
import {
  useStore,
  classes,
  initialReservations,
  initialInquiries,
} from "../../mocks/data";
import { Workspace } from "../../components/common/Workspace";
import { Heading } from "../../components/common/Heading";
import { Stats } from "../../components/common/Stats";
const initialMembers = [
  { id: 1, name: "김회원", email: "member@classon.com", role: "USER" },
  { id: 2, name: "이회원", email: "user2@classon.com", role: "USER" },
  { id: 3, name: "홍길동", email: "instructor@classon.com", role: "INS" },
];
export default function AdminDashboard() {
  const [members] = useStore("members", initialMembers);
  const [list] = useStore("classes", classes);
  const [inquiries] = useStore("inquiries", initialInquiries);
  const [reservations] = useStore("reservations", initialReservations);
  return (
    <Workspace kind="admin">
      <Heading
        title="관리자 대시보드"
        description="서비스 운영 현황을 한눈에 확인하세요."
      />
      <Stats
        items={[
          ["회원", `${members.length}명`],
          ["클래스", `${list.length}개`],
          [
            "미처리 문의",
            `${inquiries.filter((i) => i.status !== "COMPLETED").length}건`,
          ],
          ["결제", `${reservations.filter((r) => r.paid).length}건`],
        ]}
      />
      <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
        <h2>서비스 관리</h2>
        <div className="grid grid-cols-3 gap-[14px] max-md:grid-cols-2">
          {[
            ["/admin/members", "회원 관리"],
            ["/admin/classes", "클래스 관리"],
            ["/admin/reviews", "후기 관리"],
            ["/admin/notice/list", "공지사항 관리"],
            ["/admin/inquiry/list", "문의 및 신고 관리"],
            ["/admin/reservations", "예약·결제 현황"],
          ].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className="bg-white border border-[#eee] p-[26px] rounded-[10px]"
            >
              {label} →
            </Link>
          ))}
        </div>
      </section>
    </Workspace>
  );
}
