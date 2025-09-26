"use client";

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
  const [user, setUser] = useState<User | null>(null);
  const { showCart, setShowCart } = useGlobal();

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
        </div>
      </div>
    </header>
  );
}
