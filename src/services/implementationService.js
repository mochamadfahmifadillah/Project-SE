import api from "./api";

/*
|--------------------------------------------------------------------------
| Implementation Service
|--------------------------------------------------------------------------
|
| Backend endpoints:
|
| GET  /me/implementation-requests
| POST /implementation-requests
|
| Requires authentication.
|
*/

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const ENDPOINT = "/implementation-requests";
const MY_ENDPOINT = "/me/implementation-requests";

/*
|--------------------------------------------------------------------------
| Get Implementation Requests
|--------------------------------------------------------------------------
*/

/**
 * Get implementation requests belonging
 * to the authenticated user.
 *
 * GET /me/implementation-requests
 */
export async function getImplementationRequests() {
  const response = await api.get(MY_ENDPOINT);

  return response?.data ?? [];
}

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

/**
 * Validate implementation request payload.
 */
function validatePayload(payload) {
  const requiredFields = {
    company_name: "Nama perusahaan wajib diisi.",
    contact_name: "Nama kontak wajib diisi.",
    email: "Email wajib diisi.",
    phone: "Nomor telepon wajib diisi.",
    software_id: "Software wajib dipilih.",
  };

  for (const [field, message] of Object.entries(requiredFields)) {
    if (!payload[field]) {
      throw new Error(message);
    }
  }
}

/*
|--------------------------------------------------------------------------
| Create Implementation Request
|--------------------------------------------------------------------------
*/

/**
 * Create implementation request.
 *
 * POST /implementation-requests
 *
 * Body:
 * {
 *   company_name: string,
 *   contact_name: string,
 *   email: string,
 *   phone: string,
 *   software_id: number,
 *   message?: string
 * }
 */
export async function createImplementationRequest(payload = {}) {
  validatePayload(payload);

  const response = await api.post(ENDPOINT, {
    company_name: payload.company_name,
    contact_name: payload.contact_name,
    email: payload.email,
    phone: payload.phone,
    software_id: Number(payload.software_id),
    message: payload.message || "",
  });

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {
  getImplementationRequests,
  createImplementationRequest,
};
