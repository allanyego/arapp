import { SERVER_URL_DEV } from "./constants";
import request from "./request";

const BASE_URL = SERVER_URL_DEV + "/guides";

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
