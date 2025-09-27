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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addMessage, setAddMessage] = useState("");

  const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";

  const {
    cart,
    isAuthenticated,
    isLoading: cartLoading,
    error: cartError,
    addToCart,
    getItemQuantity,
    isItemInCart,
  } = useCart();

  // Fetch product details
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
        const data: Product = await res.json();

        setProduct(data);
        setSelectedImage(data.images?.[0] || data.cover_image || null);
        setSelectedColor(data.available_colors?.[0] || null);
        setSelectedSize(data.available_sizes?.[0] || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleColorClick = (color: string, index: number) => {
    setSelectedColor(color);
    if (product?.images?.[index]) setSelectedImage(product.images[index]);
  };

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    if (product?.available_colors?.[index])
      setSelectedColor(product.available_colors[index]);
  };

  const handleAddToCart = async () => {
    if (!product || !selectedColor || !selectedSize) {
      setAddMessage("Please select color and size");
      setTimeout(() => setAddMessage(""), 3000);
      return;
    }

    if (!isAuthenticated) {
      setAddMessage("Please log in to add items to cart");
      setTimeout(() => setAddMessage(""), 3000);
      return;
    }

    setIsAddingToCart(true);
    setAddMessage("");

    try {
      await addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        quantity,
        color: selectedColor,
        size: selectedSize,
        image: selectedImage || product.cover_image || "/placeholder.png",
      });

      setAddMessage("✅ Item added to cart successfully!");
    } catch (err: any) {
      console.error("Failed to add to cart:", err);
      setAddMessage("❌ Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
      setTimeout(() => setAddMessage(""), 3000);
    }
  };

  // Check if current product variant is in cart
  const currentItemQuantity =
    product && selectedColor && selectedSize
      ? getItemQuantity(product.id.toString(), selectedColor, selectedSize)
      : 0;

  const isCurrentItemInCart =
    product && selectedColor && selectedSize
      ? isItemInCart(product.id.toString(), selectedColor, selectedSize)
      : false;

  // Only disable if missing selections or currently adding - NOT based on auth
  const isDisabled =
    !selectedColor || !selectedSize || isAddingToCart || cartLoading;

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div>
      <Header />

      {/* Breadcrumb */}
      <div className="mb-8 w-[1820px] mx-auto text-[14px] text-[#10151F] flex gap-2">
        <Link href="/" className="hover:underline">
          Listing
        </Link>
        <span>/</span>
        <span className="text-[#3E424A]">Product</span>
      </div>

      <div className="flex w-[1820px] h-[1230px] justify-between mx-auto">
        {/* Left: Images */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            {product.images?.length ? (
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
                    alt={`${product.name} - ${index + 1}`}
                    width={120}
                    height={160}
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="w-[120px] h-[160px] bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-500 text-sm">No images</span>
              </div>
            )}
          </div>

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

        {/* Right: Info */}
        <div className="w-[700px] flex flex-col gap-14">
          <div>
            <h1 className="text-[32px] font-semibold text-[#10151F]">
              {product.name}
            </h1>
            <p className="text-[32px] font-semibold text-[#10151F]">
              ${product.price}
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-6">
            {/* Colors */}
            {product.available_colors?.length > 0 && (
              <div>
                <p className="mb-2 text-[16px] text-[#10151F]">
                  Color: {selectedColor}
                </p>
                <div className="flex gap-3">
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
              <div>
                <p className="mb-2 text-[16px] text-[#10151F]">
                  Size: {selectedSize}
                </p>
                <div className="flex gap-3">
                  {product.available_sizes.map((size) => (
                    <div
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 w-[70px] h-[42px] rounded-[10px] flex items-center justify-center cursor-pointer transition-colors ${
                        selectedSize === size
                          ? "bg-[#F8F6F7] border-2 border-[#10151F]"
                          : "border border-[#E1DFE1] hover:border-[#10151F]"
                      }`}
                    >
                      <span className="text-[16px] text-[#10151F]">{size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="mb-2 text-[16px] text-[#10151F]">Quantity</p>
              <div className="relative w-[70px] h-[42px]">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="appearance-none w-full h-full border border-[#E1DFE1] rounded-[10px] px-2 pr-6 text-[16px] font-poppins text-[#10151F] cursor-pointer focus:border-[#10151F] focus:outline-none"
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
                  alt="dropdown"
                  width={20}
                  height={20}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>

            {/* Cart Item Info */}
            {isCurrentItemInCart && (
              <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-3">
                <p className="text-blue-800 text-sm">
                  This item is already in your cart (Quantity:{" "}
                  {currentItemQuantity})
                </p>
              </div>
            )}

            {/* Add to Cart Button */}
            <div>
              <Button
                imageSrc="/shopping.svg"
                text={
                  isAddingToCart
                    ? "Adding..."
                    : cartLoading
                    ? "Loading..."
                    : "Add to Cart"
                }
                onClick={handleAddToCart}
                height="60px"
                width="700px"
                disabled={isDisabled}
              />
            </div>

            {/* Messages */}
            <div className="min-h-[60px] space-y-2">
              {!isAuthenticated && (
                <div className="text-sm">
                  <p className="text-amber-600 inline mr-2">
                    Please log in to add items to the cart.
                  </p>
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Log in
                  </Link>
                </div>
              )}

              {addMessage && (
                <p
                  className={`text-sm font-poppins ${
                    addMessage.includes("success")
                      ? "text-green-600"
                      : addMessage.includes("Failed") ||
                        addMessage.includes("Please")
                      ? "text-red-600"
                      : "text-amber-600"
                  }`}
                >
                  {addMessage}
                </p>
              )}

              {cartError && (
                <p className="text-sm font-poppins text-red-600">
                  Cart Error: {cartError}
                </p>
              )}
            </div>
          </div>

          <hr className="border-[#E1DFE1]" />

          {/* Details */}
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-[20px] font-medium text-[#10151F]">
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
            <div className="mt-4 flex flex-col gap-4 text-[16px] text-[#3E424A]">
              {product.brand?.name && <p>Brand: {product.brand.name}</p>}
              {product.description && (
                <p className="line-clamp-3">{product.description}</p>
              )}
              {product.release_year && (
                <p>
                  Release Year: {new Date(product.release_year).getFullYear()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
