import { useQuery } from "react-query";
import CarouselComponent from "../components/Carousel";
import { BASE_URL } from "../store/config";
import { CategoryDiv } from "../components/CategoryDiv";
import { Link } from "react-router-dom";

interface Category {
  id: number;
  name: string;
  image: string;
}

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

function Home() {
  const { isLoading, error, data } = useQuery("home", () =>
    fetch(`${BASE_URL}`).then((res) => res.json())
  );

  const categories: Category[] = data?.categories ?? [];
  const companies: Company[] = data?.companies ?? [];
  const offers: Offer[] = data?.offers ?? [];

  if (isLoading) return <p>Loading...</p>;

  document.title = "Talgtna | الرئيسية";

  if (error) return <p>An error has occurred: {(error as Error).message}</p>;

  return (
    <>
      <CarouselComponent offers={offers} />
      <main>
        <div className="w-full overflow-x-scroll grid place-items-center">
          <div className="w-full flex items-center gap-2 md:gap-5 px-2 md:px-5 my-3 justify-center">
            {companies.map(
              (company: Company) =>
                company.soon === 0 && (
                  <Link
                    to={`/company/${company.name}`}
                    key={company.id}
                    className="bg-primary text-nowrap shadow-md text-white px-2 py-2 rounded-md"
                  >
                    {company.name}
                  </Link>
                )
            )}
          </div>
        </div>
        <div className="my-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-5 px-2 md:px-5 place-items-center">
          {categories.map((category: Category) => (
            <CategoryDiv key={category.id} {...category} />
          ))}
        </div>
      </main>
    </>
  );
}

export default Home;
