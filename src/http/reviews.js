import request, { constructAuthHeader } from "./request";

const BASE_URL = "/reviews";

export async function getUserReview(userId, token) {
  return await request(`${BASE_URL}/${userId}`, {
    headers: constructAuthHeader(token),
  });
}

export async function getUserReviews(token) {
  return await request(BASE_URL, {
    headers: constructAuthHeader(token),
  });
}

export async function getUserRating(userId, token) {
  return await request(`${BASE_URL}/${userId}?rating=true`, {
    headers: constructAuthHeader(token),
  });
}

export async function addReview(userId, token, data) {
  return await request(`${BASE_URL}/${userId}`, {
    method: "POST",
    data,
    headers: constructAuthHeader(token),
  });
}
