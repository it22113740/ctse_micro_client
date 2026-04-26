"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const TOKEN_KEY = "authToken";

export function AuthProvider({ children }) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const storedToken = window.localStorage.getItem(TOKEN_KEY) || "";
      setToken(storedToken);

      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const payload = await response.json();
        if (isMounted) {
          setUser(payload);
        }
      } catch {
        window.localStorage.removeItem(TOKEN_KEY);
        if (isMounted) {
          setToken("");
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  const saveToken = (nextToken) => {
    if (!nextToken) {
      return;
    }
    window.localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setIsLoading(true);
    (async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${nextToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
        const payload = await response.json();
        setUser(payload);
      } catch {
        window.localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const logout = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(null);
    setIsLoading(false);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user),
      saveToken,
      logout,
    }),
    [isLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
