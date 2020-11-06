import request from "./request";

const BASE_URL = "/guides";

export async function getGuides() {
  return await request(BASE_URL, {});
}

export async function getById(id) {
  return await request(`${BASE_URL}/${id}`, {});
}

export async function addGuide(token, data) {
  return await request(BASE_URL, {
    method: "POST",
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function vote(id, token, data) {
  return await request(`${BASE_URL}/votes/${id}`, {
    method: "POST",
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getVotes(id, token) {
  return await request(`${BASE_URL}/votes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
