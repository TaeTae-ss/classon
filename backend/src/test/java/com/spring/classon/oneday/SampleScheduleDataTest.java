package com.spring.classon.oneday;

import com.spring.classon.oneday.dto.ScheduleRequestDTO;
import com.spring.classon.oneday.entity.OneDay;
import com.spring.classon.oneday.repository.OneDayRepository;
import com.spring.classon.oneday.repository.ScheduleRepository;
import com.spring.classon.oneday.service.ScheduleService;
import com.spring.classon.oneday.status.OneDayStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.transaction.annotation.Transactional;
import org.junit.jupiter.api.Disabled;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

// @Disabled("샘플 데이터 등록용 — 필요할 때만 실행")
@SpringBootTest(properties = "spring.jpa.hibernate.ddl-auto=none")
class SampleScheduleDataTest {

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private OneDayRepository oneDayRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    private record Sample(
            Long clsNo,
            String clsName,
            int capacity
    ) {
    }

    @Test
    @Transactional
    @Rollback
    void registerSampleSchedules() {

        List<Sample> samples = List.of(
                new Sample(1L, "나만의 향기, 캔들 만들기", 8),
                new Sample(2L, "처음 시작하는 유화 클래스", 6),
                new Sample(3L, "홈베이킹으로 만드는 달콤한 하루", 10),
                new Sample(4L, "계절을 담은 플라워 리스 만들기", 6),
                new Sample(5L, "몸과 마음이 가벼워지는 요가", 8),
                new Sample(6L, "처음 배우는 어쿠스틱 기타", 7),
                new Sample(7L, "손끝으로 빚는 나만의 도자기", 8),
                new Sample(8L, "취향을 담은 나만의 향수", 6),
                new Sample(9L, "가죽으로 만드는 카드지갑", 6),
                new Sample(10L, "라떼아트와 홈카페 한 잔", 8),
                new Sample(11L, "오늘을 위한 꽃다발 만들기", 8),
                new Sample(12L, "은반지 원데이 주얼리 클래스", 5),
                new Sample(13L, "처음 도전하는 실내 클라이밍", 8),
                new Sample(14L, "감성 피크닉 사진 산책", 10),
                new Sample(15L, "스마트폰 제품 사진 촬영법", 8),
                new Sample(16L, "포근한 마크라메 월행잉", 8),
                new Sample(17L, "여행 풍경 수채화 그리기", 6),
                new Sample(18L, "집밥이 맛있어지는 한식 클래스", 8),
                new Sample(19L, "천천히 만드는 사워도우 브레드", 6),
                new Sample(20L, "리듬을 즐기는 댄스 입문", 10)
        );

        // 등록 전에 클래스 번호와 이름 확인
        List<OneDay> classes = new ArrayList<>();

        for (Sample sample : samples) {
            OneDay oneDay = oneDayRepository.findById(sample.clsNo())
                    .orElseThrow(() -> new IllegalStateException(
                            "클래스가 없습니다: " + sample.clsNo()
                    ));

            if (!sample.clsName().equals(oneDay.getClsName())) {
                throw new IllegalStateException(
                        "클래스 번호와 이름이 다릅니다: " + sample.clsNo()
                );
            }

            if (oneDay.getClsStatus() != OneDayStatus.READY
                    && oneDay.getClsStatus() != OneDayStatus.RECRUITING) {
                throw new IllegalStateException(
                        "일정을 추가할 수 없는 클래스 상태입니다: "
                                + sample.clsName()
                );
            }

            classes.add(oneDay);
        }

        // 일정 날짜를 고정해 재실행 시 같은 날짜의 중복 등록 방지
        LocalDate firstDate = LocalDate.of(2026, 11, 7);

        if (firstDate.isBefore(LocalDate.now())) {
            throw new IllegalStateException(
                    "샘플 기준일이 지났습니다. firstDate를 미래 날짜로 바꿔주세요."
            );
        }

        int addedCount = 0;
        int skippedCount = 0;

        for (int i = 0; i < samples.size(); i++) {
            Sample sample = samples.get(i);
            OneDay oneDay = classes.get(i);

            // 클래스별로 날짜를 다르게 배정
            // 두 번째 회차는 첫 번째 회차의 28일 후
            List<LocalDate> dates = List.of(
                    firstDate.plusDays(i),
                    firstDate.plusDays(i + 28)
            );

            for (LocalDate date : dates) {
                boolean exists = scheduleRepository
                        .findByClsNoOrderBySchStartDateAsc(sample.clsNo())
                        .stream()
                        .anyMatch(schedule ->
                                date.equals(schedule.getSchStartDate())
                        );

                if (exists) {
                    skippedCount++;
                    continue;
                }

                ScheduleRequestDTO dto = new ScheduleRequestDTO(
                        date,
                        sample.capacity()
                );

                // DB에서 조회한 실제 소유 강사 번호로 등록
                // 기존 서비스가 클래스 상태도 RECRUITING으로 변경
                scheduleService.registerSchedule(
                        oneDay.getMemNo(),
                        sample.clsNo(),
                        dto
                );

                addedCount++;
            }
        }

        scheduleRepository.flush();
        oneDayRepository.flush();

        // 모든 작업이 정상 완료된 경우에만 저장 확정
        TestTransaction.flagForCommit();
        TestTransaction.end();

        System.out.println("추가한 일정: " + addedCount + "개");
        System.out.println("같은 날짜가 있어 건너뛴 일정: " + skippedCount + "개");
    }
}