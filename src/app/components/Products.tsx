"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Pagination from "./Pagination";
import Filter from "./Filter";

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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [sortOption, setSortOption] = useState("");

  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.redseam.redberryinternship.ge/api/products?page=${page}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProducts(data.data);
      setLastPage(data.meta.last_page);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Sorted products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "New products first") {
      return Number(b.release_year) - Number(a.release_year);
    } else if (sortOption === "Price: Low to High") {
      return a.price - b.price;
    } else if (sortOption === "Price: High to Low") {
      return b.price - a.price;
    }
    return 0;
  });

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!products.length) return <p>No products found.</p>;

  return (
    <div className="flex flex-col items-center">
      {/* Pass sort state callback to Filter */}
      <Filter onSortChange={setSortOption} selectedSort={sortOption} />

      {/* Products grid */}
      <div className="grid grid-cols-4 gap-6 p-6">
        {sortedProducts.map((product) => (
          <div key={product.id} className="w-[412px] h-[614px] flex flex-col">
            <Image
              src={product.cover_image}
              alt={product.name}
              width={412}
              height={550}
              className="rounded"
            />
            <p className="w-[412px] h-[27px] font-poppins font-medium text-[18px] leading-[27px] text-[#10151F]">
              {product.name}
            </p>
            <p className="w-[412px] h-[24px] font-poppins font-medium text-[16px] leading-[24px] text-[#10151F]">
              ${product.price}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        totalPages={lastPage}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
