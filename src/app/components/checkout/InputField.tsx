"use client";
import Image from "next/image";
import { useState } from "react";

interface InputProps {
  label?: string;
  width?: string;
  height?: string;
  imageSrc?: string;
  defaultValue?: string;
}

export default function InputField({
  label,
  width = "277px",
  height = "42px",
  imageSrc,
  defaultValue,
}: InputProps) {
  const [value, setValue] = useState(defaultValue || "");

  return (
    <div
      className="flex justify-end items-center px-3 bg-white border border-[#E1DFE1] rounded-[8px] box-border"
      style={{ width, height }}
    >
      <div className="flex items-center gap-1 w-full h-full relative">
        {imageSrc && <Image src={imageSrc} alt="icon" width={24} height={24} />}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={label}
          className="w-full h-full bg-transparent outline-none font-poppins text-[14px] text-[#3E424A]"
        />
      </div>
    </div>
  );
}
