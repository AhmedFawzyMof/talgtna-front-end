import { useQuery } from "react-query";
import CarouselComponent from "../components/Carousel";
import { useParams } from "react-router-dom";
import ProductCard from "../components/Product";
import { BASE_URL } from "../store/config";
import { useEffect } from "react";
import { Button } from "flowbite-react";
import { useAuthStore } from "../store/AuthStore";

interface Company {
  id: number;
  name: string;
  image: string;
  soon: number;
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
  isFavorite: boolean;
}
function Category() {
  const authStore = useAuthStore((state) => state);
  const { name } = useParams<{ name: string }>();
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["category", { name }],
    queryFn: () =>
      fetch(`${BASE_URL}/category/${name}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }).then((res) => res.json()),
    enabled: false,
  });

  document.title = `Talgtna | ${name}`;

  useEffect(() => {
    refetch();
  }, [name, refetch]);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>An error has occurred: {(error as Error).message}</p>;

  const offers: Offer[] = data?.offers ?? [];
  const companies: Company[] = data?.companies ?? [];
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

  return (
    <>
      <CarouselComponent offers={offers} />
      <div className="w-full overflow-x-scroll grid place-items-center">
        <div className="categories w-full flex items-center gap-2 md:gap-5 px-2 md:px-5 my-3 justify-center">
          {companies.map(
            (company: Company) =>
              company.soon === 0 && (
                <Button
                  href={`/company/${company.name}`}
                  key={company.id}
                  className="bg-primary text-nowrap shadow-md"
                >
                  {company.name}
                </Button>
              )
          )}
        </div>
      </div>
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
    </>
  );
}

export default Category;
