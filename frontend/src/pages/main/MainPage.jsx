import { Link } from "react-router";
import { classes } from "../../mocks/data";
import { Art } from "../../components/common/Art";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Card } from "../../components/common/Card";

export default function MainPage() {
  return (
    <>
      <section className="grid grid-cols-2 bg-[#f6ede2] rounded-[14px] overflow-hidden my-[22px] mb-[43px] min-h-[372px] max-md:grid-cols-1 max-md:min-h-0">
        <div className="p-12 max-[900px]:p-9 max-md:p-[30px] max-[420px]:p-6">
          <span className="text-[13px] font-bold tracking-[2px] text-[#a57950]">MAKE YOUR DAY, CLASS:ON</span>
          <h1 className="text-[41px] leading-[1.4] my-3 mb-[22px] max-[900px]:text-[34px] max-[420px]:text-[29px]">
            지금, 더 특별한 하루를
            <br />
            특별하게 만들어보세요
          </h1>
          <p className="text-[#78664f]">
            작은 호기심이 새로운 취미가 되는 곳.
            <br />
            당신의 일상에 즐거움을 더해보세요.
          </p>
          <ButtonLink to="/class">클래스 둘러보기 →</ButtonLink>
        </div>
        <Art item={classes[0]} hero />
      </section>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2>지금 인기 있는 클래스</h2>
          <Link className="text-[#e57315] text-[14px]" to="/class">전체 보기 →</Link>
        </div>
        <div className="grid grid-cols-4 gap-6 max-[900px]:grid-cols-2 max-md:gap-3 max-[420px]:grid-cols-1">
          {classes.slice(0, 4).map((c) => (
            <Card key={c.id} item={c} />
          ))}
        </div>
      </section>
    </>
  );
}
