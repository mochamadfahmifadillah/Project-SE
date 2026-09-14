import api from "./api";

const ADMIN_SOFTWARE_ENDPOINT = "/admin/software";

/*
|--------------------------------------------------------------------------
| Get Admin Software
|--------------------------------------------------------------------------
*/

export async function getAdminSoftware(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === "All"
    ) {
      return;
    }

    query.append(key, String(value));
  });

  const queryString = query.toString();

  const endpoint = queryString
    ? `${ADMIN_SOFTWARE_ENDPOINT}?${queryString}`
    : ADMIN_SOFTWARE_ENDPOINT;

  const response = await api.get(endpoint);

  return response?.data ?? [];
}

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export async function createAdminSoftware(payload) {
  const response = await api.post(
    ADMIN_SOFTWARE_ENDPOINT,
    payload,
  );

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Get Detail
|--------------------------------------------------------------------------
*/

export async function getAdminSoftwareById(id) {
  if (!id) {
    return null;
  }

  const response = await api.get(
    `${ADMIN_SOFTWARE_ENDPOINT}/${id}`,
  );

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export async function updateAdminSoftware(id, payload) {
  const response = await api.put(
    `${ADMIN_SOFTWARE_ENDPOINT}/${id}`,
    payload,
  );

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export async function deleteAdminSoftware(id) {
  if (!id) {
    return null;
  }

  const response = await api.delete(
    `${ADMIN_SOFTWARE_ENDPOINT}/${id}`,
  );

  return response;
}

export default {
  getAdminSoftware,
  createAdminSoftware,
  getAdminSoftwareById,
  updateAdminSoftware,
  deleteAdminSoftware,
};