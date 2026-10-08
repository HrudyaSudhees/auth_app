const API_URL = "http://localhost:8000";

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    if (Array.isArray(data.detail)) {
        const messages = data.detail.map((error) => error.msg);
        throw new Error(messages.join(", "));
    }
    
    throw new Error(data.detail || "Registration failed.");
}

  return data;
}

export async function loginUser(usernameOrEmail, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username_or_email: usernameOrEmail,
      password: password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed.");
  }

  return data;
}

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function logoutUser() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Logout failed.");
  }

  return data;
}

export async function updateProfile(profileData) {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    if (Array.isArray(data.detail)) {
      const messages = data.detail.map((error) => error.msg);
      throw new Error(messages.join(", "));
    }

    throw new Error(data.detail || "Profile update failed.");
  }

  return data;
}

export async function changePassword(currentPassword, newPassword) {
  const response = await fetch(`${API_URL}/auth/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (Array.isArray(data.detail)) {
      const messages = data.detail.map((error) => error.msg);
      throw new Error(messages.join(", "));
    }

    throw new Error(data.detail || "Password change failed.");
  }

  return data;
}