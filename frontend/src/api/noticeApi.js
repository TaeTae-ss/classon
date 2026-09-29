import axios from "axios";

const prefix = "/notices";

// 공지사항 목록 + 검색 + 페이징
export const getNoticeList = async ({
    page = 1,
    size = 10,
    keyword = "",
} = {}) => {
    const res = await axios.get(prefix, {
        params: {
            page,
            size,
            keyword,
        },
    });

    return res.data;
};

// 공지사항 상세 조회
export const getNotice = async (notNo) => {
    const res = await axios.get(`${prefix}/${notNo}`);

    return res.data;
};

// 공지사항 등록
export const postNotice = async (notice) => {
    const res = await axios.post(prefix, notice);

    return res.data;
};

// 공지사항 수정
export const putNotice = async (notNo, notice) => {
    const res = await axios.put(
        `${prefix}/${notNo}`,
        notice
    );

    return res.data;
};

// 공지사항 삭제
export const deleteNotice = async (notNo) => {
    const res = await axios.delete(
        `${prefix}/${notNo}`
    );

    return res.data;
};