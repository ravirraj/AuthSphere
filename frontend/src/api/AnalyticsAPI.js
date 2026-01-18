import axios from "axios";

const API_URL = "/api/v1/analytics";

export const getAnalyticsOverview = async (projectId) => {
  const response = await axios.get(`${API_URL}/${projectId}/overview`, { withCredentials: true });
  return response.data;
};

export const getAnalyticsCharts = async (projectId) => {
  const response = await axios.get(`${API_URL}/${projectId}/charts`, { withCredentials: true });
  return response.data;
};

export const getRecentActivity = async (projectId) => {
  const response = await axios.get(`${API_URL}/${projectId}/recent-activity`, { withCredentials: true });
  return response.data;
};
