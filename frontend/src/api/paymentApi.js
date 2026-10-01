import axios from "./axios";

const prefix = "/api/payment";

export const createPayment = async (rsvNo) => {
    const response = await axios.post(prefix, { rsvNo })
    return response.data;
}
    
export const confirmPayment = async (data) => {
    const response = await axios.post(`${prefix}/confirm`, data)
    return response.data;
}
    
export const getPayment = async (payNo) => {
    const response = await axios.get(`${prefix}/${payNo}`)
    return response.data;
}

export const getPaymentByReservation = async (rsvNo) => {
    const response = await axios.get(`${prefix}/reservation/${rsvNo}`)
    return response.data;
}

export const cancelPaymentByReservation = async (rsvNo) => {
    const response = await axios.patch(`${prefix}/reservation/${rsvNo}/cancel`)
    return response.data;
}