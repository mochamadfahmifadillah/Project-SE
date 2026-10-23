import api from "./api";

export async function getRecommendations(answers = {}) {
  const cleanValue = (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  };

  const cleanArray = (value) => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const payload = {
    business_type: cleanValue(answers.business_type),
    business_size: cleanValue(answers.business_size),
    industry: cleanValue(answers.industry),
    primary_need: cleanValue(answers.key_needs ?? answers.primary_need),
    must_have_features: cleanArray(answers.must_have_features),
    budget: cleanValue(answers.budget),
    team_size: cleanValue(answers.team_size),
    integrations: cleanArray(answers.integrations),
  };

  // Hapus jawaban yang kosong, tetapi pertahankan array kosong.
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  console.log("Recommendation request payload:", payload);

  const response = await api.post("/recommendations", payload);
  const data = response?.data;

  if (!data) {
    throw new Error("Recommendation API returned an empty response.");
  }

  console.log("Recommendation API response:", data);

  return data;
}

export default {
  getRecommendations,
};
