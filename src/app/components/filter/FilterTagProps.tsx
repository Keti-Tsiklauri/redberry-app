import React, { useState } from "react";

interface FilterTagProps {
  from?: number | null;
  to?: number | null;
  onClear: () => void;
}

export default function FilterTag({ from, to, onClear }: FilterTagProps) {
  const [visible, setVisible] = useState(true);

  if (from == null && to == null) return null; // hide if no filter

  const handleClear = () => {
    setVisible(false);
    setTimeout(() => {
      onClear();
      setVisible(true);
    }, 300);
  };

  return (
    <div
      className={`flex items-center px-4 py-2 gap-2 border border-gray-300 rounded-full max-w-[150px] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="break-words font-poppins text-[14px] font-normal leading-[21px] text-[#3E424A]">
        Price: {from}-{to}
      </span>

      <button
        onClick={handleClear}
        className="w-3 h-3 relative flex-none cursor-pointer"
        aria-label="Clear filter"
      >
        <span className="absolute w-3 h-[2px] bg-[#3E424A] rotate-45 top-1/2 left-0 -translate-y-1/2"></span>
        <span className="absolute w-3 h-[2px] bg-[#3E424A] -rotate-45 top-1/2 left-0 -translate-y-1/2"></span>
      </button>
    </div>
  );
}
