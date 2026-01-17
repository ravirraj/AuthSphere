
import api from "./axios";

export const getDashboardStats = async () => {
  try {
    const { data } = await api.get("/developers/stats");
    return data;
  } catch (error) {
    if (error?.response?.data) {
      throw new Error(error.response.data.message || "Failed to fetch stats");
    }
    throw error;
  }
};
