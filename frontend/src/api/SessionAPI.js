import axios from "axios";

const API_URL = "/api/v1/sessions";

export const getSessions = async () => {
  const response = await axios.get(`${API_URL}/`, { withCredentials: true });
  return response.data;
};

export const revokeSession = async (sessionId) => {
  const response = await axios.delete(`${API_URL}/${sessionId}`, { withCredentials: true });
  return response.data;
};

export const revokeAllOtherSessions = async () => {
  const response = await axios.post(`${API_URL}/revoke-others`, {}, { withCredentials: true });
  return response.data;
};

export const revokeAllSessions = async () => {
  const response = await axios.post(`${API_URL}/revoke-all`, {}, { withCredentials: true });
  return response.data;
};
