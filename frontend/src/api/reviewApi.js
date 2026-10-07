import api from "./axios";

export const postReview = async (review) => {
    const response = await api.post("/api/reviews", review);

    return response.data;
};