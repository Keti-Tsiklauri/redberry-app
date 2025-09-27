"use client";

import Image from "next/image";
import Logo from "../logo/Logo";
import Cart from "../cart/Cart";
import { useGlobal } from "../context/globalcontext";
import { useUser } from "../context/UserContext";

export default function Header() {
  const { showCart, setShowCart } = useGlobal();

  const { user, token, ready } = useUser();

  if (!ready) return <div>Loading...</div>;

  // Safe to use user and token now
  console.log(user, token);

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

        {/* Only show user info if logged in */}
        {user && (
          <div className="flex gap-2 items-center">
            {/* Avatar */}
            {user.avatar ? (
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

            {/* Username */}
            <p className="font-poppins font-medium text-[14px] leading-[21px] text-[#10151F]">
              {user.username}
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
