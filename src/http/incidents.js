import { SERVER_URL_DEV } from "./constants";
import request, { constructAuthHeader } from "./request";

const BASE_URL = SERVER_URL_DEV + "/incidents";

export async function get(userId, token) {
  return await request(`${BASE_URL}/${userId}`, {
    headers: constructAuthHeader(token),
  });
}

export async function postIncident(data, token) {
  return await request(BASE_URL, {
    method: "POST",
    headers: constructAuthHeader(token),
    data,
  });
}
