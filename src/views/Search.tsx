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
  isFavorite: boolean;
}

function Search() {
  const [query, setQuery] = useState(
    new URLSearchParams(window.location.search).get("query") || ""
  );

  const authStore = useAuthStore((state) => state);

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("query") || "");
  }, []);

  const { isLoading, error, data } = useQuery(
    ["search", query],
    () =>
      fetch(`${BASE_URL}/products/search`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }).then((res) => res.json()),
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const products: Product[] = data?.products ?? [];

  if (data?.favorites) {
    products.forEach((product) => {
      const productInFavorites = data.favorites.find(
        (favorite: any) => favorite.product === product.id
      );

      if (productInFavorites) {
        Object.assign(product, { isFavorite: true });
      }
    });
  }

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
            inFavorites={false}
            isAuthenticated={authStore.isAuthenticated}
          />
        ))}
      </div>
    </main>
  );
}

export default Search;
