"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../components/button/Button";
import { useCart } from "../components/cart/CartContext";
import CartItems from "../components/cart/CartItems";
import CartSummary from "../components/cart/CartSummary";
import Header from "../components/auth/Header";
import InputField from "../components/checkout/InputField";

interface UserData {
  name: string;
  surname: string;
  email: string;
  address: string;
  zip: string;
}

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [userData, setUserData] = useState<UserData>({
    name: "",
    surname: "",
    email: "",
    address: "",
    zip: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch user data from API
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user"); // Replace with your API endpoint
        const data = await res.json();
        setUserData({
          name: data.name || "",
          surname: data.surname || "",
          email: data.email || "",
          address: data.address || "",
          zip: data.zip || "",
        });
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Example: send order + user info to backend
      await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userData, cart }),
      });

      // Clear cart after successful order
      clearCart();
      alert("Order placed successfully!");
    } catch (err) {
      console.error("Checkout failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <p
        className=" top-[152px] mx-auto py-[10px] w-[1920px] h-[63px] 
           font-poppins font-semibold text-[42px] leading-[63px] 
           text-[#10151F]"
      >
        Checkout
      </p>

      <div className="w-[1920px] flex flex-row justify-between mx-auto mt-[50px]">
        <div className="w-[1129px] h-[635px] bg-[#F8F6F7] rounded-[16px] p-[80px_47px] ">
          <p className="w-[144px] h-[33px] font-poppins font-medium text-[22px] leading-[33px] text-[#3E424A]">
            Order details
          </p>

          <div className="flex flex-col gap-6 mt-[40px]">
            <div className="flex flex-row gap-5 ">
              <InputField
                label="Name"
                value={userData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <InputField
                label="Surname"
                value={userData.surname}
                onChange={(e) => handleChange("surname", e.target.value)}
              />
            </div>

            <InputField
              label="Email"
              width="578px"
              imageSrc="/mail.svg"
              value={userData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <div className="flex flex-row gap-5 ">
              <InputField
                label="Address"
                value={userData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              <InputField
                label="Zip code"
                value={userData.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col items-center justify-center ">
            {cart.length === 0 ? (
              <>
                <p className="text-gray-500 text-lg font-medium mb-4">
                  Oops... your cart is empty
                </p>
                <Link
                  href="/"
                  className="text-white bg-[#ab7360] px-6 py-2 mb-4 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </Link>
              </>
            ) : (
              <CartItems />
            )}
          </div>

          {cart.length > 0 && (
            <div className="flex flex-col justify-between h-[250px] mt-6">
              <CartSummary />
              <Button
                text={loading ? "Processing..." : "Pay"}
                width="460px"
                onClick={handleSubmit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
