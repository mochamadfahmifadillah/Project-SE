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
 *
 * Get currently authenticated user.
 */
export async function getMe() {
  return api.get("/me");
}

/**
 * PATCH /me
 *
 * Update currently authenticated user's profile.
 */
export async function updateProfile(payload) {
  return api.patch("/me", payload);
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
  updateProfile,
  logoutUser,
};
