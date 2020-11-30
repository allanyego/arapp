import request, { constructAuthHeader } from "./request";

const BASE_URL = "/appointments";

export async function getUserAppointments(userId, token) {
  return request(`${BASE_URL}/${userId}`, {
    headers: constructAuthHeader(token),
  });
}

export async function postAppointment(userId, token, data) {
  return await request(`${BASE_URL}/${userId}`, {
    method: "POST",
    headers: constructAuthHeader(token),
    data,
  });
}

export async function updateAppointment(appointmentId, token, data) {
  return await request(`${BASE_URL}/${appointmentId}`, {
    method: "PUT",
    headers: constructAuthHeader(token),
    data,
  });
}
