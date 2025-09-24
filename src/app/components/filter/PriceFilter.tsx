"use client";
import { useState } from "react";
import Button from "../button/Button";
interface PriceFilterProps {
  selectedFrom: number | null;
  selectedTo: number | null;
  onApply: (from: number | null, to: number | null) => void; // only price range
}

export default function PriceFilter({
  selectedFrom,
  selectedTo,
  onApply,
}: PriceFilterProps) {
  const [from, setFrom] = useState<string>(selectedFrom?.toString() || "");
  const [to, setTo] = useState<string>(selectedTo?.toString() || "");

  const handleApply = () => {
    const fromNum = from ? Number(from) : null;
    const toNum = to ? Number(to) : null;

    if (fromNum !== null && toNum !== null && toNum <= fromNum) {
      alert('"To" price must be greater than "From" price.');
      return;
    }

    onApply(fromNum, toNum); // ✅ just pass numbers, parent handles API
  };

  return (
    <div className="w-[392px] h-[169px] bg-white border border-[#E1DFE1] rounded-lg flex flex-col items-start p-4 gap-5">
      <p className="w-[95px] h-[24px] font-poppins font-semibold text-[16px] leading-[24px] text-[#10151F]">
        Select price
      </p>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-row gap-2.5">
          {/* From input */}
          <input
            type="number"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-[175px] h-[42px] px-3 border border-[#E1DFE1] rounded-lg"
          />
          {/* To input */}
          <input
            type="number"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-[175px] h-[42px] px-3 border border-[#E1DFE1] rounded-lg"
          />
        </div>

        <div className="self-end">
          <Button
            text="Apply"
            onClick={handleApply}
            width="124px"
            height="41px"
          />
        </div>
      </div>
    </div>
  );
}
