import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { BASE_URL } from "../store/config";
import ProductCard from "../components/Product";
import { useAuthStore } from "../store/AuthStore";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  company: string;
  description: string;
  offer: number;
  available: number;
}

function Search() {
  const [query, setQuery] = useState(
    new URLSearchParams(window.location.search).get("query") || ""
  );

  const isAuth = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("query") || "");
  }, []);

  const { isLoading, error, data } = useQuery(
    ["search", query],
    () =>
      fetch(`${BASE_URL}/products/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }).then((res) => res.json()),
    {
      staleTime: 1000 * 60 * 5, // data is fresh for 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const products: Product[] = data?.products ?? [];

  if (products.length === 0) {
    return (
      <main>
        <h1>No products found</h1>
      </main>
    );
  }

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>An error has occurred: {(error as Error).message}</p>;

  return (
    <main className="grid place-items-center">
      <h1>تم البحث عن: {query}</h1>
      <div className="products grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-5">
        {products.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={false}
            isAuthenticated={isAuth}
          />
        ))}
      </div>
    </main>
  );
}

export default Search;
