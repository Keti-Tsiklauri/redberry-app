"use client";

import { useEffect, useState } from "react";
import ProductsGrid from "./ProductsGrid";
import Pagination from "./Pagination";
import Filter from "./filter/Filter";
import FilterTag from "./filter/FilterTagProps";

interface Product {
  id: number;
  name: string;
  cover_image: string;
  price: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  // Filters state
  const [priceFrom, setPriceFrom] = useState<number | null>(null);
  const [priceTo, setPriceTo] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState("New products first");

  const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      if (priceFrom !== null)
        params.append("filter[price_from]", priceFrom.toString());
      if (priceTo !== null)
        params.append("filter[price_to]", priceTo.toString());

      if (sortOption === "New products first")
        params.append("sort", "created_at");
      if (sortOption === "Price: Low to High") params.append("sort", "price");
      if (sortOption === "Price: High to Low") params.append("sort", "-price");

      const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setProducts(data.data || []);
      setLastPage(data.meta?.last_page || 1);
      setTotalResults(data.meta?.total || 0);
      setResultsPerPage(data.meta?.per_page || 10);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unexpected error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, priceFrom, priceTo, sortOption]);

  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className="flex flex-col items-center">
      {/* Header + Filters */}
      <div className="w-[1720px] flex flex-row  justify-between items-center mx-auto ">
        <p className="w-[190px] h-[63px] font-poppins font-semibold text-[42px] leading-[63px] text-[#10151F]">
          Products
        </p>
        <div className="flex flex-row gap-8 w-[500px]">
          <p className="text-gray-600 whitespace-nowrap">
            Showing {startResult}–{endResult} of {totalResults} results
          </p>

          <Filter
            selectedFrom={priceFrom}
            selectedTo={priceTo}
            selectedSort={sortOption}
            onPriceChange={(from, to) => {
              setPriceFrom(from);
              setPriceTo(to);
              setCurrentPage(1);
            }}
            onSortChange={(sort) => {
              setSortOption(sort);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
      <div className="w-[1720px] float-left">
        <FilterTag
          from={priceFrom}
          to={priceTo}
          onClear={() => {
            setPriceFrom(null);
            setPriceTo(null);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Products List */}

      {/* Products List + Pagination */}
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <ProductsGrid products={products} />

          {products.length > 0 && (
            <div className="w-full flex justify-center mt-6">
              <Pagination
                totalPages={lastPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
