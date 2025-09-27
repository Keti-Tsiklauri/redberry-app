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
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    const storedToken = localStorage.getItem("authToken");
    if (storedUser) setUserState(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  const setUser = (user: User | null, token?: string | null) => {
    setUserState(user);
    if (token) {
      setToken(token);
      localStorage.setItem("authToken", token);
    }
    if (user) localStorage.setItem("userData", JSON.stringify(user));
    else {
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");
    }
  };

  const logout = () => {
    setUserState(null);
    setToken(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("authToken");
    window.dispatchEvent(new Event("authStateChanged"));
  };

  return (
    <UserContext.Provider value={{ user, token, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
