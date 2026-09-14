import api from "./api";

/*
|--------------------------------------------------------------------------
| Comparison Service
|--------------------------------------------------------------------------
|
| Authenticated comparison history API.
|
| Backend endpoint:
| GET /me/comparisons
|
*/

/**
 * Get authenticated user's comparison history.
 *
 * GET /me/comparisons
 *
 * @returns {Promise<Array>}
 */
export async function getComparisons() {
  const response = await api.get("/me/comparisons");

  return response?.data ?? [];
}

export default {
  getComparisons,
};
