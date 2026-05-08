import API from "./axiosConfig";

export const chatWithAI = async (message) => {
  const response = await API.post("/ai/chat", { message });
  return response.data;
};

export const estimatePrice = async (propertyData) => {
  const response = await API.post("/ai/estimate-price", propertyData);
  return response.data;
};

export const getRecommendations = async (preferences) => {
  const response = await API.post("/ai/recommendations", preferences);
  return response.data;
};
