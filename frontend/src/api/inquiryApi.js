import axios from "axios";

const prefix = "/inquiries";

// 문의 등록
export const postInquiry = async (inquiry) => {
    const res = await axios.post(prefix, inquiry);

    return res.data;
};

// 특정 회원 문의 목록
export const getMemberInquiryList = async (inqMemNo) => {
    const res = await axios.get(
        `${prefix}/member/${inqMemNo}`
    );

    return res.data;
};

// 문의 상세
export const getInquiry = async (inqNo) => {
    const res = await axios.get(
        `${prefix}/${inqNo}`
    );

    return res.data;
};

// 관리자 문의 목록 + 검색 + 상태 필터 + 페이징
export const getAdminInquiryList = async ({
    page = 1,
    size = 10,
    keyword = "",
    status = "",
} = {}) => {
    const res = await axios.get(
        `${prefix}/admin`,
        {
            params: {
                page,
                size,
                keyword,
                status,
            },
        }
    );

    return res.data;
};

// 관리자 답변 + 상태 변경
export const putInquiryProcess = async (
    inqNo,
    inquiry
) => {
    const res = await axios.put(
        `${prefix}/admin/${inqNo}`,
        inquiry
    );

    return res.data;
};