export function storeAuth(user: any, token: string) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

export function loadAuth() {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!user || !token) return null;

  try {
    return { user: user ? JSON.parse(user) : null, token };
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}
