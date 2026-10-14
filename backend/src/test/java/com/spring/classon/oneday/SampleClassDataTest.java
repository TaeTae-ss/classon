package com.spring.classon.oneday;

import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.oneday.repository.OneDayRepository;
import com.spring.classon.oneday.status.OneDayStatus;
import com.spring.classon.oneday.util.ProductImagePaths;
import com.spring.classon.oneday.util.ProductImageStorage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.transaction.annotation.Transactional;
import org.junit.jupiter.api.Disabled;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Disabled("샘플 데이터 등록용 — 필요할 때만 실행")
@SpringBootTest(properties = "spring.jpa.hibernate.ddl-auto=none")
class SampleClassDataTest {

    @Autowired
    private OneDayRepository oneDayRepository;

    @Autowired
    private ProductImageStorage productImageStorage;

    private record Sample(
            Long memNo,
            Long catNo,
            String name,
            int price,
            int duration,
            String level,
            String roadAddress,
            String detailAddress,
            String image,
            String introduction,
            String course,
            String result,
            String guide
    ) {
    }

    @Test
    @Transactional
    @Rollback
    void registerSampleClasses() throws Exception {

        Path imageRoot = Path.of("C:/classon/sample-images");

        List<Sample> samples = List.of(
                new Sample(
                        30L, 3L, "나만의 향기, 캔들 만들기",
                        35000, 120, "초급",
                        "서울특별시 강남구 테헤란로 123", "2층 201호",
                        "craft/01_candle_making.png",
                        "좋아하는 향과 색을 조합해 나만의 캔들을 만듭니다. "
                                + "재료 선택부터 왁스 혼합과 장식까지 차근차근 안내합니다.",
                        "1. 재료와 도구 안내\n2. 향과 색상 선택\n"
                                + "3. 왁스 혼합 및 용기에 붓기\n4. 장식과 포장",
                        "용기 캔들 1개",
                        "재료와 도구, 포장은 포함됩니다. 뜨거운 왁스 사용 시 안전 안내를 따라주세요."
                ),
                new Sample(
                        26L, 5L, "처음 시작하는 유화 클래스",
                        45000, 180, "초급",
                        "경기도 성남시 분당구 판교역로 235", "3층 아트룸",
                        "art/02_oil_painting.png",
                        "유화의 기본 재료와 색 혼합 방법을 익혀 작은 풍경화를 완성합니다. "
                                + "그림 경험이 없어도 참고 도안으로 참여할 수 있습니다.",
                        "1. 재료와 붓 사용법 안내\n2. 구도와 밑그림\n"
                                + "3. 색 혼합과 채색\n4. 세부 표현",
                        "소형 캔버스 풍경화 1점",
                        "도구는 제공됩니다. 물감이 묻어도 괜찮은 옷을 권장합니다. "
                                + "건조 상태에 따라 작품 수령 방법을 안내합니다."
                ),
                new Sample(
                        22L, 4L, "홈베이킹으로 만드는 달콤한 하루",
                        40000, 180, "초급",
                        "부산광역시 해운대구 해운대로 456", "1층 베이킹 스튜디오",
                        "cooking/03_home_baking.png",
                        "계량부터 반죽과 굽기까지 직접 경험하며 머핀을 만듭니다. "
                                + "집에서도 활용할 수 있는 레시피와 작업 요령을 알려드립니다.",
                        "1. 재료와 레시피 안내\n2. 계량과 반죽\n"
                                + "3. 팬닝과 굽기\n4. 완성품 포장",
                        "머핀 6개와 레시피",
                        "재료와 도구는 제공됩니다. 밀, 우유, 달걀 등 사용 재료의 알레르기를 확인해주세요."
                ),
                new Sample(
                        24L, 3L, "계절을 담은 플라워 리스 만들기",
                        38000, 120, "초급",
                        "대전광역시 유성구 대학로 99", "2층 플라워룸",
                        "craft/04_flower_wreath.png",
                        "계절 꽃과 잎 소재로 공간을 장식할 리스를 만듭니다. "
                                + "색과 배치를 선택하며 나만의 분위기를 표현합니다.",
                        "1. 꽃과 소재 소개\n2. 디자인 선택\n"
                                + "3. 소재 손질과 리스 제작\n4. 관리 방법 안내",
                        "플라워 리스 1개",
                        "재료와 도구는 제공됩니다. 계절과 수급 상황에 따라 꽃 종류가 달라질 수 있습니다."
                ),
                new Sample(
                        29L, 2L, "몸과 마음이 가벼워지는 요가",
                        25000, 90, "초급",
                        "인천광역시 연수구 센트럴로 160", "4층 요가 스튜디오",
                        "fitness/05_yoga.png",
                        "호흡과 기본 자세를 익히며 자신의 움직임에 집중합니다. "
                                + "몸 상태에 맞춰 무리하지 않고 진행하는 입문 수업입니다.",
                        "1. 호흡과 준비 운동\n2. 기본 자세 연습\n"
                                + "3. 자세 연결하기\n4. 마무리 이완",
                        "기본 요가 자세와 호흡법 익히기",
                        "매트는 제공됩니다. 편한 운동복과 개인 물을 준비해주세요. "
                                + "불편한 동작은 강사에게 알려주세요."
                ),
                new Sample(
                        23L, 1L, "처음 배우는 어쿠스틱 기타",
                        30000, 120, "초급",
                        "서울특별시 마포구 월드컵북로 45", "3층 음악연습실",
                        "music/06_acoustic_guitar.png",
                        "기타를 처음 잡는 분을 위한 코드와 리듬 입문 수업입니다. "
                                + "기본 자세부터 쉬운 곡의 반주까지 함께 연습합니다.",
                        "1. 악기와 튜닝 안내\n2. 기본 코드 연습\n"
                                + "3. 스트로크와 리듬\n4. 쉬운 곡 반주",
                        "기본 코드로 짧은 곡 반주하기",
                        "수업용 기타와 악보는 제공됩니다. 개인 기타를 가져와도 됩니다."
                ),
                new Sample(
                        28L, 3L, "손끝으로 빚는 나만의 도자기",
                        42000, 150, "초급",
                        "경기도 수원시 팔달구 정조로 812", "2층 도예공방",
                        "craft/07_pottery.png",
                        "흙을 손으로 빚고 다듬어 작은 그릇이나 컵을 만듭니다. "
                                + "기본 성형 방법을 익히고 원하는 무늬를 더해봅니다.",
                        "1. 흙과 도구 안내\n2. 형태 구상\n"
                                + "3. 손 성형과 다듬기\n4. 장식 및 유약 선택",
                        "생활 도자기 1개",
                        "재료와 소성 비용은 포함됩니다. 작품은 건조와 소성 후 수령하며 수령일은 별도 안내합니다."
                ),
                new Sample(
                        30L, 3L, "취향을 담은 나만의 향수",
                        39000, 100, "초급",
                        "서울특별시 성동구 연무장길 77", "1층 향기공방",
                        "craft/08_perfume_blending.png",
                        "여러 향료를 시향하고 취향에 맞게 조합해 향수를 만듭니다. "
                                + "향의 구조와 배합 방법을 쉽게 알려드립니다.",
                        "1. 향료 기초 안내\n2. 시향과 취향 탐색\n"
                                + "3. 배합 테스트\n4. 향수 완성과 라벨 작성",
                        "30ml 향수 1개",
                        "재료와 용기는 제공됩니다. 수업 당일에는 향이 강한 제품의 사용을 피해주세요."
                ),
                new Sample(
                        25L, 3L, "가죽으로 만드는 카드지갑",
                        48000, 150, "초급",
                        "경기도 고양시 일산동구 중앙로 1200", "5층 가죽공방",
                        "craft/09_leathercraft.png",
                        "가죽 공예의 기본 과정을 경험하며 실용적인 카드지갑을 만듭니다. "
                                + "색 선택부터 바느질과 마감까지 직접 진행합니다.",
                        "1. 가죽과 도구 소개\n2. 색상 선택과 재단 체험\n"
                                + "3. 바느질과 조립\n4. 가장자리 마감",
                        "가죽 카드지갑 1개",
                        "재료와 도구는 제공됩니다. 날카로운 도구 사용 시 안전 안내를 따라주세요."
                ),
                new Sample(
                        27L, 4L, "라떼아트와 홈카페 한 잔",
                        32000, 90, "초급",
                        "서울특별시 마포구 독막로 18", "1층 커피 스튜디오",
                        "cooking/10_barista_latteart.png",
                        "에스프레소 추출과 우유 스티밍을 익히고 하트 라떼아트를 연습합니다. "
                                + "직접 만든 음료를 맛보며 홈카페 팁도 알아봅니다.",
                        "1. 머신과 추출 기초\n2. 에스프레소 추출\n"
                                + "3. 우유 스티밍\n4. 하트 라떼아트",
                        "직접 만든 라테 시음 및 기초 라떼아트 연습",
                        "원두와 우유, 도구는 제공됩니다. 카페인과 우유 섭취가 포함됩니다."
                ),
                new Sample(
                        24L, 3L, "오늘을 위한 꽃다발 만들기",
                        36000, 100, "초급",
                        "경기도 성남시 수정구 위례광장로 21", "2층 플라워룸",
                        "craft/11_flower_bouquet.png",
                        "꽃의 색과 높낮이를 조합해 선물하기 좋은 꽃다발을 만듭니다. "
                                + "손질부터 꽃을 묶고 포장하는 과정까지 진행합니다.",
                        "1. 꽃과 색 조합 소개\n2. 줄기와 잎 손질\n"
                                + "3. 꽃다발 만들기\n4. 포장과 관리 안내",
                        "생화 꽃다발 1개",
                        "꽃과 포장재는 제공됩니다. 수급 상황에 따라 꽃 종류가 달라질 수 있습니다."
                ),
                new Sample(
                        25L, 3L, "은반지 원데이 주얼리 클래스",
                        55000, 150, "초급",
                        "서울특별시 종로구 돈화문로 35", "3층 주얼리 작업실",
                        "craft/12_silver_ring.png",
                        "은 소재를 다듬고 마감해 매일 착용할 반지를 만듭니다. "
                                + "원하는 크기와 표면 질감을 선택할 수 있습니다.",
                        "1. 디자인과 치수 확인\n2. 소재 가공\n"
                                + "3. 형태와 표면 다듬기\n4. 광택 작업",
                        "은반지 1개",
                        "기본 디자인의 재료와 도구는 포함됩니다. 가열 등 전문 작업은 강사가 진행합니다."
                ),
                new Sample(
                        29L, 2L, "처음 도전하는 실내 클라이밍",
                        28000, 90, "초급",
                        "경기도 성남시 분당구 황새울로 315", "지하 1층 클라이밍짐",
                        "fitness/13_indoor_climbing.png",
                        "안전 교육과 기본 동작을 익힌 뒤 쉬운 볼더링 코스에 도전합니다. "
                                + "움직임과 균형에 집중하며 자신의 속도로 참여합니다.",
                        "1. 시설 및 안전 교육\n2. 준비 운동\n"
                                + "3. 기본 동작과 코스 체험\n4. 정리 운동",
                        "입문 볼더링 코스 체험",
                        "시설 이용과 대여 암벽화는 포함됩니다. 운동복과 양말을 준비해주세요."
                ),
                new Sample(
                        23L, 6L, "감성 피크닉 사진 산책",
                        22000, 120, "초급",
                        "서울특별시 마포구 월드컵로 243", "공원 입구에서 집결",
                        "outdoor/14_picnic.png",
                        "공원을 산책하며 자연광과 피크닉 소품을 활용해 촬영합니다. "
                                + "스마트폰으로 활용할 수 있는 구도와 빛의 방향을 알아봅니다.",
                        "1. 집결과 촬영 안내\n2. 자연광과 구도 연습\n"
                                + "3. 소품 촬영\n4. 사진 선택과 피드백",
                        "개인 기기에 저장한 사진과 촬영 피드백",
                        "충전된 스마트폰 또는 카메라를 준비해주세요. 소품은 제공됩니다. "
                                + "기상 상황에 따라 운영 안내가 달라질 수 있습니다."
                ),
                new Sample(
                        23L, 5L, "스마트폰 제품 사진 촬영법",
                        30000, 120, "초급",
                        "서울특별시 영등포구 선유로 130", "4층 촬영 스튜디오",
                        "art/15_product_photography.png",
                        "스마트폰으로 음식과 소품을 매력적으로 촬영합니다. "
                                + "빛과 배경, 구도를 바꾸며 사진의 차이를 확인합니다.",
                        "1. 카메라 설정\n2. 조명과 배경 선택\n"
                                + "3. 소품 배치와 촬영\n4. 보정과 피드백",
                        "제품 사진과 기본 보정 방법 익히기",
                        "충전된 스마트폰을 준비해주세요. 촬영용 소품과 배경은 제공됩니다."
                ),
                new Sample(
                        24L, 3L, "포근한 마크라메 월행잉",
                        33000, 120, "초급",
                        "경기도 용인시 수지구 광교중앙로 308", "2층 공방",
                        "craft/16_macrame.png",
                        "기본 매듭을 반복해 공간을 꾸밀 벽 장식을 만듭니다. "
                                + "매듭 간격과 형태를 조절해 자신만의 패턴을 완성합니다.",
                        "1. 재료와 매듭 안내\n2. 기본 매듭 연습\n"
                                + "3. 패턴 제작\n4. 길이 정리와 마무리",
                        "마크라메 월행잉 1개",
                        "실과 나무봉, 도구는 제공됩니다. 초보자도 단계별로 따라올 수 있습니다."
                ),
                new Sample(
                        26L, 5L, "여행 풍경 수채화 그리기",
                        35000, 120, "초급",
                        "서울특별시 종로구 북촌로 42", "2층 드로잉룸",
                        "art/17_watercolor.png",
                        "물 조절과 색 겹치기를 익혀 작은 풍경 그림을 완성합니다. "
                                + "제공된 사진이나 개인 여행 사진을 참고할 수 있습니다.",
                        "1. 기초 채색 연습\n2. 구도와 밑그림\n"
                                + "3. 채색과 색 겹치기\n4. 세부 표현",
                        "수채화 작품 1점",
                        "종이와 물감, 도구는 제공됩니다. 개인 사진을 사용할 경우 풍경 사진을 준비해주세요."
                ),
                new Sample(
                        31L, 4L, "집밥이 맛있어지는 한식 클래스",
                        43000, 150, "초급",
                        "경기도 성남시 분당구 정자일로 95", "1층 쿠킹 스튜디오",
                        "cooking/18_korean_cooking.png",
                        "재료 손질과 양념 비율을 익혀 한 끼 한식 메뉴를 만듭니다. "
                                + "집에서도 활용할 수 있는 기본 조리 요령을 알려드립니다.",
                        "1. 메뉴와 재료 소개\n2. 손질과 양념 만들기\n"
                                + "3. 메인 요리와 반찬 조리\n4. 시식과 레시피 정리",
                        "제육볶음과 계절 채소 반찬",
                        "재료와 도구는 제공됩니다. 알레르기를 확인해주세요. "
                                + "재료 수급에 따라 메뉴가 달라질 수 있습니다."
                ),
                new Sample(
                        22L, 4L, "천천히 만드는 사워도우 브레드",
                        46000, 180, "중급",
                        "서울특별시 서대문구 연희로 88", "1층 베이커리 클래스룸",
                        "cooking/19_sourdough_baking.png",
                        "발효 원리를 알아보고 반죽 접기와 성형을 경험합니다. "
                                + "긴 발효 과정은 미리 준비한 단계별 반죽을 활용합니다.",
                        "1. 발효종과 반죽 안내\n2. 혼합과 접기 체험\n"
                                + "3. 준비된 반죽 성형\n4. 굽기 시연",
                        "사워도우 빵 1개와 레시피",
                        "재료와 도구는 제공됩니다. 기초 베이킹 경험이 있는 분에게 권장합니다. "
                                + "밀 등 사용 재료의 알레르기를 확인해주세요."
                ),
                new Sample(
                        29L, 2L, "리듬을 즐기는 댄스 입문",
                        27000, 90, "초급",
                        "경기도 수원시 영통구 광교중앙로 170", "3층 댄스 스튜디오",
                        "fitness/20_dance_basics.png",
                        "기본 스텝과 리듬을 익혀 짧은 안무를 함께 배웁니다. "
                                + "춤 경험이 없어도 동작을 나누어 천천히 연습합니다.",
                        "1. 준비 운동과 리듬 연습\n2. 기본 스텝\n"
                                + "3. 짧은 안무 연습\n4. 음악에 맞춰 연결",
                        "짧은 안무 한 곡 연습",
                        "운동복과 실내용 운동화, 개인 물을 준비해주세요. "
                                + "촬영은 참여자 동의를 확인한 뒤 진행합니다."
                )
        );

        // 저장 전 이미지 파일 존재 여부 확인
        for (Sample sample : samples) {
            Path imagePath = imageRoot.resolve(sample.image());

            if (!Files.isRegularFile(imagePath)) {
                throw new IllegalStateException(
                        "이미지 파일이 없습니다: " + imagePath
                );
            }
        }

        // 같은 강사의 같은 이름 클래스가 있으면 중단
        for (Sample sample : samples) {
            boolean exists = oneDayRepository.findByMemNo(sample.memNo())
                    .stream()
                    .anyMatch(oneDay ->
                            sample.name().equals(oneDay.getClsName())
                    );

            if (exists) {
                throw new IllegalStateException(
                        "이미 등록된 클래스입니다: " + sample.name()
                );
            }
        }

        for (Sample sample : samples) {
            Path imagePath = imageRoot.resolve(sample.image());

            // 원본 이미지를 기존 업로드 기능에 전달
            MockMultipartFile image = new MockMultipartFile(
                    "image",
                    imagePath.getFileName().toString(),
                    "image/png",
                    Files.readAllBytes(imagePath)
            );

            // 원본 저장 및 300px 썸네일 생성
            ProductImagePaths imagePaths =
                    productImageStorage.store(image);

            String description =
                    "[클래스 소개]\n" + sample.introduction()
                            + "\n\n[수업 진행]\n" + sample.course()
                            + "\n\n[수업 결과]\n" + sample.result()
                            + "\n\n[준비물 및 안내]\n" + sample.guide();

            OneDay oneDay = OneDay.builder()
                    .memNo(sample.memNo())
                    .catNo(sample.catNo())
                    .clsName(sample.name())
                    .clsDesc(description)
                    .clsPrice(sample.price())
                    .clsRoadAddr(sample.roadAddress())
                    .clsDetailAddr(sample.detailAddress())
                    .clsLevel(sample.level())
                    .clsDuration(sample.duration())
                    .clsImgOrigin(imagePaths.clsImgOrigin())
                    .clsImgThumb(imagePaths.clsImgThumb())
                    .clsStatus(OneDayStatus.READY)
                    .build();

            oneDayRepository.save(oneDay);
        }

        // SQL 실행 및 DB 오류 확인
        oneDayRepository.flush();

        // 모든 등록이 정상 완료된 경우에만 커밋
        TestTransaction.flagForCommit();
        TestTransaction.end();

        System.out.println("클래스 20개와 이미지 등록 완료");
        System.out.println(
                "이미지 저장 위치: "
                        + Path.of(System.getProperty("user.dir"), "uploads", "oneday")
                        .toAbsolutePath()
        );
    }
}