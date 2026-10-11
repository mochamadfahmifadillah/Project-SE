import api from "./api";

/*
|--------------------------------------------------------------------------
| Authentication Service
|--------------------------------------------------------------------------
*/

export async function registerUser(payload) {
  return api.post("/register", payload);
}

export async function loginUser(payload) {
  return api.post("/login", payload);
}

export async function getMe() {
  return api.get("/me");
}

/**
 * Update profil pengguna yang sedang login.
 *
 * JSON:
 * PATCH /me
 *
 * FormData:
 * POST /me dengan _method=PATCH
 */
export async function updateProfile(payload) {
  if (typeof FormData !== "undefined" && payload instanceof FormData) {
    // Laravel menerima multipart upload melalui POST
    // dengan method spoofing PATCH.
    payload.set("_method", "PATCH");

    return api.post("/me", payload);
  }

  return api.patch("/me", payload);
}

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
