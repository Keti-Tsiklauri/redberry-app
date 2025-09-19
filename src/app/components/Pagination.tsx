"use client";
import React from "react";
import Image from "next/image";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getPages = () => {
    const pages: (number | string)[] = [];

    // Show current and next
    pages.push(currentPage, currentPage + 1);

    // If not near the end → add dots
    if (currentPage + 2 < totalPages - 1) {
      pages.push("...");
    }

    // Always include last two
    pages.push(totalPages - 1, totalPages);

    // Deduplicate + validate
    return Array.from(new Set(pages))
      .filter(
        (p) =>
          (typeof p === "number" && p >= 1 && p <= totalPages) || p === "..."
      )
      .sort((a, b) =>
        typeof a === "number" && typeof b === "number" ? a - b : 0
      );
  };

  const pages = getPages();

  return (
    <div className="flex justify-center items-center mt-10 gap-2">
      {/* Prev */}
      <Image
        src="./chevron-left.svg"
        alt="prev"
        width={20}
        height={20}
        onClick={handlePrev}
        className={`${
          currentPage === 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
        }`}
      />

      {/* Page buttons */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`dots-${idx}`}
            className="w-8 h-8 flex justify-center items-center text-gray-400"
          >
            {page}
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(Number(page))}
            className={`w-8 h-8 flex justify-center items-center rounded font-[500] text-[14px] leading-[20px] font-[Poppins] ${
              page === currentPage
                ? "border border-[#FF4000] text-[#FF4000]" // Active style
                : "text-[#212B36] opacity-60 hover:bg-gray-200" // Default style
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <Image
        src="./chevron-right.svg"
        alt="next"
        width={20}
        height={20}
        onClick={handleNext}
        className={`${
          currentPage === totalPages
            ? "opacity-30 cursor-not-allowed"
            : "cursor-pointer"
        }`}
      />
    </div>
  );
}
