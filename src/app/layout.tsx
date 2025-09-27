import "./globals.css";

import { CartProvider } from "./components/cart/CartContext";
import { GlobalProvider } from "./components/context/globalcontext";
import { UserProvider } from "./components/context/UserContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <UserProvider>
            <CartProvider>{children}</CartProvider>
          </UserProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
