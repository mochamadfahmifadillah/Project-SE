import api from "./api";

/*
|--------------------------------------------------------------------------
| Admin Service
|--------------------------------------------------------------------------
*/

const ADMIN_ENDPOINT = "/admin";

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/dashboard
 */
export async function getAdminDashboard() {
  const response = await api.get(`${ADMIN_ENDPOINT}/dashboard`);

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Analytics
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/analytics
 *
 * Supported params:
 *
 * {
 *   period: "7d",
 *   start_date: "2026-08-01",
 *   end_date: "2026-08-27"
 * }
 *
 * Response:
 *
 * {
 *   success: true,
 *   data: {
 *     overview: {
 *       total_software: 0,
 *       total_reviews: 0,
 *       total_users: 0,
 *       total_leads: 0
 *     },
 *     software: {
 *       total: 0,
 *       active: 0
 *     },
 *     reviews: {
 *       total: 0,
 *       average_rating: 0
 *     },
 *     users: {
 *       total: 0
 *     },
 *     leads: {
 *       total: 0,
 *       new: 0,
 *       won: 0,
 *       lost: 0
 *     }
 *   }
 * }
 */
export async function getAdminAnalytics(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    query.append(key, String(value));
  });

  const queryString = query.toString();

  const endpoint = queryString
    ? `${ADMIN_ENDPOINT}/analytics?${queryString}`
    : `${ADMIN_ENDPOINT}/analytics`;

  const response = await api.get(endpoint);

  return {
    data: response?.data ?? {
      overview: {
        total_software: 0,
        total_reviews: 0,
        total_users: 0,
        total_leads: 0,
      },

      software: {
        total: 0,
        active: 0,
      },

      reviews: {
        total: 0,
        average_rating: 0,
      },

      users: {
        total: 0,
      },

      leads: {
        total: 0,
        new: 0,
        won: 0,
        lost: 0,
      },
    },

    success: response?.success ?? true,
  };
}

/*
|--------------------------------------------------------------------------
| Implementation Leads
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/leads
 *
 * Supported params:
 *
 * {
 *   search: "company",
 *   status: "NEW",
 *   software_id: 1,
 *   assigned_to: 2,
 *   page: 1,
 *   per_page: 15
 * }
 */
export async function getAdminLeads(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    query.append(key, String(value));
  });

  const queryString = query.toString();

  const endpoint = queryString
    ? `${ADMIN_ENDPOINT}/leads?${queryString}`
    : `${ADMIN_ENDPOINT}/leads`;

  const response = await api.get(endpoint);

  return {
    data: Array.isArray(response?.data) ? response.data : [],
    meta: response?.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    },
    success: response?.success ?? true,
  };
}

/**
 * GET /admin/leads/{id}
 */
export async function getAdminLead(id) {
  if (!id) {
    return null;
  }

  const response = await api.get(`${ADMIN_ENDPOINT}/leads/${id}`);

  return response?.data ?? null;
}

/**
 * PUT /admin/leads/{id}
 */
export async function updateAdminLead(id, payload) {
  if (!id) {
    throw new Error("Lead ID is required.");
  }

  const response = await api.put(`${ADMIN_ENDPOINT}/leads/${id}`, payload);

  return response?.data ?? null;
}

/**
 * PATCH /admin/leads/{id}/assign
 */
export async function assignAdminLead(id, assignedTo) {
  if (!id) {
    throw new Error("Lead ID is required.");
  }

  if (!assignedTo) {
    throw new Error("Assigned admin ID is required.");
  }

  const response = await api.patch(`${ADMIN_ENDPOINT}/leads/${id}/assign`, {
    assigned_to: assignedTo,
  });

  return response?.data ?? null;
}

/**
 * PATCH /admin/leads/{id}/status
 */
export async function updateAdminLeadStatus(id, status, lostReason = null) {
  if (!id) {
    throw new Error("Lead ID is required.");
  }

  if (!status) {
    throw new Error("Lead status is required.");
  }

  const payload = {
    status,
  };

  if (lostReason !== undefined && lostReason !== null && lostReason !== "") {
    payload.lost_reason = lostReason;
  }

  const response = await api.patch(
    `${ADMIN_ENDPOINT}/leads/${id}/status`,
    payload,
  );

  return response?.data ?? null;
}

/**
 * DELETE /admin/leads/{id}
 */
