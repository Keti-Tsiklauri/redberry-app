"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src="/icon-logo.svg"
        alt="Logo"
        width={180}
        height={24}
        className="cursor-pointer"
      />
    </Link>
  );
}
