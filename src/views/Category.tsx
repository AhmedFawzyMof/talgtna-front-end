import { useQuery } from "react-query";
import CarouselComponent from "../components/Carousel";
import { useParams } from "react-router-dom";
import ProductCard from "../components/Product";
import { BASE_URL } from "../store/config";
import { useEffect } from "react";
import { Button } from "flowbite-react";
import { useAuthStore } from "../store/AuthStore";

interface Category {
  id: number;
  name: string;
}

interface Offer {
  id: number;
  product: number;
  image: string;
  company: string;
}

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
function Category() {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const { name } = useParams<{ name: string }>();
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["category", { name }],
    queryFn: () =>
      fetch(`${BASE_URL}/category/${name}`).then((res) => res.json()),
    enabled: false,
  });

  document.title = `EasyCookFrozen | ${name}`;

  useEffect(() => {
    refetch();
  }, [name, refetch]);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>An error has occurred: {(error as Error).message}</p>;

  const offers: Offer[] = data?.offers ?? [];
  const categories: Category[] = data?.categories ?? [];
  const products: Product[] = data?.products ?? [];

  return (
    <>
      <CarouselComponent offers={offers} />
      <div className="w-full overflow-x-scroll grid place-items-center">
        <div className="categories w-full flex items-center gap-2 md:gap-5 px-2 md:px-5 my-3 justify-center">
          {categories.map((category: Category) => (
            <Button
              href={`/category/${category.name}`}
              key={category.id}
              className="bg-primary text-nowrap shadow-md"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
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
    </>
  );
}

export default Category;
