"use client";
import { useState } from "react";

interface PriceFilterProps {
  selectedFrom: number | null;
  selectedTo: number | null;
  onApply: (from: number | null, to: number | null) => void;
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

    // Check if To is greater than From
    if (fromNum !== null && toNum !== null && toNum <= fromNum) {
      alert('"To" price must be greater than "From" price.');
      return;
    }

    onApply(fromNum, toNum);
  };

  return (
    <div className="w-[392px] h-[169px] bg-white border border-[#E1DFE1] rounded-lg flex flex-col items-start p-4 gap-5">
      <p className="w-[95px] h-[24px] font-poppins font-semibold text-[16px] leading-[24px] text-[#10151F]">
        Select price
      </p>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-row gap-2.5">
          {/* From input */}
          <div className="relative w-[175px] h-[42px] ">
            {from === "" && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <p className="font-poppins font-normal text-sm leading-[21px] text-[#3E424A]">
                  From
                </p>
              </div>
            )}
            <input
              type="number"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full h-full px-3 outline-none border border-[#E1DFE1] rounded-lg font-poppins text-sm text-[#3E424A]"
            />
          </div>

          {/* To input */}
          <div className="relative w-[175px] h-[42px]">
            {to === "" && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <p className="font-poppins font-normal text-sm leading-[21px] text-[#3E424A]">
                  To
                </p>
              </div>
            )}
            <input
              type="number"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full h-full px-3 outline-none border border-[#E1DFE1] rounded-lg font-poppins text-sm text-[#3E424A]"
            />
          </div>
        </div>

        {/* Apply button */}
        <button
          onClick={handleApply}
          className="cursor-pointer self-end flex justify-center items-center px-5 py-2.5 w-[124px] h-[41px] bg-[#FF4000] rounded-[10px] text-white font-poppins font-medium"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
