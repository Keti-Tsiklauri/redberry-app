"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: number;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  ready: boolean;
  setUser: (user: User | null, token?: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser) setUserState(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);

    setReady(true);
  }, []);

  const setUser = (user: User | null, token?: string | null) => {
    setUserState(user);
    if (token) {
      setToken(token);
      localStorage.setItem("authToken", token);
    }

    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    } else {
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");
      setToken(null);
    }

    // Notify other components that user has changed
    window.dispatchEvent(new Event("authStateChanged"));
  };

  return (
    <UserContext.Provider value={{ user, token, ready, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
