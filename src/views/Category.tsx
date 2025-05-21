import { useQuery } from "react-query";
import CarouselComponent from "../components/Carousel";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/Product";
import { BASE_URL } from "../config/config";
import { useAuthStore } from "../store/AuthStore";

function Category() {
  const authStore = useAuthStore((state) => state);
  const { name } = useParams<{ name: string }>();
  const { isLoading, error, data } = useQuery(["category", { name }], () =>
    fetch(`${BASE_URL}/category/${name}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    }).then((res) => res.json())
  );

  document.title = `Talagtna | ${name}`;

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>An error has occurred: {(error as Error).message}</p>;

  const offers: Offer[] = data?.offers ?? [];
  const companies: Company[] = data?.companies ?? [];
  const categories: Category[] = data?.categories ?? [];
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
                <Link
                  to={`/company/${company.name}?category=${name}`}
                  key={company.id}
                  className="bg-primary text-nowrap shadow-md text-white px-2 py-2 rounded-md"
                >
                  {company.name}
                </Link>
              )
          )}
        </div>
      </div>
      <div className="w-full overflow-x-scroll grid place-items-center">
        <div className="categories w-full flex items-center gap-2 md:gap-5 px-2 md:px-5 my-3 justify-center">
          {categories.map((category: Category) => (
            <Link
              to={`/category/${category.name}`}
              key={category.id}
              className="bg-primary text-nowrap shadow-md text-white px-2 py-2 rounded-md"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="products grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-5">
        {products.length === 0 && (
          <p className="col-span-4 text-center">لا يوجد منتجات</p>
        )}
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
