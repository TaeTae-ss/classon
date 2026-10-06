import { Link } from "react-router";
import { classes, schedules, useStore, initialReviews } from "../../mocks/data";
import { Heading } from "../../components/common/Heading";
import { Workspace } from "../../components/common/Workspace";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Art } from "../../components/common/Art";
import { Stats } from "../../components/common/Stats";

export default function InstructorDashboard() {
  const [list] = useStore("classes", classes);
  const [reviews] = useStore("reviews", initialReviews);
  return (
    <Workspace kind="instructor">
      <Heading
        title="강사 대시보드"
        description="오늘도 새로운 배움을 함께 만들어가요."
        action={
          <ButtonLink to="/instructor/classes/register">클래스 등록</ButtonLink>
        }
      />
      <Stats
        items={[
          ["내 클래스", `${list.length}개`],
          ["수업 일정", `${schedules.length}건`],
          ["수강 후기", `${reviews.length}건`],
        ]}
      />
      <div className="grid grid-cols-2 gap-[34px] max-[900px]:gap-[22px] max-md:grid-cols-1 [&>*]:min-w-0">
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          <h2>내 클래스 목록</h2>
          {list.slice(0, 3).map((c) => (
            <div className="flex items-center gap-[22px] [&+&]:mt-[19px]" key={c.id}>
              <Art item={c} className="w-36 shrink-0 rounded-[7px]" />
              <div>
                <h3 className="mb-[6px]">{c.title}</h3>
                <Link to={`/instructor/classes/${c.id}/edit`}>수정 →</Link>
              </div>
            </div>
          ))}
          <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
            <ButtonLink secondary to="/instructor/classes">
              전체 보기
            </ButtonLink>
          </div>
        </section>
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          <h2>다가오는 수업 일정</h2>
          {schedules.map((s) => (
            <div className="border-t border-[#eee] py-6" key={s.id}>
              <strong>
                {s.date} {s.time}
              </strong>
              <p>도자기 핸드빌딩 클래스 · 잔여 {s.remaining}석</p>
              <Link to={`/reservation/schedule/${s.id}`}>예약자 확인 →</Link>
            </div>
          ))}
        </section>
      </div>
    </Workspace>
  );
}
