import api from "./api";

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

export async function getSoftware(params = {}) {
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

    query.append(key, value);
  });

  const queryString = query.toString();

  const response = await api.get(
    queryString
      ? `/software?${queryString}`
      : "/software",
  );

  return response?.data?.data ?? response?.data ?? [];
}

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

export async function getAdminSoftware() {
  const response = await api.get("/admin/software");

  return response?.data?.data ?? response?.data ?? [];
}

export async function createAdminSoftware(payload) {
  const response = await api.post(
    "/admin/software",
    payload,
  );

  return response?.data?.data ?? response?.data ?? null;
}

export async function getAdminSoftwareById(id) {
  const response = await api.get(
    `/admin/software/${id}`,
  );

  return response?.data?.data ?? response?.data ?? null;
}

export async function updateAdminSoftware(id, payload) {
  const response = await api.put(
    `/admin/software/${id}`,
    payload,
  );

  return response?.data?.data ?? response?.data ?? null;
}

export async function deleteAdminSoftware(id) {
  const response = await api.delete(
    `/admin/software/${id}`,
  );

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Public Helpers
|--------------------------------------------------------------------------
*/

export async function getSoftwareBySlug(slug) {
  if (!slug) return null;

  const response = await api.get(
    `/software/${encodeURIComponent(slug)}`,
  );

  return response?.data?.data ?? response?.data ?? null;
}

export async function searchSoftware(search) {
  return getSoftware({ search });
}

export async function getSoftwareByCategory(category) {
  return getSoftware({ category });
}

export default {
  getSoftware,
  getSoftwareBySlug,
  searchSoftware,
  getSoftwareByCategory,

  getAdminSoftware,
  createAdminSoftware,
  getAdminSoftwareById,
  updateAdminSoftware,
  deleteAdminSoftware,
};