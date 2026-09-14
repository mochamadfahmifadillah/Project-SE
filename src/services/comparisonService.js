import api from "./api";

/*
|--------------------------------------------------------------------------
| Comparison Service
|--------------------------------------------------------------------------
|
| Authenticated comparison history API.
|
| Backend endpoint:
| GET /api/v1/me/comparisons
|
*/

/**
 * Get authenticated user's comparison history.
 *
 * GET /api/v1/me/comparisons
 *
 * @returns {Promise<Array>}
 */
export async function getComparisons() {
  const response = await api.get("/api/v1/me/comparisons");

  return response?.data ?? [];
}

export default {
  getComparisons,
};
