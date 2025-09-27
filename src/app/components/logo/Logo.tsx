"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <div onClick={handleLogoClick} className="cursor-pointer">
      <Image
        src="/Logo.svg"
        alt="Logo"
        width={180}
        height={24}
        className="cursor-pointer"
      />
    </div>
  );
}
