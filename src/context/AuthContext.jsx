import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedToken) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (accessToken, refreshTokenValue) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshTokenValue);
    setToken(accessToken);
    setRefreshToken(refreshTokenValue);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch("http://localhost:8000/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      await logout();
      return false;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      setToken(data.access_token);
      setRefreshToken(data.refresh_token);
      return true;
    } catch (err) {
      await logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        isAuthenticated,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
