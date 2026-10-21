import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/me", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      return { success: true };
    } else {
      const error = await response.json();
      // Handle both string and object error details
      const errorDetail = typeof error.detail === 'object' ? error.detail : { message: error.detail };

      // Handle 422 validation errors
      if (response.status === 422) {
        return {
          success: false,
          error: "Email invalid. Introduceți un email valid.",
          detail: errorDetail,
          status: response.status
        };
      }

      return {
        success: false,
        error: errorDetail.message || error.detail,
        detail: errorDetail,
        status: response.status
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


