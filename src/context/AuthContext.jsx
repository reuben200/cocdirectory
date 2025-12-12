import { createContext, useState, useEffect, useContext } from "react";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("church_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (username) => {
    setLoading(true);

    // Fetch mock users
    try {
      const response = await fetch("/users.json");
      const users = await response.json();
      const foundUser = users.find((u) => u.username === username);

      if (!foundUser) {
        setLoading(false);
        return false;
      }

      setUser(foundUser);
      localStorage.setItem("church_user", JSON.stringify(foundUser));
    } catch (error) {
      console.error("Login error:", error);
    }

    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("church_user");
  };

  const value = { user, login, logout, loading, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easy usage
export const useAuth = () => {
  return useContext(AuthContext);
};
export default AuthContext;