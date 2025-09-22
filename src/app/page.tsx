import ProductsList from "./components/ProductsList";

import Header from "./components/header/Header";

export default function Home() {
  return (
    <div>
      {/* Header */}
      <div>
        <Header />
        {/* Main content */}
        <ProductsList />
      </div>
    </div>
  );
}
