"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Pagination from "./Pagination";
import Filter from "./filter/Filter";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useGlobal } from "./context/globalcontext";

interface Product {
  id: number;
  name: string;
  description: string;
  release_year: string;
  cover_image: string;
  images: string[];
  price: number;
  available_colors: string[];
  available_sizes: string[];
}

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { showCart } = useGlobal(); // 👈 get global showCart state

  // filters state
  const [priceFrom, setPriceFrom] = useState<number | null>(
    searchParams.get("price_from")
      ? Number(searchParams.get("price_from"))
      : null
  );
  const [priceTo, setPriceTo] = useState<number | null>(
    searchParams.get("price_to") ? Number(searchParams.get("price_to")) : null
  );
  const [sortOption, setSortOption] = useState<string>(
    searchParams.get("sort") || "New products first"
  );

  const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";

  const fetchProducts = async (
    page: number,
    from: number | null,
    to: number | null,
    sort: string
  ) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (from !== null) params.append("filter[price_from]", from.toString());
      if (to !== null) params.append("filter[price_to]", to.toString());

      if (sort === "New products first") params.append("sort", "created_at");
      if (sort === "Price: Low to High") params.append("sort", "price");
      if (sort === "Price: High to Low") params.append("sort", "-price");

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

  // Initialize page from URL params
  useEffect(() => {
    const pageFromUrl = searchParams.get("page");
    if (pageFromUrl) {
      setCurrentPage(Number(pageFromUrl));
    }
  }, [searchParams]);

  // Fetch whenever page, filters, or sort changes
  useEffect(() => {
    fetchProducts(currentPage, priceFrom, priceTo, sortOption);
  }, [currentPage, priceFrom, priceTo, sortOption]);

  // Update URL when filters change
  const updateURL = (
    page: number,
    from: number | null,
    to: number | null,
    sort: string
  ) => {
    const query: Record<string, string> = { page: page.toString() };

    if (from !== null) query.price_from = from.toString();
    if (to !== null) query.price_to = to.toString();
    if (sort && sort !== "New products first") query.sort = sort;

    const newUrl = `/?${new URLSearchParams(query).toString()}`;
    router.push(newUrl, { scroll: false });
  };

  // Apply filters
  const applyFilters = (
    from: number | null,
    to: number | null,
    sort: string
  ) => {
    setPriceFrom(from);
    setPriceTo(to);
    setSortOption(sort);
    setCurrentPage(1);
    updateURL(1, from, to, sort);
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    updateURL(pageNumber, priceFrom, priceTo, sortOption);
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!products.length) return <p>No products found.</p>;

  // Calculate result range display
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className="flex flex-col min-h-screen transition-all ">
      {showCart && (
        <div className="absolute top-0 left-0 w-screen h-screen bg-[#10151F] opacity-30 z-40" />
      )}
      <div className="w-[1720px] flex justify-between mx-auto relative">
        <p className="w-[190px] h-[63px] font-poppins font-semibold text-[42px] leading-[63px] text-[#10151F]">
          Products
        </p>
        <div className="flex items-center w-[420px] gap-6">
          <p className="text-gray-600 whitespace-nowrap">
            Showing {startResult}–{endResult} of {totalResults} results
          </p>
          {/* Filter + Sort */}
          <Filter
            selectedFrom={priceFrom}
            selectedTo={priceTo}
            selectedSort={sortOption}
            onPriceChange={(from, to) => applyFilters(from, to, sortOption)}
            onSortChange={(sort) => applyFilters(priceFrom, priceTo, sort)}
          />
        </div>
      </div>
      {/* Products grid */}
      <div className="flex-1 w-[1720px] mx-auto grid grid-cols-4 gap-6 p-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[412px] h-[614px] flex flex-col border border-gray-200 shadow-sm rounded-lg hover:shadow-md transition-shadow"
          >
            <Link href={`/product/${product.id}`} className="block h-full">
              <Image
                src={product.cover_image}
                alt={product.name}
                width={412}
                height={550}
                className="rounded-t-lg"
              />
              <p className="w-[412px] h-[27px] font-poppins font-medium text-[18px] leading-[27px] text-[#10151F] px-2 mt-2">
                {product.name}
              </p>
              <p className="w-[412px] h-[24px] font-poppins font-medium text-[16px] leading-[24px] text-[#10151F] px-2">
                ${product.price}
              </p>
            </Link>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="w-full pb-5 z-50">
        <Pagination
          totalPages={lastPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
