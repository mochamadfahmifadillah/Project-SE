import api from "./api";

/*
|--------------------------------------------------------------------------
| Recommendation Service
|--------------------------------------------------------------------------
|
| Frontend wizard memiliki 8 jawaban:
|
| - business_type
| - business_size
| - industry
| - key_needs
| - must_have_features
| - budget
| - team_size
| - integrations
|
| Backend recommendation endpoint:
|
| POST /api/v1/recommendations
|
|--------------------------------------------------------------------------
*/

export async function getRecommendations(answers = {}) {
  const {
    business_type,
    business_size,
    industry,
    key_needs,
    must_have_features,
    budget,
    team_size,
    integrations,
  } = answers;

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  if (!business_type) {
    throw new Error("Business type wajib dipilih.");
  }

  if (!business_size) {
    throw new Error("Business size wajib dipilih.");
  }

  if (!industry) {
    throw new Error("Industry wajib dipilih.");
  }

  if (!key_needs) {
    throw new Error("Key needs wajib dipilih.");
  }

  if (!budget) {
    throw new Error("Budget wajib dipilih.");
  }

  if (!team_size) {
    throw new Error("Team size wajib dipilih.");
  }

  /*
  |--------------------------------------------------------------------------
  | Request Payload
  |--------------------------------------------------------------------------
  |
  | Backend lama menggunakan `primary_need`.
  | Wizard frontend menggunakan `key_needs`.
  |
  | Jadi kita mapping di sini.
  |
  */

  const payload = {
    business_type,
    business_size,
    industry,

    // Mapping frontend -> backend
    primary_need: key_needs,

    must_have_features: Array.isArray(must_have_features)
      ? must_have_features
      : [],

    budget,

    team_size,

    integrations: Array.isArray(integrations) ? integrations : [],
  };

  console.log("Recommendation request payload:", payload);

  /*
  |--------------------------------------------------------------------------
  | API Request
  |--------------------------------------------------------------------------
  */

  const response = await api.post("/api/v1/recommendations", payload);

  console.log("Recommendation API response:", response);

  /*
  |--------------------------------------------------------------------------
  | Normalize response
  |--------------------------------------------------------------------------
  |
  | Support beberapa kemungkinan response Laravel:
  |
  | 1. { recommendations: [...] }
  | 2. { data: { recommendations: [...] } }
  | 3. { data: [...] }
  | 4. [...]
  |
  */

  const data = response?.data;

  if (!data) {
    throw new Error("Recommendation API returned an empty response.");
  }

  return data;
}

export default {
  getRecommendations,
};
