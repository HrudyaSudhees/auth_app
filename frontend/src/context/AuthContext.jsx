import { createContext, useContext, useEffect, useState } from "react";

import {
  changePassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  updateProfile,
} from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthentication() {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
      setLoading(false);
    }

    checkAuthentication();
  }, []);

  async function login(usernameOrEmail, password) {
    const loggedInUser = await loginUser(usernameOrEmail, password);

    setUser(loggedInUser);

    return loggedInUser;
  }

  async function logout() {
    await logoutUser();

    setUser(null);
  }

  async function updateUserProfile(profileData) {
    const updatedUser = await updateProfile(profileData);

    setUser(updatedUser);

    return updatedUser;
  }

  async function updatePassword(currentPassword, newPassword) {
    return await changePassword(currentPassword, newPassword);
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUserProfile,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}