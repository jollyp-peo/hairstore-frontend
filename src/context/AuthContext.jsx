import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));
  const [loading, setLoading] = useState(false);

  // --- Helpers to persist tokens ---
  const saveSession = (data) => {
    if (data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    if (data.accessToken) {
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
    }
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    }
  };

  const clearSession = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // --- Auth actions ---
  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      saveSession(data);
      return true;
    } catch (err) {
      console.error("Login error:", err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      saveSession(data);
      return { success: true };
    } catch (err) {
      console.error("Signup error:", err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const refresh = useCallback(async () => {
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Refresh failed");
      saveSession(data);
      return true;
    } catch (err) {
      console.error("Refresh error:", err.message);
      clearSession();
      return false;
    }
  }, [refreshToken]);

  const logout = async () => {
    try {
      if (refreshToken) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (err) {
      console.warn("Logout request failed:", err.message);
    } finally {
      clearSession();
    }
  };

  // --- Auto refresh every 10 min ---
  useEffect(() => {
    if (!refreshToken) return;
    const interval = setInterval(() => refresh(), 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshToken, refresh]);

  // --- Auto-refreshing fetch wrapper ---
  const apiFetch = useCallback(
    async (url, options = {}) => {
      let res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });

      if (res.status === 401) {
        const refreshed = await refresh();
        if (!refreshed) {
          throw new Error("Session expired. Please log in again.");
        }
        res = await fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      }

      return res;
    },
    [accessToken, refresh]
  );

  // --- Role helpers ---
  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        login,
        signup,
        refresh,
        logout,
        isAdmin,
        apiFetch, // use instead of fetch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
