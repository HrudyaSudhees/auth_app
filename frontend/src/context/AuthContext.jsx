import { createContext, useContext, useEffect, useState } from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
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

  const value = {
    user,
    loading,
    login,
    logout,
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