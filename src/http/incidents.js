import request, { constructAuthHeader } from "./request";

const BASE_URL = "/incidents";

export async function getUserIncidents(userId, token) {
  return await request(`${BASE_URL}/${userId}`, {
    headers: constructAuthHeader(token),
  });
}

export async function getVideoToken(token) {
  return await request(`${BASE_URL}/video/token`, {
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

export async function shareVideoUrl(incident, shareTo, token) {
  return await request(`${BASE_URL}/video/shares/${incident}`, {
    method: "POST",
    headers: constructAuthHeader(token),
    data: {
      shareTo,
    },
  });
}

export async function deleteIncidentVideo(incident, token) {
  return await request(`${BASE_URL}/video/${incident}`, {
    method: "DELETE",
    headers: constructAuthHeader(token),
  });
}

export async function getVideoShares(userId, token) {
  return await request(`${BASE_URL}/video/shares/${userId}`, {
    headers: constructAuthHeader(token),
  });
}
