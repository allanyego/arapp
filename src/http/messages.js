import request, { constructAuthHeader } from "./request";

const BASE_URL = "/messages";

export async function getPublicThreads(token) {
  return await request(BASE_URL, {
    headers: constructAuthHeader(token),
  });
}

export async function getUserThreads(userId, token) {
  return request(`${BASE_URL}/user-threads/${userId}`, {
    headers: constructAuthHeader(token),
  });
}

export async function getThreadMessages(threadId, token) {
  return await request(`${BASE_URL}/${threadId}`, {
    headers: constructAuthHeader(token),
  });
}

export async function sendMessage(data, token) {
  return await request(BASE_URL, {
    method: "POST",
    headers: constructAuthHeader(token),
    data,
  });
}

export async function addPublicThread(data, token) {
  return await request(`${BASE_URL}/public`, {
    method: "POST",
    headers: constructAuthHeader(token),
    data,
  });
}
