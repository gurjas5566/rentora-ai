import API from "./axiosConfig";

export const getAllProperties = async () => {
  const response = await API.get("/properties");
  return response.data;
};

export const getPropertyById = async (id) => {
  const response = await API.get(`/properties/${id}`);
  return response.data;
};

export const searchProperties = async (params) => {
  const response = await API.get("/properties/search", { params });
  return response.data;
};

export const createProperty = async (propertyData) => {
  const response = await API.post("/properties", propertyData);
  return response.data;
};

export const updateProperty = async (id, propertyData) => {
  const response = await API.put(`/properties/${id}`, propertyData);
  return response.data;
};

export const deleteProperty = async (id) => {
  const response = await API.delete(`/properties/${id}`);
  return response.data;
};

export const approveProperty = async (id) => {
  const response = await API.put(`/properties/${id}/approve`);
  return response.data;
};

export const rejectProperty = async (id) => {
  const response = await API.put(`/properties/${id}/reject`);
  return response.data;
};

export const getMyListings = async () => {
  const response = await API.get("/properties/my-listings");
  return response.data;
};
