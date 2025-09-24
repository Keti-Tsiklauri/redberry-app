"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import PriceFilter from "./PriceFilter";
import SortByDropdown from "./SortByDropdown";

interface FilterProps {
  selectedFrom: number | null;
  selectedTo: number | null;
  selectedSort: string;
  onPriceChange: (from: number | null, to: number | null) => void;
  onSortChange: (sort: string) => void;
}

export default function Filter({
  selectedFrom,
  selectedTo,
  selectedSort,
  onPriceChange,
  onSortChange,
}: FilterProps) {
  const [showSort, setShowSort] = useState(false);
  const [showPriceSort, setShowPriceSort] = useState(false);

  const [localFrom, setLocalFrom] = useState<number | null>(selectedFrom);
  const [localTo, setLocalTo] = useState<number | null>(selectedTo);
  const [localSort, setLocalSort] = useState(selectedSort);

  // Sync local state if props change (for URL updates)
  useEffect(() => {
    setLocalFrom(selectedFrom);
    setLocalTo(selectedTo);
    setLocalSort(selectedSort);
  }, [selectedFrom, selectedTo, selectedSort]);

  return (
    <div className="w-[1720px] flex justify-between mx-auto relative">
      <div className="flex gap-8 items-center">
        {/* Price filter button */}
        <div
          className="flex gap-2 cursor-pointer"
          onClick={() => setShowPriceSort((prev) => !prev)}
        >
          <Image src="/filter.svg" alt="filter" width={24} height={24} />
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
              src="/chevron-down.svg"
            />
          </div>

          {showSort && (
            <div className="absolute right-0 mt-8 z-10">
              <SortByDropdown
                selected={localSort}
                onSelect={(option) => {
                  setLocalSort(option);
                  onSortChange(option); // notify parent
                  setShowSort(false);
                }}
              />
            </div>
          )}

          {/* Price filter */}
          {showPriceSort && (
            <div className="absolute right-0 mt-8 z-10">
              <PriceFilter
                selectedFrom={localFrom}
                selectedTo={localTo}
                onApply={(from, to) => {
                  setLocalFrom(from);
                  setLocalTo(to);
                  onPriceChange(from, to); // notify parent
                  setShowPriceSort(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
