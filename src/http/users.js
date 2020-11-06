import request, { constructAuthHeader } from "./request";

const BASE_URL = "/users";

export async function getUsers({ username = null, patient = false }) {
  let queryParams = "";
  if (username && patient) {
    queryParams += `?username=${encodeURIComponent(username)}&patient=true`;
  } else if (username) {
    queryParams += `?username=${encodeURIComponent(username)}`;
  } else if (patient) {
    queryParams += `?patient=true`;
  }

  return await request(`${BASE_URL}/${queryParams}`, {});
}

export async function signIn(username, password) {
  return await request(`${BASE_URL}/signin`, {
    method: "POST",
    data: {
      username,
      password,
    },
  });
}

export async function signUp(userData) {
  return await request(BASE_URL, {
    method: "POST",
    data: userData,
  });
}

export async function editUser(userId, token, data, multiPart = false) {
  const url = `${BASE_URL}/${userId}`;
  return await request(url, {
    method: "PUT",
    data,
    headers: constructAuthHeader(token),
    multiPart,
  });
}

export async function getById(userId) {
  return await request(`${BASE_URL}/${userId}`, {});
}
