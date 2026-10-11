const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://software-empire-backend.vercel.app/api/v1"
).replace(/\/+$/, "");

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  // Atur Content-Type JSON hanya jika request memiliki body
  // dan body tersebut bukan FormData.
  if (options.body != null && !isFormData) {
    headers["Content-Type"] = "application/json";
  } else {
    // Jangan mengirim Content-Type JSON untuk FormData.
    // Browser perlu menentukan multipart boundary sendiri.
    delete headers["Content-Type"];
    delete headers["content-type"];
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Response kosong atau bukan JSON.
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`,
    );

    error.status = response.status;
    error.errors = data?.errors || null;
    error.data = data;

    throw error;
  }

  return data;
}

function serializeBody(body) {
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}

const api = {
  get(endpoint, options = {}) {
    return request(endpoint, {
      ...options,
      method: "GET",
    });
  },

  post(endpoint, body = {}, options = {}) {
    return request(endpoint, {
      ...options,
      method: "POST",
      body: serializeBody(body),
    });
  },

  put(endpoint, body = {}, options = {}) {
    return request(endpoint, {
      ...options,
      method: "PUT",
      body: serializeBody(body),
    });
  },

  patch(endpoint, body = {}, options = {}) {
    return request(endpoint, {
      ...options,
      method: "PATCH",
      body: serializeBody(body),
    });
  },

  delete(endpoint, options = {}) {
    return request(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};

export { api };
export default api;
