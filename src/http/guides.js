import request, { constructAuthHeader } from "./request";

const BASE_URL = "/guides";

export async function getGuides(token) {
  return await request(BASE_URL, {
    headers: constructAuthHeader(token),
  });
}

export async function getById(id, token) {
  return await request(`${BASE_URL}/${id}`, {
    headers: constructAuthHeader(token),
  });
}

export async function addGuide(token, data) {
  return await request(BASE_URL, {
    method: "POST",
    data,
    headers: constructAuthHeader(token),
  });
}

export async function vote(id, token, data) {
  return await request(`${BASE_URL}/votes/${id}`, {
    method: "POST",
    data,
    headers: constructAuthHeader(token),
  });
}

export async function getVotes(id, token) {
  return await request(`${BASE_URL}/votes/${id}`, {
    headers: constructAuthHeader(token),
  });
}