export async function deleteAdminLead(id) {
  if (!id) {
    throw new Error("Lead ID is required.");
  }

  const response = await api.delete(`${ADMIN_ENDPOINT}/leads/${id}`);

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/users
 *
 * Supported params:
 *
 * {
 *   search: "fahmi",
 *   role: "admin",
 *   page: 1,
 *   per_page: 15
 * }
 */
export async function getAdminUsers(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    query.append(key, String(value));
  });

  const queryString = query.toString();

  const endpoint = queryString
    ? `${ADMIN_ENDPOINT}/users?${queryString}`
    : `${ADMIN_ENDPOINT}/users`;

  const response = await api.get(endpoint);

  return {
    data: Array.isArray(response?.data) ? response.data : [],
    meta: response?.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    },
    success: response?.success ?? true,
  };
}

/**
 * GET /admin/users/{id}
 */
export async function getAdminUser(id) {
  if (!id) {
    return null;
  }

  const response = await api.get(`${ADMIN_ENDPOINT}/users/${id}`);

  return response?.data ?? null;
}

/**
 * POST /admin/users
 */
export async function createAdminUser(payload) {
  const response = await api.post(`${ADMIN_ENDPOINT}/users`, payload);

  return response?.data ?? null;
}

/**
 * PUT /admin/users/{id}
 */
export async function updateAdminUser(id, payload) {
  if (!id) {
    throw new Error("User ID is required.");
  }

  const response = await api.put(`${ADMIN_ENDPOINT}/users/${id}`, payload);

  return response?.data ?? null;
}

/**
 * DELETE /admin/users/{id}
 */
