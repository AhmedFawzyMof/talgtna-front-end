import Loading from "@/components/admin/loading";
import { PaginationNav } from "@/components/admin/pagination";
import { getCustomers } from "@/actions/customer";
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
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Customer } from "@/lib/types";
import Header from "@/components/admin/header";

export default function Customers() {
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string>("");

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

  const { data, error, isLoading } = useQuery({
    queryKey: ["users", limit, value],
    queryFn: () => getCustomers(authStore.token, limit, search),
    staleTime: Infinity,
  });

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Header title="العملاء" />
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          className="py-4"
          type="search"
          placeholder="Search Customers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Card>
        <CardContent>
          <Table className=" overflow-y-clip">
            <TableCaption>قائمة بجميع العملاء</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">معرف</TableHead>
                <TableHead className="text-center">اسم</TableHead>
                <TableHead className="text-center">هاتف</TableHead>
                <TableHead className="text-center">نقاط</TableHead>
                <TableHead className="text-center">هاتف احتياطي</TableHead>
                <TableHead className="text-center">شارع</TableHead>
                <TableHead className="text-center">مبنى</TableHead>
                <TableHead className="text-center">طابق</TableHead>
                <TableHead className="text-center">تاريخ الإنشاء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.users.map((customer: Customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium text-center">
                    {customer.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="text-center">{customer.name}</TableCell>
                  <TableCell className="text-center">
                    {customer.phone}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.coins}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.spare_phone}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.street}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.building}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.floor}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.created_at}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationNav
            numberOfPages={data?.data.totalPages}
            pageName="customer-page"
            setLimit={setLimit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
