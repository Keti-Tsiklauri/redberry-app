"use client";

import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  cover_image: string;
  price: number;
}

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  if (!products.length) return <p>No products found.</p>;

  return (
    <div className="flex-1 w-[1720px] mx-auto grid grid-cols-4 gap-7 p-6">
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
  );
}
