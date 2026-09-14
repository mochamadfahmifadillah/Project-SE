const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  // Jangan set Content-Type untuk FormData.
  // Browser akan mengatur multipart boundary secara otomatis.
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Response tidak memiliki JSON body.
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`,
    );

    // Simpan informasi tambahan untuk kebutuhan
    // validation/error handling di component.
    error.status = response.status;
    error.errors = data?.errors || null;
    error.data = data;

    throw error;
  }

  return data;
}

const api = {
  get(endpoint, options = {}) {
    return request(endpoint, {
      method: "GET",
      ...options,
    });
  },

  post(endpoint, body = {}, options = {}) {
    return request(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    });
  },

  put(endpoint, body = {}, options = {}) {
    return request(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    });
  },

  patch(endpoint, body = {}, options = {}) {
    return request(endpoint, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    });
  },

  delete(endpoint, options = {}) {
    return request(endpoint, {
      method: "DELETE",
      ...options,
    });
  },
};

export { api };
export default api;
