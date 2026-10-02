import axios from "./axios";

const prefix = "/api/reservation";

export const createReservation = async (data) => {
    const response = await axios.post(prefix, data)
    return response.data;
}

export const countReservation = async (schNo, rsvCount) => {
    const response = await axios.get(`${prefix}/count`, { params: { schNo, rsvCount } })
    return response.data;
}

export const getReservation = async (rsvNo) => {
    const response = await axios.get(`${prefix}/${rsvNo}`)
    return response.data;
}

export const getReservationListByMember = async (memNo) => {
    const response = await axios.get(`${prefix}/member/${memNo}`)
    return response.data;
}

export const cancelReservation = async (rsvNo, rsvCancelReason) => {
    const response = await axios.patch(`${prefix}/${rsvNo}/cancel`, { rsvCancelReason })
    return response.data;
}
