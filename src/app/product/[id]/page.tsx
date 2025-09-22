"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/header/Header";

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
  const { id } = useParams(); // dynamic route param
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.cover_image);
    }
  }, [product]);

  const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!product) return <p>No product found</p>;
  console.log(product);
  return (
    <div>
      <Header />
      <div className=" mb-8 w-[1820px] mx-auto h-[21px] left-[100px] top-[110px] font-poppins font-light text-[14px] leading-[21px] text-[#10151F] flex flex-row">
        <Link href="/">
          <p className="text-[#10151F] font-poppins text-[14px]">Listing</p>
        </Link>
        /product
      </div>
      <div className="flex flex-row w-[1820px] h-[1230px] justify-between mx-auto">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-2">
            {product.images.map((image, id) => (
              <Image
                key={id}
                src={image} // use the current image
                alt={`product-${id}`}
                width={120}
                height={160}
                className="cursor-pointer"
                onClick={() => setSelectedImage(image)} // optional: click to change main image
              />
            ))}
          </div>
          <div className="w-[700px] h-[940px] border-1">
            <Image
              src={selectedImage || "/placeholder.png"}
              alt="product"
              width={700}
              height={940}
            />
          </div>
        </div>
        <div className="w-[700px] h-[900px] flex flex-col gap-[56px]">
          <div className="flex flex-col gap-5">
            <p className="h-[48px] font-poppins not-italic font-semibold text-[32px] leading-[48px] text-[#10151F]">
              {product.name}
            </p>
            <p className="h-[48px] font-poppins not-italic font-semibold text-[32px] leading-[48px] text-[#10151F]">
              ${product.price}
            </p>
          </div>

          <div className="w-[380px] h-[350px] gap-[48px]">
            <div className="flex flex-col gap-5">
              {/* Label, selected color */}
              <p className="h-[24px] font-poppins not-italic font-normal text-[16px] leading-[24px] text-[#10151F]">
                Color:{selectedColor}
              </p>

              {/* Colors row */}
              <div className="flex flex-row items-center gap-3 w-[150px] h-[48px]">
                {product.available_colors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer 
    ${selectedColor === color ? "border border-[#E1DFE1]" : ""}`}
                  >
                    <div
                      className="w-[28px] h-[28px] rounded-full border border-[#E1DFE1]"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                ))}
              </div>
            </div>{" "}
            <div className="flex flex-col gap-5">
              {/* Label, select size*/}
              <p className="h-[24px] font-poppins not-italic font-normal text-[16px] leading-[24px] text-[#10151F]">
                Size:{selectedSize}
              </p>

              {/* Colors row */}
              <div className="flex flex-row items-center gap-3 w-[150px] h-[48px]">
                {product.available_sizes.map((size, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`flex flex-col justify-center items-center px-4 py-[9px] gap-2 w-[70px] h-[42px] rounded-[10px] cursor-pointer 
      ${
        selectedSize === size
          ? "bg-[#F8F6F7] border border-[#10151F]" // selected state
          : "border border-[#E1DFE1]" // default state
      }`}
                  >
                    <p
                      className={`font-poppins not-italic font-normal text-[16px] leading-[24px] text-[#10151F] opacity-80 
        ${selectedSize === size ? "opacity-100 font-medium" : ""}`}
                    >
                      {size}
                    </p>
                  </div>
                ))}
              </div>
              {/* quantity selector */}
              <div className="flex flex-col gap-5">
                {/* Label */}
                <p className="w-[70px] h-[24px] font-poppins not-italic font-normal text-[16px] leading-[24px] text-[#10151F]">
                  Quantity
                </p>

                {/* Dropdown */}
                <div className="relative w-[70px] h-[42px]">
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="flex items-center appearance-none w-full h-full border border-[#E1DFE1] rounded-[10px] px-2 pr-6 text-[16px] font-poppins text-[#10151F] opacity-80 cursor-pointer"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>

                  {/* Chevron Icon */}
                  <Image
                    src="/down.svg"
                    alt="down"
                    width={20}
                    height={20}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  />
                </div>
              </div>
              <button className="cursor-pointer flex items-center justify-center gap-2 w-[704px] h-[59px] bg-[#FF4000] rounded-[10px] px-[60px] py-4 text-white font-poppins font-medium text-[18px] leading-[27px]">
                {/* Shopping cart icon */}
                <Image
                  src="/shopping.svg"
                  alt="cart"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                {/* Text */}
                Add to cart
              </button>
              <hr className="w-[704px] border border-[#E1DFE1] mt-8" />
              {/* details */}
              <div className="flex flex-col gap-[7px] w-[704px] h-[159px]">
                {/* Frame 52 */}
                <div className="flex flex-row justify-between items-center w-[704px] h-[61px] mt-8">
                  {/* Details text */}
                  <p className="w-[69px] h-[30px] font-poppins font-medium text-[20px] leading-[30px] text-[#10151F] ">
                    Details
                  </p>

                  {/* Image placeholder */}

                  <Image
                    src={product.brand.image}
                    alt={product.brand.name}
                    width={109}
                    height={60}
                  />
                </div>

                {/* Frame 53 */}
                <div className="flex flex-col gap-[19px] w-[704px] h-[91px]">
                  {/* Brand */}
                  <p className="font-poppins text-[16px] leading-[24px] text-[#3E424A]">
                    Brand:{product.brand.name}
                  </p>

                  {/* Description */}
                  <p className="font-poppins text-[16px] leading-[24px] text-[#3E424A]">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
