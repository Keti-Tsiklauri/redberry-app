import "./globals.css";

import { CartProvider } from "./components/CartContext";
import { GlobalProvider } from "./components/context/globalcontext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <CartProvider>{children}</CartProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
