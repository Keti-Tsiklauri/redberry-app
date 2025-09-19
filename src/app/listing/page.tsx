"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../components/Logo";
import Image from "next/image";
interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
}

export default function ListingPage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("userData");

    if (!savedToken || !savedUser) {
      router.push("/login"); // redirect if not logged in
    } else {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      console.log("Token in ListingPage:", savedToken);
      console.log("User in ListingPage:", JSON.parse(savedUser));
    }
  }, [router]);

  if (!token || !user) {
    return <p>Loading...</p>; // optional loading state
  }

  return (
    <div>
      {/* header */}
      <div className="flex flex-row justify-between items-center mx-auto py-[10px] w-[1920px] h-[80px] bg-white">
        <Logo />
        <div className="flex items-center gap-3">
          <Image
            src="./shopping-cart.svg"
            width={24}
            height={24}
            alt="shopping cart"
          />
          <div className="flex gap-1">
            {user.avatar ? (
              <div className="w-10 h-10 bg-[url('/path-to-image.jpg')] flex-none order-0">
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
                src="./person-placeholder.svg"
                width={40}
                height={40}
                alt={`${user.username} avatar`}
                className="rounded-full"
              />
            )}
            <Image alt="dropdown" width={20} height={20} src="./down.svg" />
          </div>
        </div>
      </div>
    </div>
  );
}
