import { deleteProducts, getProducts } from "@/actions/products";
import Header from "@/components/admin/header";
import Loading from "@/components/admin/loading";
import { PaginationNav } from "@/components/admin/pagination";
import { AddProduct } from "@/components/admin/products/add";
import { EditProduct } from "@/components/admin/products/edit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/lib/types";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Products() {
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setValue(search);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["products", limit, value],
    queryFn: () => getProducts(authStore.token, limit, search),
    staleTime: Infinity,
  });

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  const deleteMutation = useMutation({
    mutationFn: () => deleteProducts(authStore.token, selectedProducts),
    onSuccess: () => {
      toast.success("تم حذف المنتجات");
      refetch();
    },
    onError: () => {
      toast.error("فشل في حذف المنتجات");
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Header title="المنتجات" />
      <div className="flex flex-col w-full items-start gap-5 md:flex-row md:gap-2 space-x-2">
        <Input
          className="py-2 max-w-md"
          type="search"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="cursor-pointer"
          onClick={() => deleteMutation.mutate()}
        >
          حذف المنتجات المحددة
        </Button>
        <AddProduct
          categories={data?.data.categories}
          companies={data?.data.companies}
          refetch={refetch}
        />
      </div>
      <Card>
        <CardContent>
          <Table className=" overflow-y-clip">
            <TableCaption>قائمة بجميع منتجاتك</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-center">الرقم</TableHead>
                <TableHead className="text-center">الاسم</TableHead>
                <TableHead className="text-center">الوصف</TableHead>
                <TableHead className="text-center">الفئة</TableHead>
                <TableHead className="text-center">الشركة</TableHead>
                <TableHead className="text-center">السعر</TableHead>
                <TableHead className="text-center">سعر العرض</TableHead>
                <TableHead className="text-center">الصورة</TableHead>
                <TableHead className="text-center">الحالة</TableHead>
                <TableHead className="text-center">في متجر النقاط</TableHead>
                <TableHead className="text-center">الاجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.products.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell className="w-auto">
                    <Input
                      type="checkbox"
                      name="product_id"
                      value={product.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts((prev) => [...prev, product.id]);
                        } else {
                          setSelectedProducts((prev) =>
                            prev.filter((id) => id !== product.id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="w-auto">{product.id}</TableCell>
                  <TableCell className="w-auto">{product.name}</TableCell>
                  <TableCell className="w-auto">
                    {product.description.length > 100
                      ? product.description.slice(0, 100) + "..."
                      : product.description}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.company}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.offer}</TableCell>
                  <TableCell>
                    <img
                      src={`/talgtna${product.image}`}
                      alt={product.name}
                      className=" w-24 h-24 rounded"
                    />
                  </TableCell>
                  <TableCell>
                    {product.available ? "غير متاح" : "متاح"}
                  </TableCell>
                  <TableCell>{product.in_coin_store}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EditProduct
                        productEdit={product}
                        categories={data.data.categories}
                        companies={data.data.companies}
                        refetch={refetch}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationNav
            numberOfPages={data?.data.totalPages}
            pageName="product-page"
            setLimit={setLimit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
