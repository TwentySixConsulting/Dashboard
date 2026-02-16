import { queryClient } from "./queryClient";

export async function apiRequest(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(data.message || "Request failed");
  }
  return res.json();
}

export async function login(email: string, password: string) {
  const data = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  queryClient.invalidateQueries({ queryKey: ["auth"] });
  return data;
}

export async function signup(userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organisationName: string;
  industry: string;
  numberOfEmployees: number;
  numberOfRoles: number;
}) {
  const data = await apiRequest("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  queryClient.invalidateQueries({ queryKey: ["auth"] });
  return data;
}

export async function logout() {
  await apiRequest("/api/auth/logout", { method: "POST" });
  queryClient.invalidateQueries({ queryKey: ["auth"] });
}

export async function fetchCurrentUser() {
  try {
    const data = await apiRequest("/api/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

export async function submitRoles(roles: Array<{
  roleTitle: string;
  currentSalary: number;
  experienceLevel: string;
  functionFamily: string;
}>) {
  return apiRequest("/api/roles", {
    method: "POST",
    body: JSON.stringify({ roles }),
  });
}

export async function fetchRoles() {
  const data = await apiRequest("/api/roles");
  return data.roles;
}
