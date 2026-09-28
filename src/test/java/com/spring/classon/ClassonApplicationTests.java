package com.spring.classon;

import com.spring.classon.inquiry.entity.Inquiry;
import com.spring.classon.inquiry.repository.InquiryRepository;
import com.spring.classon.notice.entity.Notice;
import com.spring.classon.notice.repository.NoticeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ClassonApplicationTests {

	@Test
	void contextLoads() {
	}

	@Autowired
	private NoticeRepository noticeRepository;

	@Test
	void noticeRepositoryTest() {

		Notice notice = Notice.builder()
				.notTitle("공지사항 테스트")
				.notContent("공지사항 JPA 연결 테스트입니다.")
				.build();

		Notice savedNotice = noticeRepository.save(notice);

		System.out.println("공지번호 = " + savedNotice.getNotNo());
		System.out.println("제목 = " + savedNotice.getNotTitle());
	}

	@Autowired
	private InquiryRepository inquiryRepository;

	@Test
	void inquiryRepositoryTest() {

		Inquiry inquiry = Inquiry.builder()
				.inqMemNo(1L)
				.inqTitle("클래스 예약 문의")
				.inqContent("예약한 클래스 일정에 대해 문의드립니다.")
				.build();

		Inquiry savedInquiry =
				inquiryRepository.save(inquiry);

		System.out.println("문의번호 = " + savedInquiry.getInqNo());
		System.out.println("상태 = " + savedInquiry.getInqStatus());
		System.out.println("제목 = " + savedInquiry.getInqTitle());
	}

}
