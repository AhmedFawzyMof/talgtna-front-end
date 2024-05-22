import { Link } from "react-router-dom";

interface Category {
  id: number;
  name: string;
}

function CategoryButton(category: Category) {
  return (
    <Link
      key={category.id}
      to={`/category/${category.name}`}
      className="bg-primary text-white px-3 py-3 rounded-md"
    >
      <p className="whitespace-nowrap">{category.name}</p>
    </Link>
  );
}

export default CategoryButton;
