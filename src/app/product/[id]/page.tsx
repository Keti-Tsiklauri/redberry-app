"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/auth/Header";
import { useCart } from "@/app/components/cart/CartContext";
import Button from "@/app/components/button/Button";
interface Brand {
  id: number;
  name: string;
  image: string;
}

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
  brand: Brand;
  total_price: number;
  quantity: number;
  color: string;
  size: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";
  const { cart, addToCart } = useCart();
  useEffect(() => {
    console.log("🛒 Cart updated:", cart);
  }, [cart]);
  // fetch product
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);

        // set defaults: first image, first color, first size
        if (data.images.length > 0) setSelectedImage(data.images[0]);
        if (data.available_colors.length > 0)
          setSelectedColor(data.available_colors[0]);
        if (data.available_sizes.length > 0)
          setSelectedSize(data.available_sizes[0]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // sync color <-> image by index
  const handleColorClick = (color: string, index: number) => {
    setSelectedColor(color);
    setSelectedImage(product?.images[index] || null);
  };

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedColor(product?.available_colors[index] || null);
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!product) return <p>No product found</p>;
  // add to cart

  const handleAddToCart = () => {
    if (!product || !selectedColor || !selectedSize) return;

    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity,
      image: selectedImage || product.cover_image,
    };

    addToCart(newItem);
  };

  return (
    <div>
      <Header />

      {/* breadcrumb */}
      <div className="mb-8 w-[1820px] mx-auto font-poppins font-light text-[14px] leading-[21px] text-[#10151F] flex flex-row">
        <Link href="/">
          <p className="text-[#10151F] font-poppins text-[14px]">Listing</p>
        </Link>
        /product
      </div>

      <div className="flex flex-row w-[1820px] h-[1230px] justify-between mx-auto">
        {/* left images */}
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-2">
            {product.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`product-${index}`}
                width={120}
                height={160}
                className="cursor-pointer"
                onClick={() => handleImageClick(image, index)}
              />
            ))}
          </div>

          {/* main image */}
          <div className="w-[700px] h-[940px] border-1">
            <Image
              src={selectedImage || "/placeholder.png"}
              alt="product"
              width={700}
              height={940}
            />
          </div>
        </div>

        {/* right side */}
        <div className="w-[700px] h-[900px] flex flex-col gap-[56px]">
          <div className="flex flex-col gap-5">
            <p className="font-poppins font-semibold text-[32px] text-[#10151F]">
              {product.name}
            </p>
            <p className="font-poppins font-semibold text-[32px] text-[#10151F]">
              ${product.price}
            </p>
          </div>

          <div className="w-[380px] h-[350px] gap-[48px]">
            {/* Colors */}
            <div className="flex flex-col gap-5">
              <p className="font-poppins text-[16px] text-[#10151F]">
                Color: {selectedColor}
              </p>
              <div className="flex flex-row gap-3">
                {product.available_colors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => handleColorClick(color, index)}
                    className={`w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer 
                      ${
                        selectedColor === color ? "border border-[#10151F]" : ""
                      }`}
                  >
                    <div
                      className="w-[28px] h-[28px] rounded-full border border-[#E1DFE1]"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="flex flex-col gap-5 mt-6">
              <p className="font-poppins text-[16px] text-[#10151F]">
                Size: {selectedSize}
              </p>
              <div className="flex flex-row gap-3">
                {product.available_sizes.map((size, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-[9px] w-[70px] h-[42px] rounded-[10px] cursor-pointer flex items-center justify-center
                      ${
                        selectedSize === size
                          ? "bg-[#F8F6F7] border border-[#10151F]"
                          : "border border-[#E1DFE1]"
                      }`}
                  >
                    <p
                      className={`font-poppins text-[16px] text-[#10151F]
                        ${
                          selectedSize === size
                            ? "font-medium opacity-100"
                            : "opacity-80"
                        }`}
                    >
                      {size}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-5 mt-6">
              <p className="font-poppins text-[16px] text-[#10151F]">
                Quantity
              </p>
              <div className="relative w-[70px] h-[42px]">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="appearance-none w-full h-full border border-[#E1DFE1] rounded-[10px] px-2 pr-6 text-[16px] font-poppins text-[#10151F] opacity-80 cursor-pointer"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <Image
                  src="/down.svg"
                  alt="down"
                  width={20}
                  height={20}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-[40px]">
              <Button
                imageSrc="/shopping.svg"
                text="Add to Cart"
                onClick={handleAddToCart}
                height="60px"
                width="700px"
              />
            </div>

            <hr className="w-[704px] border border-[#E1DFE1] mt-8" />

            {/* Details */}
            <div className="flex flex-col gap-[7px] w-[704px] h-[159px]">
              <div className="flex flex-row justify-between items-center w-[704px] h-[61px] mt-8">
                <p className="font-poppins font-medium text-[20px] text-[#10151F]">
                  Details
                </p>
                <Image
                  src={product.brand.image}
                  alt={product.brand.name}
                  width={109}
                  height={60}
                />
              </div>
              <div className="flex flex-col gap-[19px]">
                <p className="font-poppins text-[16px] text-[#3E424A]">
                  Brand: {product.brand.name}
                </p>
                <p className="font-poppins text-[16px] text-[#3E424A]">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
