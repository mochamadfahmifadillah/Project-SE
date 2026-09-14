import api from "./api";

/*
|--------------------------------------------------------------------------
| Compare Service
|--------------------------------------------------------------------------
|
| Authenticated comparison API.
|
| Backend endpoints:
| GET  /me/comparisons
| POST /compare
|
*/

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const COMPARE_ENDPOINT = "/compare";
const COMPARISONS_ENDPOINT = "/me/comparisons";

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
 * GET /me/comparisons
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
 * POST /compare
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
