"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import PriceFilter from "./PriceFilter";
import SortByDropdown from "./SortByDropdown";

interface FilterProps {
  onProductsChange: (products: any[]) => void; // allow any
}

export default function Filter({ onProductsChange }: FilterProps) {
  const [selectedSort, setSelectedSort] = useState("New products first");
  const [selectedFrom, setSelectedFrom] = useState<number | null>(null);
  const [selectedTo, setSelectedTo] = useState<number | null>(null);
  const [showSort, setShowSort] = useState(false);
  const [showPriceSort, setShowPriceSort] = useState(false);

  const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";

  const fetchProducts = async (
    sort: string,
    from: number | null,
    to: number | null
  ) => {
    const params = new URLSearchParams();

    if (from !== null) params.append("filter[price_from]", from.toString());
    if (to !== null) params.append("filter[price_to]", to.toString());

    if (sort === "New products first") params.append("sort", "created_at");
    if (sort === "Price: Low to High") params.append("sort", "price");
    if (sort === "Price: High to Low") params.append("sort", "-price");

    try {
      const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
      const data = await res.json();
      onProductsChange(data.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  // Refetch products whenever sort or filter changes
  useEffect(() => {
    fetchProducts(selectedSort, selectedFrom, selectedTo);
  }, [selectedSort, selectedFrom, selectedTo]);

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
          so
          {showSort && (
            <div className="absolute right-0 mt-8 z-10">
              <SortByDropdown
                selected={selectedSort}
                onSelect={(option) => {
                  setSelectedSort(option);
                  setShowSort(false);
                }}
              />
            </div>
          )}
          {/* price filter */}
          {showPriceSort && (
            <div className="absolute right-0 mt-8 z-10">
              <PriceFilter
                selectedFrom={selectedFrom}
                selectedTo={selectedTo}
                onApply={(from, to) => {
                  setSelectedFrom(from);
                  setSelectedTo(to);
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
