"use client";
import React from "react";

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

    // Left side: currentPage and currentPage + 1
    if (currentPage + 1 <= totalPages) {
      pages.push(currentPage, currentPage + 1);
    } else {
      pages.push(currentPage - 1, currentPage); // shift back if on last page
    }

    // Ellipsis (only if gap exists)
    if (
      Math.max(...(pages.filter((p) => typeof p === "number") as number[])) <
      totalPages - 1
    ) {
      pages.push("...");
    }

    // Right side: last two pages
    if (totalPages > 1) {
      pages.push(totalPages - 1, totalPages);
    }

    // Clean up: unique, valid, sorted
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
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="w-8 h-8 flex justify-center items-center bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        &lt;
      </button>

      {/* Page buttons */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={idx}
            className="w-8 h-8 flex justify-center items-center text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`w-8 h-8 flex justify-center items-center rounded border font-medium ${
              page === currentPage
                ? "border-[#FF4000] bg-white text-[#FF4000]"
                : "border-gray-200 bg-white text-gray-700 opacity-60"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex justify-center items-center bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
}
