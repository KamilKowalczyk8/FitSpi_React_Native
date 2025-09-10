const API_URL = process.env.EXPO_PUBLIC_API_URL; 

async function request(path: string, options: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Błąd połączenia");
  }
  return data;
}

export function registerUser(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: { email: string; password: string }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
