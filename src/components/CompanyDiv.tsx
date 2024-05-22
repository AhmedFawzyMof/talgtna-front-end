import { Link } from "react-router-dom";
import { IMAGE_BASE_URL } from "../store/config";

interface Company {
  id: number;
  name: string;
  image: string;
  soon: number;
}

function CompanyDiv(company: Company) {
  if (company.soon === 1) return null;
  return (
    <Link
      key={company.id}
      to={`/company/${company.name}`}
      className="bg-white h-auto shadow-md rounded-md w-full"
    >
      <img
        src={IMAGE_BASE_URL + company.image}
        alt={company.name}
        className="w-full h-[115px] rounded-md"
      />
      <p className="text-center my-1 text-primary">{company.name}</p>
    </Link>
  );
}

export default CompanyDiv;
