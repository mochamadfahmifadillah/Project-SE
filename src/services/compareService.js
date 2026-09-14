import api from "./api";

/*
|--------------------------------------------------------------------------
| Compare Service
|--------------------------------------------------------------------------
|
| Authenticated comparison API.
|
| Backend endpoints:
| GET  /api/v1/me/comparisons
| POST /api/v1/compare
|
*/

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const COMPARE_ENDPOINT = "/api/v1/compare";
const COMPARISONS_ENDPOINT = "/api/v1/me/comparisons";

const MIN_SOFTWARE = 2;
const MAX_SOFTWARE = 3;

/*
|--------------------------------------------------------------------------
| API - Get Comparisons
|--------------------------------------------------------------------------
*/

/**
 * Get comparisons belonging to authenticated user.
 *
 * GET /api/v1/me/comparisons
 *
 * @returns {Promise<Array>}
 */
export async function getComparisons() {
  const response = await api.get(COMPARISONS_ENDPOINT);

  return response?.data ?? [];
}

/*
|--------------------------------------------------------------------------
| API - Create Comparison
|--------------------------------------------------------------------------
*/

/**
 * Compare multiple software.
 *
 * POST /api/v1/compare
 *
 * @param {number[]} softwareIds
 * @returns {Promise<Object>}
 */
export async function compareSoftware(softwareIds = []) {
  validateSoftwareIds(softwareIds);

  return api.post(COMPARE_ENDPOINT, {
    software_ids: softwareIds,
  });
}

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

/**
 * Validate software IDs before sending request.
 */
function validateSoftwareIds(softwareIds) {
  if (!Array.isArray(softwareIds)) {
    throw new Error("Software IDs harus berupa array.");
  }

  if (softwareIds.length < MIN_SOFTWARE) {
    throw new Error(
      `Minimal pilih ${MIN_SOFTWARE} software untuk dibandingkan.`,
    );
  }

  if (softwareIds.length > MAX_SOFTWARE) {
    throw new Error(`Maksimal ${MAX_SOFTWARE} software dapat dibandingkan.`);
  }
}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {
  getComparisons,
  compareSoftware,
};
