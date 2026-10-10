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
 * Get the currently authenticated user.
 */
export async function getMe() {
  return api.get("/me");
}

/**
 * PATCH /me
 *
 * Update the authenticated user's profile.
 * Supports both JSON payloads and FormData avatar uploads.
 */
export async function updateProfile(payload) {
  if (payload instanceof FormData) {
    // Laravel method spoofing supports multipart form submissions.
    payload.set("_method", "PATCH");

    return api.post("/me", payload);
  }

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
