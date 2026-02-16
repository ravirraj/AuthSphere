import api from "./axios";

/**
 * SDK related API calls for end-users
 */

export const loginLocalSDK = async (payload) => {
  const { data } = await api.post("/sdk/login-local", payload);
  return data;
};

export const verifyOTPSDK = async (payload) => {
  const { data } = await api.post("/sdk/verify-otp", payload);
  return data;
};

export const resendVerificationSDK = async (payload) => {
  const { data } = await api.post("/sdk/resend-verification", payload);
  return data;
};