export async function deleteAdminUser(id) {
  if (!id) {
    throw new Error("User ID is required.");
  }

  const response = await api.delete(`${ADMIN_ENDPOINT}/users/${id}`);

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Roles
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/roles
 */
export async function getAdminRoles() {
  const response = await api.get(`${ADMIN_ENDPOINT}/roles`);

  return {
    data: Array.isArray(response?.data) ? response.data : [],
    success: response?.success ?? true,
  };
}

/*
|--------------------------------------------------------------------------
| Vendors
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/vendors
 */
export async function getAdminVendors() {
  const response = await api.get(`${ADMIN_ENDPOINT}/vendors`);

  return response?.data ?? [];
}

/**
 * GET /admin/vendors/{id}
 */
export async function getAdminVendor(id) {
  if (!id) {
    return null;
  }

  const response = await api.get(`${ADMIN_ENDPOINT}/vendors/${id}`);

  return response?.data ?? null;
}

/**
 * POST /admin/vendors
 */
export async function createAdminVendor(payload) {
  const response = await api.post(`${ADMIN_ENDPOINT}/vendors`, payload);

  return response?.data ?? null;
}

/**
 * PUT /admin/vendors/{id}
 */
export async function updateAdminVendor(id, payload) {
  if (!id) {
    throw new Error("Vendor ID is required.");
  }

  const response = await api.put(`${ADMIN_ENDPOINT}/vendors/${id}`, payload);

  return response?.data ?? null;
}

/**
 * DELETE /admin/vendors/{id}
 */
export async function deleteAdminVendor(id) {
  if (!id) {
    throw new Error("Vendor ID is required.");
  }

  const response = await api.delete(`${ADMIN_ENDPOINT}/vendors/${id}`);

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/categories
 */
export async function getAdminCategories() {
  const response = await api.get(`${ADMIN_ENDPOINT}/categories`);

  return response?.data ?? [];
}

/**
 * GET /admin/categories/{id}
 */
export async function getAdminCategory(id) {
  if (!id) {
    return null;
  }

  const response = await api.get(`${ADMIN_ENDPOINT}/categories/${id}`);

  return response?.data ?? null;
}

/**
 * POST /admin/categories
 */
export async function createAdminCategory(payload) {
  const response = await api.post(`${ADMIN_ENDPOINT}/categories`, payload);

  return response?.data ?? null;
}

/**
 * PUT /admin/categories/{id}
 */
export async function updateAdminCategory(id, payload) {
  if (!id) {
    throw new Error("Category ID is required.");
  }

  const response = await api.put(`${ADMIN_ENDPOINT}/categories/${id}`, payload);

  return response?.data ?? null;
}

/**
 * DELETE /admin/categories/{id}
 */
export async function deleteAdminCategory(id) {
  if (!id) {
    throw new Error("Category ID is required.");
  }

  const response = await api.delete(`${ADMIN_ENDPOINT}/categories/${id}`);

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Features
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/features
 */
export async function getAdminFeatures() {
  const response = await api.get(`${ADMIN_ENDPOINT}/features`);

  return response?.data ?? [];
}

/**
 * GET /admin/features/{id}
 */
export async function getAdminFeature(id) {
  if (!id) {
    return null;
  }

  const response = await api.get(`${ADMIN_ENDPOINT}/features/${id}`);

  return response?.data ?? null;
}

/**
 * POST /admin/features
 */
export async function createAdminFeature(payload) {
  const response = await api.post(`${ADMIN_ENDPOINT}/features`, payload);

  return response?.data ?? null;
}

/**
 * PUT /admin/features/{id}
 */
export async function updateAdminFeature(id, payload) {
  if (!id) {
    throw new Error("Feature ID is required.");
  }

  const response = await api.put(`${ADMIN_ENDPOINT}/features/${id}`, payload);

  return response?.data ?? null;
}

/**
 * DELETE /admin/features/{id}
 */
export async function deleteAdminFeature(id) {
  if (!id) {
    throw new Error("Feature ID is required.");
  }

  const response = await api.delete(`${ADMIN_ENDPOINT}/features/${id}`);

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Industries
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/industries
 */
export async function getAdminIndustries() {
  const response = await api.get(`${ADMIN_ENDPOINT}/industries`);

  return response?.data ?? [];
}

/**
 * GET /admin/industries/{id}
 */
export async function getAdminIndustry(id) {
  if (!id) {
    return null;
  }

  const response = await api.get(`${ADMIN_ENDPOINT}/industries/${id}`);

  return response?.data ?? null;
}

/**
 * POST /admin/industries
 */
export async function createAdminIndustry(payload) {
  const response = await api.post(`${ADMIN_ENDPOINT}/industries`, payload);

  return response?.data ?? null;
}

/**
 * PUT /admin/industries/{id}
 */
export async function updateAdminIndustry(id, payload) {
  if (!id) {
    throw new Error("Industry ID is required.");
  }

  const response = await api.put(`${ADMIN_ENDPOINT}/industries/${id}`, payload);

  return response?.data ?? null;
}

/**
 * DELETE /admin/industries/{id}
 */
export async function deleteAdminIndustry(id) {
  if (!id) {
    throw new Error("Industry ID is required.");
  }

  const response = await api.delete(`${ADMIN_ENDPOINT}/industries/${id}`);

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Business Sizes
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/business-sizes
 */
export async function getAdminBusinessSizes() {
  const response = await api.get(`${ADMIN_ENDPOINT}/business-sizes`);

  return response?.data ?? [];
}

/**
 * GET /admin/business-sizes/{id}
 */
export async function getAdminBusinessSize(id) {
  if (!id) {
    return null;
  }

  const response = await api.get(`${ADMIN_ENDPOINT}/business-sizes/${id}`);

  return response?.data ?? null;
}

/**
 * POST /admin/business-sizes
 */
export async function createAdminBusinessSize(payload) {
  const response = await api.post(`${ADMIN_ENDPOINT}/business-sizes`, payload);

  return response?.data ?? null;
}

/**
 * PUT /admin/business-sizes/{id}
 */
export async function updateAdminBusinessSize(id, payload) {
  if (!id) {
    throw new Error("Business Size ID is required.");
  }

  const response = await api.put(
    `${ADMIN_ENDPOINT}/business-sizes/${id}`,
    payload,
  );

  return response?.data ?? null;
}

/**
 * DELETE /admin/business-sizes/{id}
 */
export async function deleteAdminBusinessSize(id) {
  if (!id) {
    throw new Error("Business Size ID is required.");
  }

  const response = await api.delete(`${ADMIN_ENDPOINT}/business-sizes/${id}`);

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Integrations
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/integrations
 */
export async function getAdminIntegrations() {
  const response = await api.get(`${ADMIN_ENDPOINT}/integrations`);

  return response?.data ?? [];
}

/**
 * GET /admin/integrations/{id}
 */
export async function getAdminIntegration(id) {
  if (!id) {
    return null;
  }

  const response = await api.get(`${ADMIN_ENDPOINT}/integrations/${id}`);

  return response?.data ?? null;
}

/**
 * POST /admin/integrations
 */
export async function createAdminIntegration(payload) {
  const response = await api.post(`${ADMIN_ENDPOINT}/integrations`, payload);

  return response?.data ?? null;
}

/**
 * PUT /admin/integrations/{id}
 */
export async function updateAdminIntegration(id, payload) {
  if (!id) {
    throw new Error("Integration ID is required.");
  }

  const response = await api.put(
    `${ADMIN_ENDPOINT}/integrations/${id}`,
    payload,
  );

  return response?.data ?? null;
}

/**
 * DELETE /admin/integrations/{id}
 */
export async function deleteAdminIntegration(id) {
  if (!id) {
    throw new Error("Integration ID is required.");
  }

  const response = await api.delete(`${ADMIN_ENDPOINT}/integrations/${id}`);

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Partners
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/partners
 */
export async function getAdminPartners() {
  const response = await api.get(`${ADMIN_ENDPOINT}/partners`);

  return response?.data ?? [];
}

/**
 * GET /admin/partners/{id}
 */
export async function getAdminPartner(id) {
  if (!id) {
    return null;
  }

  const response = await api.get(`${ADMIN_ENDPOINT}/partners/${id}`);

  return response?.data ?? null;
}

/**
 * POST /admin/partners
 */
export async function createAdminPartner(payload) {
  const response = await api.post(`${ADMIN_ENDPOINT}/partners`, payload);

  return response?.data ?? null;
}

/**
 * PUT /admin/partners/{id}
 */
export async function updateAdminPartner(id, payload) {
  if (!id) {
    throw new Error("Partner ID is required.");
  }

  const response = await api.put(`${ADMIN_ENDPOINT}/partners/${id}`, payload);

  return response?.data ?? null;
}

/**
 * DELETE /admin/partners/{id}
 */
export async function deleteAdminPartner(id) {
  if (!id) {
    throw new Error("Partner ID is required.");
  }

  const response = await api.delete(`${ADMIN_ENDPOINT}/partners/${id}`);

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Articles
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/articles
 *
 * Supported params:
 *
 * {
 *   search: "CRM",
 *   status: "published",
 *   page: 1,
 *   per_page: 15
 * }
 */
export async function getAdminArticles(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    query.append(key, String(value));
  });

  const queryString = query.toString();

  const endpoint = queryString
    ? `${ADMIN_ENDPOINT}/articles?${queryString}`
    : `${ADMIN_ENDPOINT}/articles`;

  const response = await api.get(endpoint);

  return {
    data: Array.isArray(response?.data) ? response.data : [],
    meta: response?.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    },
  };
}

/**
 * GET /admin/articles/{id}
 */
export async function getAdminArticle(id) {
  if (!id) {
    return null;
  }

  const response = await api.get(`${ADMIN_ENDPOINT}/articles/${id}`);

  return response?.data ?? null;
}

/**
 * POST /admin/articles
 */
export async function createAdminArticle(payload) {
  const response = await api.post(`${ADMIN_ENDPOINT}/articles`, payload);

  return response?.data ?? null;
}

/**
 * PUT /admin/articles/{id}
 */
export async function updateAdminArticle(id, payload) {
  if (!id) {
    throw new Error("Article ID is required.");
  }

  const response = await api.put(`${ADMIN_ENDPOINT}/articles/${id}`, payload);

  return response?.data ?? null;
}

/**
 * DELETE /admin/articles/{id}
 */
export async function deleteAdminArticle(id) {
  if (!id) {
    throw new Error("Article ID is required.");
  }

  const response = await api.delete(`${ADMIN_ENDPOINT}/articles/${id}`);

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Reviews
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/reviews
 */
export async function getAdminReviews(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    query.append(key, String(value));
  });

  const queryString = query.toString();

  const endpoint = queryString
    ? `${ADMIN_ENDPOINT}/reviews?${queryString}`
    : `${ADMIN_ENDPOINT}/reviews`;

  const response = await api.get(endpoint);

  return {
    data: Array.isArray(response?.data) ? response.data : [],
    meta: response?.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    },
    stats: response?.stats ?? {
      pending: 0,
      approved: 0,
      published: 0,
      rejected: 0,
      total: 0,
    },
  };
}

/**
 * GET /admin/reviews/{id}
 */
export async function getAdminReview(id) {
  if (!id) {
    return null;
  }

  const response = await api.get(`${ADMIN_ENDPOINT}/reviews/${id}`);

  return response?.data ?? null;
}

/**
 * PUT /admin/reviews/{id}
 */
export async function updateAdminReview(id, payload) {
  if (!id) {
    throw new Error("Review ID is required.");
  }

  const response = await api.put(`${ADMIN_ENDPOINT}/reviews/${id}`, payload);

  return response?.data ?? null;
}

/**
 * DELETE /admin/reviews/{id}
 */
export async function deleteAdminReview(id) {
  if (!id) {
    throw new Error("Review ID is required.");
  }

  const response = await api.delete(`${ADMIN_ENDPOINT}/reviews/${id}`);

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Audit Logs
|--------------------------------------------------------------------------
*/

/**
 * GET /admin/audit-logs
 *
 * Supported params:
 *
 * {
 *   search: "updated software",
 *   action: "software.updated",
 *   user_id: 1,
 *   auditable_type: "Software",
 *   page: 1,
 *   per_page: 15
 * }
 *
 * Response:
 *
 * {
 *   success: true,
 *   data: [],
 *   meta: {
 *     current_page: 1,
 *     last_page: 1,
 *     per_page: 15,
 *     total: 0
 *   }
 * }
 */
export async function getAdminAuditLogs(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    query.append(key, String(value));
  });

  const queryString = query.toString();

  const endpoint = queryString
    ? `${ADMIN_ENDPOINT}/audit-logs?${queryString}`
    : `${ADMIN_ENDPOINT}/audit-logs`;

  const response = await api.get(endpoint);

  return {
    data: Array.isArray(response?.data) ? response.data : [],

    meta: response?.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    },

    success: response?.success ?? true,
  };
}

/**
 * GET /admin/audit-logs/{id}
 *
 * Get audit log detail.
 */
export async function getAdminAuditLog(id) {
  if (!id) {
    return null;
  }

  const response = await api.get(`${ADMIN_ENDPOINT}/audit-logs/${id}`);

  return response?.data ?? null;
}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {
  /*
  |--------------------------------------------------------------------------
  | Dashboard
  |--------------------------------------------------------------------------
  */

  getAdminDashboard,
  getAdminAnalytics,

  /*
  |--------------------------------------------------------------------------
  | Leads
  |--------------------------------------------------------------------------
  */

  getAdminLeads,
  getAdminLead,
  updateAdminLead,
  assignAdminLead,
  updateAdminLeadStatus,
  deleteAdminLead,

  /*
  |--------------------------------------------------------------------------
  | Users
  |--------------------------------------------------------------------------
  */

  getAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,

  /*
  |--------------------------------------------------------------------------
  | Roles
  |--------------------------------------------------------------------------
  */

  getAdminRoles,

  /*
  |--------------------------------------------------------------------------
  | Vendors
  |--------------------------------------------------------------------------
  */

  getAdminVendors,
  getAdminVendor,
  createAdminVendor,
  updateAdminVendor,
  deleteAdminVendor,

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  getAdminCategories,
  getAdminCategory,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,

  /*
  |--------------------------------------------------------------------------
  | Features
  |--------------------------------------------------------------------------
  */

  getAdminFeatures,
  getAdminFeature,
  createAdminFeature,
  updateAdminFeature,
  deleteAdminFeature,

  /*
  |--------------------------------------------------------------------------
  | Industries
  |--------------------------------------------------------------------------
  */

  getAdminIndustries,
  getAdminIndustry,
  createAdminIndustry,
  updateAdminIndustry,
  deleteAdminIndustry,

  /*
  |--------------------------------------------------------------------------
  | Business Sizes
  |--------------------------------------------------------------------------
  */

  getAdminBusinessSizes,
  getAdminBusinessSize,
  createAdminBusinessSize,
  updateAdminBusinessSize,
  deleteAdminBusinessSize,

  /*
  |--------------------------------------------------------------------------
  | Integrations
  |--------------------------------------------------------------------------
  */

  getAdminIntegrations,
  getAdminIntegration,
  createAdminIntegration,
  updateAdminIntegration,
  deleteAdminIntegration,

  /*
  |--------------------------------------------------------------------------
  | Partners
  |--------------------------------------------------------------------------
  */

  getAdminPartners,
  getAdminPartner,
  createAdminPartner,
  updateAdminPartner,
  deleteAdminPartner,

  /*
  |--------------------------------------------------------------------------
  | Articles
  |--------------------------------------------------------------------------
  */

  getAdminArticles,
  getAdminArticle,
  createAdminArticle,
  updateAdminArticle,
  deleteAdminArticle,

  /*
  |--------------------------------------------------------------------------
  | Reviews
  |--------------------------------------------------------------------------
  */

  getAdminReviews,
  getAdminReview,
  updateAdminReview,
  deleteAdminReview,

  /*
  |--------------------------------------------------------------------------
  | Audit Logs
  |--------------------------------------------------------------------------
  */

  getAdminAuditLogs,
  getAdminAuditLog,
};
