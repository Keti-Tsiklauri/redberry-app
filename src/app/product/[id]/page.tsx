"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/app/components/cart/CartContext";
import Button from "@/app/components/button/Button";
import Header from "@/app/components/auth/Header";

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
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";
  const {
    addToCart,
    cart,
    isLoading: cartLoading,
    error: cartError,
    isAuthenticated,
  } = useCart();

  // debug log
  useEffect(() => {
    console.log("🛒 Cart updated:", cart);
  }, [cart]);

  // fetch product
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok)
          throw new Error(`HTTP ${res.status}: Failed to fetch product`);
        const data: Product = await res.json();

        setProduct(data);

        if (data.images?.length > 0) {
          setSelectedImage(data.images[0]);
        } else if (data.cover_image) {
          setSelectedImage(data.cover_image);
        }

        if (data.available_colors?.length > 0) {
          setSelectedColor(data.available_colors[0]);
        }

        if (data.available_sizes?.length > 0) {
          setSelectedSize(data.available_sizes[0]);
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleColorClick = (color: string, index: number) => {
    setSelectedColor(color);
    if (product?.images && product.images[index]) {
      setSelectedImage(product.images[index]);
    }
  };

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    if (product?.available_colors && product.available_colors[index]) {
      setSelectedColor(product.available_colors[index]);
    }
  };

  // add to cart with auth handling
  const handleAddToCart = async () => {
    if (!product || !selectedColor || !selectedSize) return;

    setIsAddingToCart(true);

    try {
      const result = await addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        quantity,
        color: selectedColor,
        size: selectedSize,
        image: selectedImage || product.cover_image || "/placeholder.png",
        total_price: product.price * quantity,
      });

      // If user needs authentication, redirect to login
      if (result.needsAuth) {
        return;
      }

      if (result.success) {
        // Optional: Show success message or redirect
        console.log("Item added to cart successfully!");
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isDisabled =
    !selectedColor || !selectedSize || isAddingToCart || cartLoading;

  // Dynamic button text based on auth status
  const getButtonText = () => {
    if (isAddingToCart) return "Adding...";
    if (!isAuthenticated) return "Login to Add to Cart";
    return "Add to Cart";
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div>
      <Header />
      {/* breadcrumb */}
      <div className="mb-8 w-[1820px] mx-auto font-poppins font-light text-[14px] leading-[21px] text-[#10151F] flex flex-row">
        <Link href="/">
          <p className="text-[#10151F] font-poppins text-[14px] hover:underline">
            Listing
          </p>
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#3E424A]">Product</span>
      </div>

      <div className="flex flex-row w-[1820px] h-[1230px] justify-between mx-auto">
        {/* left images */}
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-2">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedImage === image
                      ? "border-[#10151F]"
                      : "border-transparent"
                  }`}
                  onClick={() => handleImageClick(image, index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - view ${index + 1}`}
                    width={120}
                    height={160}
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="w-[120px] h-[160px] bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">No images</span>
              </div>
            )}
          </div>

          {/* main image */}
          <div className="w-[700px] h-[940px] border border-[#E1DFE1] rounded-lg overflow-hidden">
            <Image
              src={selectedImage || product.cover_image || "/placeholder.png"}
              alt={product.name}
              width={700}
              height={940}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* right side */}
        <div className="w-[700px] h-[900px] flex flex-col gap-[56px]">
          <div className="flex flex-col gap-5">
            <h1 className="font-poppins font-semibold text-[32px] text-[#10151F]">
              {product.name}
            </h1>
            <p className="font-poppins font-semibold text-[32px] text-[#10151F]">
              ${product.price}
            </p>
          </div>

          <div className="w-[380px] h-[350px] gap-[48px]">
            {/* Colors */}
            {product.available_colors?.length > 0 && (
              <div className="flex flex-col gap-5">
                <p className="font-poppins text-[16px] text-[#10151F]">
                  Color: {selectedColor}
                </p>
                <div className="flex flex-row gap-3">
                  {product.available_colors.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => handleColorClick(color, index)}
                      className={`w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer ${
                        selectedColor === color
                          ? "border-2 border-[#10151F]"
                          : "border border-[#E1DFE1]"
                      }`}
                      title={color}
                    >
                      <div
                        className="w-[28px] h-[28px] rounded-full border border-[#E1DFE1]"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.available_sizes?.length > 0 && (
              <div className="flex flex-col gap-5 mt-6">
                <p className="font-poppins text-[16px] text-[#10151F]">
                  Size: {selectedSize}
                </p>
                <div className="flex flex-row gap-3">
                  {product.available_sizes.map((size, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-[9px] w-[70px] h-[42px] rounded-[10px] cursor-pointer flex items-center justify-center transition-colors ${
                        selectedSize === size
                          ? "bg-[#F8F6F7] border-2 border-[#10151F]"
                          : "border border-[#E1DFE1] hover:border-[#10151F]"
                      }`}
                    >
                      <p
                        className={`font-poppins text-[16px] text-[#10151F] ${
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
            )}

            {/* Quantity */}
            <div className="flex flex-col gap-5 mt-6">
              <p className="font-poppins text-[16px] text-[#10151F]">
                Quantity
              </p>
              <div className="relative w-[70px] h-[42px]">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="appearance-none w-full h-full border border-[#E1DFE1] rounded-[10px] px-2 pr-6 text-[16px] font-poppins text-[#10151F] opacity-80 cursor-pointer focus:border-[#10151F] focus:outline-none"
                  disabled={isAddingToCart}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <Image
                  src="/down.svg"
                  alt="dropdown arrow"
                  width={20}
                  height={20}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>

            {/* Add to Cart */}

            {/* Add to Cart */}
            <div className="mt-[40px]">
              <Button
                imageSrc="/shopping.svg"
                text={getButtonText()}
                onClick={handleAddToCart}
                height="60px"
                width="700px"
                disabled={isDisabled || !isAuthenticated} // disable if not logged in
              />
            </div>

            {/* Messages under button */}
            <div className="mt-2 font-poppins text-sm">
              {!isAuthenticated && (
                <div className="flex flex-row items-center gap-1">
                  <p className="text-amber-600 whitespace-nowrap">
                    Sorry, you can't add items to the cart. You need to log in
                    first.
                  </p>
                  <Link
                    href="/login"
                    className="text-blue-600 hover:underline font-medium whitespace-nowrap"
                  >
                    Log in
                  </Link>
                </div>
              )}
            </div>
          </div>

          <hr className="w-[704px] border border-[#E1DFE1] mt-8" />

          {/* Details */}
          <div className="flex flex-col gap-[7px] w-[704px] h-[159px]">
            <div className="flex flex-row justify-between items-center w-[704px] h-[61px] mt-8">
              <h2 className="font-poppins font-medium text-[20px] text-[#10151F]">
                Details
              </h2>
              {product.brand?.image && (
                <Image
                  src={product.brand.image}
                  alt={product.brand.name}
                  width={109}
                  height={60}
                  className="object-contain"
                />
              )}
            </div>
            <div className="flex flex-col gap-[19px]">
              {product.brand?.name && (
                <p className="font-poppins text-[16px] text-[#3E424A]">
                  Brand: {product.brand.name}
                </p>
              )}
              {product.description && (
                <p className="font-poppins text-[16px] text-[#3E424A] line-clamp-3">
                  {product.description}
                </p>
              )}
              {product.release_year && (
                <p className="font-poppins text-[14px] text-[#3E424A]">
                  Release Year:{" "}
                  {new Date(product.release_year).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
