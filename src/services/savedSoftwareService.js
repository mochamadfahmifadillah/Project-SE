import api from "./api";

/*
|--------------------------------------------------------------------------
| Saved Software Service
|--------------------------------------------------------------------------
|
| Authenticated saved software API.
|
| Backend endpoints:
| GET    /api/v1/me/saved-software
| POST   /api/v1/me/saved-software
| DELETE /api/v1/me/saved-software/{software}
|
*/

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const ENDPOINT = "/api/v1/me/saved-software";

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

/**
 * Get authenticated user's saved software.
 *
 * GET /api/v1/me/saved-software
 */
export async function getSavedSoftware() {
  const response = await api.get(ENDPOINT);

  return response?.data ?? [];
}

/**
 * Save software to user's shortlist.
 *
 * POST /api/v1/me/saved-software
 *
 * @param {number|string} softwareId
 */
export async function saveSoftware(softwareId) {
  if (!softwareId) {
    throw new Error("Software wajib dipilih.");
  }

  const response = await api.post(ENDPOINT, {
    software_id: Number(softwareId),
  });

  return response?.data ?? null;
}

/**
 * Remove software from user's shortlist.
 *
 * DELETE /api/v1/me/saved-software/{software}
 *
 * @param {number|string} softwareId
 */
export async function removeSavedSoftware(softwareId) {
  if (!softwareId) {
    throw new Error("Software wajib dipilih.");
  }

  const response = await api.delete(
    `${ENDPOINT}/${softwareId}`,
  );

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {
  getSavedSoftware,
  saveSoftware,
  removeSavedSoftware,
};
