import API from "./axiosConfig";

export const register = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get("/users/profile");
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login";
};
