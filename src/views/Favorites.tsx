import { useQuery } from "react-query";
import ProductCard from "../components/Product";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BASE_URL } from "../config/config";

function Favorites() {
  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();

  if (!authStore.isAuthenticated) {
    toast.error("يجب عليك تسجيل الدخول");
    navigate("/");
  }

  const { isLoading, error, data } = useQuery("favorites", () =>
    fetch(`${BASE_URL}/user/favorites`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    }).then((res) => res.json())
  );

  document.title = "Talgtna | المفضلات";

  const products: Product[] = data?.products ?? [];

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>An error has occurred: {(error as Error).message}</p>;

  authStore.favoritesNumber(data.favorites);
  return (
    <>
      {products.length === 0 && (
        <div className="w-full h-screen grid place-items-center">
          <p>لا يوجد منتجات في المفضلات</p>
        </div>
      )}
      <div className="products my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-5">
        {products.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            inFavorites={true}
            isAuthenticated={authStore.isAuthenticated}
          />
        ))}
      </div>
    </>
  );
}

export default Favorites;
