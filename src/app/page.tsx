"use client";
import { useEffect, useState } from "react";
import Logo from "./components/Logo";
import Image from "next/image";
import ProductsList from "./components/ProductsList";
import Link from "next/link";

interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
}

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("userData");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      console.log("Token in Home:", savedToken);
      console.log("User in Home:", JSON.parse(savedUser));
    }
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-row justify-between items-center mx-auto py-[10px] w-[1920px] h-[80px] bg-white">
        <Logo />

        <div className="flex items-center gap-3">
          <Image
            src="./shopping-cart.svg"
            width={24}
            height={24}
            alt="shopping cart"
          />
          <div className="flex gap-1 items-center">
            {user?.avatar ? (
              <div className="w-10 h-10 rounded-full overflow-hidden flex-none order-0">
                <Image
                  src={user?.avatar}
                  width={40}
                  height={40}
                  alt={`${user?.username} avatar`}
                  className="rounded-full"
                />
              </div>
            ) : (
              <Image
                src="./person-placeholder.svg"
                width={40}
                height={40}
                alt={`${user?.username} avatar`}
                className="rounded-full"
              />
            )}

            {user && token ? (
              ""
            ) : (
              <Link
                href="/login"
                className=" cursor-pointer hover:underline w-[50px] h-[28px] font-poppins not-italic font-medium   text-[#10151F]"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <ProductsList />
    </div>
  );
}
