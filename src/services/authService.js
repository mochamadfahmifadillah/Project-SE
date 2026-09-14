import api from "./api";

/*
|--------------------------------------------------------------------------
| Authentication Service
|--------------------------------------------------------------------------
*/

/**
 * POST /api/v1/register
 */
export async function registerUser(payload) {
  return api.post("/api/v1/register", payload);
}

/**
 * POST /api/v1/login
 */
export async function loginUser(payload) {
  return api.post("/api/v1/login", payload);
}

/**
 * GET /api/v1/me
 */
export async function getMe() {
  return api.get("/api/v1/me");
}

/**
 * POST /api/v1/logout
 */
export async function logoutUser() {
  return api.post("/api/v1/logout");
}

export default {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};
