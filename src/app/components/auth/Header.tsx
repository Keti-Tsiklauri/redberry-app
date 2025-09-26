"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Logo from "../logo/Logo";
import Cart from "../cart/Cart";
import { useGlobal } from "../context/globalcontext";

interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
}

export default function Header() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { showCart, setShowCart } = useGlobal();

  // Load token and user from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("userData");

    setToken(savedToken);
    setUser(savedUser ? JSON.parse(savedUser) : null);

    // Listen for changes to localStorage (cross-tab logout/login)
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("authToken");
      const updatedUser = localStorage.getItem("userData");

      setToken(updatedToken);
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("username");

    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setToken(null);
    setUser(null);
  };

  return (
    <header className="flex justify-between items-center mx-auto py-[10px] w-[1920px] h-[80px] bg-white">
      {showCart && <Cart />}
      <Logo />

      <div className="flex items-center gap-3">
        <Image
          src="/shopping-cart.svg"
          width={24}
          height={24}
          alt="shopping cart"
          className="cursor-pointer"
          onClick={() => setShowCart(true)}
        />
        <div className="flex gap-2 items-center">
          {/* Avatar */}
          {user?.avatar ? (
            <div className="w-10 h-10 rounded-full overflow-hidden flex-none">
              <Image
                src={user.avatar}
                width={40}
                height={40}
                alt={`${user.username} avatar`}
                className="rounded-full"
              />
            </div>
          ) : (
            <Image
              src="/person-placeholder.svg"
              width={40}
              height={40}
              alt="placeholder avatar"
              className="rounded-full"
            />
          )}

          {/* Login / Logout */}
          {token ? (
            <button
              onClick={handleLogout}
              className="cursor-pointer hover:underline w-[50px] h-[28px] font-poppins font-medium text-[#10151F] whitespace-nowrap"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              className="cursor-pointer hover:underline w-[50px] h-[28px] font-poppins font-medium text-[#10151F] whitespace-nowrap"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
