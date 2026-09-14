import api from "./api";

/*
|--------------------------------------------------------------------------
| Authentication Service
|--------------------------------------------------------------------------
*/

/**
 * POST /register
 */
export async function registerUser(payload) {
  return api.post("/register", payload);
}

/**
 * POST /login
 */
export async function loginUser(payload) {
  return api.post("/login", payload);
}

/**
 * GET /me
 */
export async function getMe() {
  return api.get("/me");
}

/**
 * POST /logout
 */
export async function logoutUser() {
  return api.post("/logout");
}

export default {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};
