import { Fragment } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import ProductCard from "../components/Product";
import { BASE_URL, IMAGE_BASE_URL } from "../store/config";

interface Company {
  id: number;
  image: string;
  name: string;
  soon: number;
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
function Company() {
  const { name } = useParams<{ name: string }>();
  const { isLoading, error, data } = useQuery("company", () =>
    fetch(`${BASE_URL}/company/${name}`).then((res) => res.json())
  );
  document.title = `EasyCookFrozen | ${name}`;

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>An error has occurred: {(error as Error).message}</p>;

  const company: Company = data?.company ?? {};
  const products: Product[] = data?.products ?? [];

  return (
    <Fragment>
      <div className="company my-3 flex flex-col sm:flex-row gap-5 bg-white rounded shadow">
        <img
          src={`${IMAGE_BASE_URL}${company.image}`}
          alt={company.name}
          className="rounded w-full md:w-[225px] shadow"
        />

        <h1 className="text-2xl font-bold mt-3 text-primary text-center">
          {company.name}
        </h1>
      </div>
      <div className="products grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-5">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} isFavorite={false} />
        ))}
      </div>
    </Fragment>
  );
}

export default Company;
