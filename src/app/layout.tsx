import "./globals.css";

import { CartProvider } from "./components/cart/CartContext";
import { GlobalProvider } from "./components/context/globalcontext";
import Header from "./components/auth/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <CartProvider>
            <Header />
            {children}
          </CartProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
