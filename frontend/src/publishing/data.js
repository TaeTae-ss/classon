import { useEffect, useState } from "react";

export const classes = [
  {
    id: 1,
    title: "도자기 핸드빌딩 원데이 클래스",
    instructor: "홍길동",
    category: "취미",
    difficulty: "초급",
    price: 35000,
    rating: 4.9,
    capacity: 8,
    duration: 120,
    art: "pottery",
    color: "#ead8c2",
    location: "서울 마포구 연남로 35",
    description:
      "흙의 촉감을 느끼며 나만의 컵과 작은 접시를 만들어보세요. 처음이어도 괜찮아요. 손끝에서 시작되는 새로운 취미를 함께합니다.",
  },
  {
    id: 2,
    title: "향기로 기억하는 나만의 향수",
    instructor: "김향기",
    category: "취미",
    difficulty: "초급",
    price: 45000,
    rating: 4.8,
    capacity: 6,
    duration: 90,
    art: "perfume",
    color: "#e4e6cf",
    location: "서울 성동구 연무장길 12",
    description:
      "좋아하는 향을 찾아 조향하고, 나만의 이야기가 담긴 향수를 완성합니다.",
  },
  {
    id: 3,
    title: "React로 시작하는 웹 개발",
    instructor: "김강사",
    category: "개발",
    difficulty: "초급",
    price: 50000,
    rating: 4.7,
    capacity: 10,
    duration: 120,
    art: "code",
    color: "#d3dfe7",
    location: "서울 강남구 테헤란로 25",
    description:
      "컴포넌트부터 상태 관리까지 차근차근 배우며 첫 번째 웹 페이지를 만들어보세요.",
  },
  {
    id: 4,
    title: "일상의 색을 담는 수채화",
    instructor: "최그림",
    category: "취미",
    difficulty: "초급",
    price: 38000,
    rating: 4.9,
    capacity: 8,
    duration: 120,
    art: "paint",
    color: "#eadbde",
    location: "서울 종로구 자하문로 18",
    description:
      "물과 색이 만나는 순간을 즐기며 나만의 엽서를 완성하는 시간입니다.",
  },
  {
    id: 5,
    title: "Figma로 완성하는 UI 디자인",
    instructor: "박디자인",
    category: "디자인",
    difficulty: "중급",
    price: 60000,
    rating: 4.8,
    capacity: 8,
    duration: 180,
    art: "design",
    color: "#ddd7ea",
    location: "서울 마포구 월드컵북로 21",
    description:
      "사용하기 편한 화면의 구조부터 디자인 시스템까지 직접 만들어봅니다.",
  },
  {
    id: 6,
    title: "천천히 시작하는 홈 베이킹",
    instructor: "이베이커",
    category: "기타",
    difficulty: "초급",
    price: 42000,
    rating: 4.6,
    capacity: 6,
    duration: 150,
    art: "bake",
    color: "#f0dfc4",
    location: "서울 송파구 백제고분로 32",
    description:
      "따뜻한 오븐에서 구워지는 쿠키와 함께 일상의 작은 즐거움을 발견하세요.",
  },
];
export const schedules = [
  { id: 1, date: "2026-10-05", time: "14:00", remaining: 8 },
  { id: 2, date: "2026-10-07", time: "19:00", remaining: 5 },
  { id: 3, date: "2026-10-10", time: "13:00", remaining: 2 },
];
export const money = (n) => `${Number(n).toLocaleString("ko-KR")}원`;
export const initialProfile = {
  id: 1,
  email: "member@classon.com",
  nickname: "김회원",
  phone: "010-1234-5678",
  birth: "1998-05-12",
  address: "서울특별시 마포구 연남로 35",
  detail: "201호",
};
export const initialReservations = [
  {
    id: 1001,
    classId: 1,
    scheduleId: 1,
    count: 2,
    status: "예약완료",
    method: "신용카드",
    paid: true,
  },
  {
    id: 1002,
    classId: 4,
    scheduleId: 2,
    count: 1,
    status: "수강완료",
    method: "간편결제",
    paid: true,
  },
];
export const initialNotices = [
  {
    id: 4,
    title: "CLASS:ON 서비스 이용 안내",
    content:
      "새로운 취미를 만나는 CLASS:ON에 오신 것을 환영합니다.\n클래스 일정과 준비물을 확인하신 후 예약해주세요.",
    date: "2026-09-30",
  },
  {
    id: 3,
    title: "10월 클래스 예약 안내",
    content:
      "10월 클래스 예약이 시작되었습니다. 클래스별 일정과 잔여 정원을 확인해주세요.",
    date: "2026-09-28",
  },
  {
    id: 2,
    title: "서비스 점검 안내",
    content: "안정적인 서비스 제공을 위한 점검 안내입니다.",
    date: "2026-09-25",
  },
  {
    id: 1,
    title: "CLASS:ON 서비스 오픈 안내",
    content: "취미는 ON, 일상도 ON. 오늘부터 새로운 경험을 시작해보세요.",
    date: "2026-09-20",
  },
];
export const initialInquiries = [
  {
    id: 103,
    title: "클래스 준비물 관련 문의입니다.",
    content: "도자기 클래스에 참여할 때 준비해야 할 물품이 있나요?",
    type: "문의",
    memberId: 1,
    date: "2026-09-30",
    status: "RECEIVED",
    answer: "",
  },
  {
    id: 102,
    title: "예약 일정 변경에 대해 문의합니다.",
    content: "예약한 일정 변경이 가능한지 궁금합니다.",
    type: "문의",
    memberId: 1,
    date: "2026-09-28",
    status: "COMPLETED",
    answer: "예약 상세 화면에서 변경 가능한 일정을 확인해주세요.",
  },
];
export const initialReviews = [
  {
    id: 201,
    classId: 1,
    reservationId: 1001,
    memberId: 2,
    author: "이회원",
    rating: 5,
    content: "처음 해보는 도자기였는데 친절하게 알려주셔서 즐겁게 만들었어요.",
    date: "2026-09-25",
  },
  {
    id: 202,
    classId: 4,
    reservationId: 1002,
    memberId: 1,
    author: "김회원",
    rating: 4,
    content: "차분하게 색을 채우는 시간이 정말 좋았습니다.",
    date: "2026-09-27",
  },
];
export function readStore(key, fallback) {
  try {
    return (
      JSON.parse(localStorage.getItem(`classon:publishing:${key}`)) ?? fallback
    );
  } catch {
    return fallback;
  }
}
export function useStore(key, fallback) {
  const [value, setValue] = useState(() => readStore(key, fallback));
  useEffect(() => {
    const sync = () => setValue(readStore(key, fallback));
    window.addEventListener("classon:publishing:change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("classon:publishing:change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [key, fallback]);
  return [
    value,
    (next) => {
      const current = readStore(key, fallback);
      const updated = typeof next === "function" ? next(current) : next;
      localStorage.setItem(
        `classon:publishing:${key}`,
        JSON.stringify(updated),
      );
      setValue(updated);
      window.dispatchEvent(new Event("classon:publishing:change"));
    },
  ];
}
export function getSchedules() {
  return [
    ...schedules,
    ...readStore("schedules", []).map((s) => ({ ...s, remaining: s.capacity })),
  ];
}
export function findClass(id, list = classes) {
  return list.find((c) => c.id === Number(id));
}
