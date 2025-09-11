import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";
import { useEffect, useState } from "react";

export function PaginationNav({
  numberOfPages,
  pageName,
  setLimit,
}: {
  numberOfPages: number;
  pageName: string;
  setLimit: (limit: number) => void;
}) {
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem(pageName) ?? "1")
  );
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem(pageName, page.toString());
    setLimit(50 * page);
  };

  useEffect(() => {
    handlePageChange(parseInt(localStorage.getItem(pageName) ?? "1"));
  }, []);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <ArrowBigRightDash
            onClick={() =>
              handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)
            }
            className="cursor-pointer"
          />
        </PaginationItem>
        {[...Array(numberOfPages)].map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePageChange(index + 1)}
              isActive={currentPage === index + 1}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <ArrowBigLeftDash
            onClick={() =>
              handlePageChange(
                currentPage === numberOfPages ? currentPage : currentPage + 1
              )
            }
            className="cursor-pointer"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
