import api from "./axios";
import axios from "./axios";

const inquiryPrefix = "/api/inquiry";
const adminInquiryPrefix = "/api/admin/inquiry";

// 문의 등록
export const postInquiry = async (inquiry) => {
    const res = await api.post(
        inquiryPrefix,
        inquiry
    );

    return res.data.data;
};


// 내 문의 목록
// TODO: JWT 로그인 기능 완성 후 로그인 회원 기준으로 사용
export const getMyInquiryList = async (inqMemNo) => {
    const res = await api.get(
        `${inquiryPrefix}/my`,
        {
            params: {
                inqMemNo,
            },
        }
    );

    return res.data.data;
};


// 문의 상세 조회
export const getInquiry = async (repNo) => {
    const res = await api.get(
        `${inquiryPrefix}/${repNo}`
    );

    return res.data.data;
};


// 관리자 문의 목록 + 검색 + 상태 필터 + 페이징
export const getAdminInquiryList = async ({
    page = 1,
    size = 10,
    keyword = "",
    status = "",
} = {}) => {

    const res = await api.get(
        adminInquiryPrefix,
        {
            params: {
                page,
                size,
                keyword,
                status,
            },
        }
    );

    return res.data.data;
};


// 관리자 문의 상세 조회
export const getAdminInquiry = async (repNo) => {
    const res = await api.get(
        `${adminInquiryPrefix}/${repNo}`
    );

    return res.data.data;
};


// 관리자 문의 상태 변경
export const patchInquiryStatus = async (
    repNo,
    inqStatus
) => {

    const res = await api.patch(
        `${adminInquiryPrefix}/${repNo}/status`,
        {
            inqStatus,
        }
    );

    return res.data.data;
};


// 관리자 문의 답변 등록/수정
export const patchInquiryComment = async (
    repNo,
    admComment
) => {

    const res = await api.patch(
        `${adminInquiryPrefix}/${repNo}/comment`,
        {
            admComment,
        }
    );

    return res.data.data;
};