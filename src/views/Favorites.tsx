import { useQuery } from "react-query";
import ProductCard from "../components/Product";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BASE_URL } from "../store/config";

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

function Favorites() {
  const token = useAuthStore((state) => state.token);
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  if (!isAuth) {
    toast.error("يجب عليك تسجيل الدخول");
    navigate("/");
  }

  const { isLoading, error, data } = useQuery("favorites", () =>
    fetch(`${BASE_URL}/user/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json())
  );

  document.title = "EasyCookFrozen | المفضلات";

  const products: Product[] = data?.products ?? [];
  console.log(products);
  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>An error has occurred: {(error as Error).message}</p>;
  return (
    <div className="container">
      <div className="products my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-5">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} isFavorite={true} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
