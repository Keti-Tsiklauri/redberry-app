"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
  total_price: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    item: CartItem
  ) => Promise<{ success: boolean; needsAuth?: boolean; error?: string }>;
  updateQuantity: (
    id: string,
    quantity: number,
    color?: string,
    size?: string
  ) => Promise<{ success: boolean; needsAuth?: boolean }>;
  removeFromCart: (
    id: string,
    color?: string,
    size?: string
  ) => Promise<{ success: boolean; needsAuth?: boolean }>;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";

  // Helper to get token and headers with validation
  const getHeaders = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("Using auth token:", token.substring(0, 20) + "..."); // Debug log
    }

    return { headers, token };
  };

  // Check auth status
  useEffect(() => {
    const checkAuth = () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      setIsAuthenticated(!!token);
      console.log("Auth status checked, token exists:", !!token);
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom auth events
    const handleAuthChange = () => checkAuth();
    window.addEventListener("authStateChanged", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChanged", handleAuthChange);
    };
  }, []);

  // Refresh cart function
  const refreshCart = async () => {
    const { headers, token } = getHeaders();
    if (!token) {
      setCart([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching cart from API...");
      const res = await fetch(`${API_BASE_URL}/cart/products`, {
        method: "GET",
        headers,
      });

      console.log("Cart fetch response status:", res.status);

      if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setCart([]);
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch cart: ${res.status}`);
      }

      const data = await res.json();
      console.log("Cart data received:", data);
      setCart(data.products || []);
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      setError(err.message || "Failed to fetch cart");
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart from API
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  // Add item to cart
  const addToCart = async (
    item: CartItem
  ): Promise<{ success: boolean; needsAuth?: boolean; error?: string }> => {
    const { headers, token } = getHeaders();

    if (!token) {
      console.log("No auth token found, user needs to log in");
      return { success: false, needsAuth: true };
    }

    try {
      setIsLoading(true);
      setError(null);

      // Prepare request data - ensure we're sending the right format
      const requestData = {
        quantity: Number(item.quantity),
        color: item.color || null,
        size: item.size || null,
      };

      // Remove null values if the API doesn't accept them
      const cleanedData = Object.entries(requestData).reduce(
        (acc, [key, value]) => {
          if (value !== null) {
            acc[key] = value;
          }
          return acc;
        },
        {} as any
      );

      console.log("Adding to cart - Request details:", {
        url: `${API_BASE_URL}/cart/products/${item.id}`,
        method: "POST",
        headers: Object.keys(headers),
        data: cleanedData,
      });

      const res = await fetch(`${API_BASE_URL}/cart/products/${item.id}`, {
        method: "POST",
        headers,
        body: JSON.stringify(cleanedData),
      });

      console.log("Add to cart response status:", res.status);
      console.log("Response headers:", res.headers);

      // Check content type
      const contentType = res.headers.get("content-type");
      let responseData;
      let responseText = "";

      try {
        if (contentType && contentType.includes("application/json")) {
          responseData = await res.json();
          console.log("JSON response data:", responseData);
        } else {
          responseText = await res.text();
          console.log("Non-JSON response:", responseText.substring(0, 500));
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
      }

      // Handle different response statuses
      if (res.status === 401) {
        console.log("401 Unauthorized - token might be expired");
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        window.dispatchEvent(new Event("authStateChanged"));
        return {
          success: false,
          needsAuth: true,
          error: "Authentication expired. Please log in again.",
        };
      }

      if (res.status === 422) {
        const errorMsg =
          responseData?.message ||
          "Invalid product data. Please check color, size, and quantity.";
        console.error("422 Validation error:", errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      if (res.status === 404) {
        const errorMsg = "Product not found";
        console.error("404 Not found");
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      if (res.status >= 500) {
        const errorMsg = "Server error. Please try again later.";
        console.error(`Server error ${res.status}`);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      if (!res.ok) {
        const errorMsg =
          responseData?.message || `Failed to add item (${res.status})`;
        console.error("Request failed:", errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Success! Update local cart state
      console.log("Successfully added to cart");

      // Option 1: Update local state optimistically
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (i) =>
            i.id === item.id && i.color === item.color && i.size === item.size
        );
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += item.quantity;
          updated[existingIndex].total_price =
            updated[existingIndex].price * updated[existingIndex].quantity;
          return updated;
        }
        return [...prev, { ...item, total_price: item.price * item.quantity }];
      });

      // Option 2: Refresh cart from server to ensure consistency
      // Uncomment this if you want to always sync with server after adding
      // await refreshCart();

      return { success: true };
    } catch (err: any) {
      console.error("Unexpected error adding to cart:", err);
      const errorMsg = err.message || "Failed to add item to cart.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (
    id: string,
    quantity: number,
    color?: string,
    size?: string
  ): Promise<{ success: boolean; needsAuth?: boolean }> => {
    const { headers, token } = getHeaders();
    if (!token) {
      return { success: false, needsAuth: true };
    }

    try {
      setIsLoading(true);
      setError(null);

      const requestData = {
        quantity: Number(quantity),
        color: color || null,
        size: size || null,
      };

      // Remove null values
      const cleanedData = Object.entries(requestData).reduce(
        (acc, [key, value]) => {
          if (value !== null) {
            acc[key] = value;
          }
          return acc;
        },
        {} as any
      );

      const res = await fetch(`${API_BASE_URL}/cart/products/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(cleanedData),
      });

      if (res.status === 401) {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        window.dispatchEvent(new Event("authStateChanged"));
        return { success: false, needsAuth: true };
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update quantity");
      }

      setCart((prev) =>
        prev.map((item) =>
          item.id === id && item.color === color && item.size === size
            ? { ...item, quantity, total_price: item.price * quantity }
            : item
        )
      );

      return { success: true };
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      setError(err.message || "Failed to update quantity.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item
  const removeFromCart = async (
    id: string,
    color?: string,
    size?: string
  ): Promise<{ success: boolean; needsAuth?: boolean }> => {
    const { headers, token } = getHeaders();
    if (!token) {
      return { success: false, needsAuth: true };
    }

    try {
      setIsLoading(true);
      setError(null);

      const requestData = {
        color: color || null,
        size: size || null,
      };

      // Remove null values
      const cleanedData = Object.entries(requestData).reduce(
        (acc, [key, value]) => {
          if (value !== null) {
            acc[key] = value;
          }
          return acc;
        },
        {} as any
      );

      const res = await fetch(`${API_BASE_URL}/cart/products/${id}`, {
        method: "DELETE",
        headers,
        body: JSON.stringify(cleanedData),
      });

      if (res.status === 401) {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        window.dispatchEvent(new Event("authStateChanged"));
        return { success: false, needsAuth: true };
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to remove item");
      }

      setCart((prev) =>
        prev.filter(
          (item) =>
            !(item.id === id && item.color === color && item.size === size)
        )
      );

      return { success: true };
    } catch (err: any) {
      console.error("Error removing item:", err);
      setError(err.message || "Failed to remove item.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        isLoading,
        error,
        isAuthenticated,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
