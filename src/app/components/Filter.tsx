"use client";
import Image from "next/image";
import { useState } from "react";
import SortByDropdown from "./SortByDropdown";
import PriceFilter from "./PriceFilter";
interface FilterProps {
  onSortChange: (option: string) => void;
  selectedSort: string;
  selectedFrom: number | null;
  selectedTo: number | null;
  onPriceChange: (from: number | null, to: number | null) => void;
}

export default function Filter({
  onSortChange,
  selectedSort,
  onPriceChange,
  selectedFrom,
  selectedTo,
}: FilterProps) {
  const [showSort, setShowSort] = useState(false);
  const [showPriceSort, setShowPriceSort] = useState(false);

  const handleSortSelect = (option: string) => {
    onSortChange(option);
    setShowSort(false);
  };

  return (
    <div className="w-[1720px] flex justify-between mx-auto relative">
      <p className="w-[190px] h-[63px] font-poppins font-semibold text-[42px] leading-[63px] text-[#10151F]">
        Products
      </p>

      <div className="flex gap-8 items-center">
        {/* Price filter button */}
        <div
          className="flex gap-2 cursor-pointer"
          onClick={() => setShowPriceSort((prev) => !prev)}
        >
          <Image src="./filter.svg" alt="filter" width={24} height={24} />
          <p className="w-[38px] h-[24px] font-poppins font-normal text-[16px] leading-[24px] text-[#10151F]">
            Filter
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex flex-col relative">
          <div
            className="flex cursor-pointer items-center"
            onClick={() => setShowSort((prev) => !prev)}
          >
            <p className="w-[56px] h-[24px] font-poppins font-normal text-[16px] leading-[24px] text-[#10151F]">
              Sort by
            </p>
            <Image
              alt="dropdown"
              width={20}
              height={20}
              src="./chevron-down.svg"
            />
          </div>

          {/* Sort options */}
          {showSort && (
            <div className="absolute right-0 mt-8 z-10">
              <SortByDropdown
                selected={selectedSort}
                onSelect={handleSortSelect}
              />
            </div>
          )}

          {/* Price filter dropdown */}
          {showPriceSort && (
            <div className="absolute right-0 mt-8 z-10">
              <PriceFilter
                selectedFrom={selectedFrom}
                selectedTo={selectedTo}
                onApply={(from, to) => {
                  onPriceChange(from, to); // update parent state
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
