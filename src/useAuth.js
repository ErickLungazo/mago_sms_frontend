import { useState, useCallback, useEffect } from "react";
import { authService } from "./apiServices";

export function useAuth() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("user");
    return token && savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem("auth_token");
    return !!token;
  });
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    authService
      .me()
      .then((res) => {
        const userData = res.data.data || res.data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      })
      .catch(() => {
        // Token expired
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      const { access_token, user: userData } = response.data;

      localStorage.setItem("auth_token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
    }
  }, []);

  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      if (Array.isArray(role)) {
        return role.some((r) => user.roles?.includes(r));
      }
      return user.roles?.includes(role);
    },
    [user],
  );

  return {
    user,
    loading,
    error,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user,
  };
}

export function useApi(apiCall) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      setData(response.data?.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    queueMicrotask(fetch);
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useFormSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = useCallback(async (apiCall, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      if (onSuccess) onSuccess(response.data?.data);
      return { success: true, data: response.data?.data };
    } catch (err) {
      const message = err.response?.data?.message || "Operation failed";
      const errors = err.response?.data?.errors || {};
      setError({ message, errors });
      return { success: false, error: message, errors };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, submit };
}
