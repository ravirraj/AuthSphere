export function getUser() {
  const raw = localStorage.getItem("authsphere_user");
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem("authsphere_token");
}

export function logout() {
  localStorage.removeItem("authsphere_token");
  localStorage.removeItem("authsphere_user");
}
