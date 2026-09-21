package com.spring.classon.sgUserTests;

import com.spring.classon.instructor.dto.*;
import com.spring.classon.instructor.entity.InstructorRequest;
import com.spring.classon.instructor.repository.InstructorRequestRepository;
import com.spring.classon.instructor.service.InstructorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class InstructorServiceTests {

    @Autowired
    private InstructorService instructorService;

    @Autowired
    private InstructorRequestRepository instructorRequestRepository;

    @Test
    public void 강사신청_테스트() {

        // 강사 신청에 사용할 회원 번호
        Long memNo = 4L;

        // 강사 신청 정보
        InstructorRequestDto dto = new InstructorRequestDto(
                "도자기 강사로 활동하고 싶습니다.",
                "종로구 햇빛 도자기 공방 운영 3년"
        );

        // 강사 신청
        Long reqNo = instructorService.applyInstructor(memNo, dto);

        // 저장된 강사 신청 조회
        InstructorRequest result =
                instructorRequestRepository.findById(reqNo).orElseThrow();

        // 신청 정보가 제대로 저장됐는지 확인
        assertThat(result.getReqNo()).isEqualTo(reqNo);
        assertThat(result.getMemNo()).isEqualTo(memNo);
        assertThat(result.getReqIntroduction())
                .isEqualTo("도자기 강사로 활동하고 싶습니다.");
        assertThat(result.getReqCareer())
                .isEqualTo("종로구 햇빛 도자기 공방 운영 3년");
        assertThat(result.getReqStatus()).isEqualTo("NEW");

        // 신청 결과 출력
        System.out.println("===== 강사 신청 테스트 =====");
        System.out.println("신청 번호: " + result.getReqNo());
        System.out.println("회원 번호: " + result.getMemNo());
        System.out.println("강사 소개: " + result.getReqIntroduction());
        System.out.println("경력 및 활동 이력: " + result.getReqCareer());
        System.out.println("신청 상태: " + result.getReqStatus());
    }

    @Test
    public void 강사신청_조회_테스트() {

        // 테스트할 강사 신청 생성
        InstructorRequest request = InstructorRequest.builder()
                .memNo(4L)
                .reqIntroduction("도자기 강사입니다.")
                .reqCareer("종로구 햇빛 도자기 공방 운영 3년")
                .reqStatus("NEW")
                .build();

        instructorRequestRepository.save(request);

        // 강사 신청 조회
        InstructorResponseDto result =
                instructorService.getInstructorRequest(request.getReqNo());

        // 조회된 신청 정보가 제대로 나오는지 확인
        assertThat(result).isNotNull();
        assertThat(result.getReqNo()).isEqualTo(request.getReqNo());
        assertThat(result.getMemNo()).isEqualTo(4L);
        assertThat(result.getReqIntroduction())
                .isEqualTo("도자기 강사입니다.");
        assertThat(result.getReqCareer())
                .isEqualTo("종로구 햇빛 도자기 공방 운영 3년");
        assertThat(result.getReqStatus()).isEqualTo("NEW");

        // 조회 결과 출력
        System.out.println("===== 강사 신청 조회 테스트 =====");
        System.out.println("신청 번호: " + result.getReqNo());
        System.out.println("회원 번호: " + result.getMemNo());
        System.out.println("강사 소개: " + result.getReqIntroduction());
        System.out.println("경력 및 활동 이력: " + result.getReqCareer());
        System.out.println("신청 상태: " + result.getReqStatus());
    }
}