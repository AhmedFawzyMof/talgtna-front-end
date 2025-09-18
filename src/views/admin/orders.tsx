import { getOrders } from "@/actions/orders";
import Header from "@/components/admin/header";
import Loading from "@/components/admin/loading";
import { EditOrder } from "@/components/admin/orders/edit";
import { ShowOrder } from "@/components/admin/orders/show";
import { PaginationNav } from "@/components/admin/pagination";
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
import { Order } from "@/lib/types";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const METHODS = {
  cash_on_delivery: "نقدى",
  fawaterk: "بطاقة إئتمان",
} as const;

export default function Orders() {
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
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
    queryKey: ["orders", limit, value],
    queryFn: () => getOrders(authStore.token, limit, search),
    staleTime: Infinity,
  });

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  useEffect(() => {
    if (data) {
      const Orders = data.data.orders;
      for (let i = 0; i < Orders.length; i++) {
        const order = Orders[i];
        Object.assign(order, { products: [] });
        for (let j = 0; j < data.data.products.length; j++) {
          const orderProduct = data.data.products[j];
          if (orderProduct.order === order.id) {
            order.products.push(orderProduct);
          }
        }
      }
      setOrders(Orders);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Header title="الطلبات" />
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          className="py-4"
          type="search"
          placeholder="Search Orders"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Card>
        <CardContent>
          <Table className=" overflow-y-clip">
            <TableCaption>قائمة بجميع الطلبات</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">معرف</TableHead>
                <TableHead className="text-center">مستخدم</TableHead>
                <TableHead className="text-center">تم التوصيل</TableHead>
                <TableHead className="text-center">يتم تجهيز</TableHead>
                <TableHead className="text-center">تم الدفع</TableHead>
                <TableHead className="text-center">خصم</TableHead>
                <TableHead className="text-center">مدينة</TableHead>
                <TableHead className="text-center">هاتف</TableHead>
                <TableHead className="text-center">هاتف احتياطي</TableHead>
                <TableHead className="text-center">شارع</TableHead>
                <TableHead className="text-center">مبنى</TableHead>
                <TableHead className="text-center">طابق</TableHead>
                <TableHead className="text-center">طريقة</TableHead>
                <TableHead className="text-center">الإجمالي</TableHead>
                <TableHead className="text-center">الوقت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell className="w-auto">
                    {order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="w-auto">{order.user}</TableCell>
                  <TableCell className="w-auto">
                    {order.delivered ? "نعم" : "لا"}
                  </TableCell>
                  <TableCell className="w-auto">
                    {order.processing ? "نعم" : "لا"}
                  </TableCell>
                  <TableCell className="w-auto">
                    {order.paymob_paid ? "نعم" : "لا"}
                  </TableCell>
                  <TableCell className="w-auto">
                    {order.total * JSON.parse(order.discount).value}
                  </TableCell>
                  <TableCell className="w-auto">{order.city}</TableCell>
                  <TableCell className="w-auto">{order.phone}</TableCell>
                  <TableCell className="w-auto">{order.spare_phone}</TableCell>
                  <TableCell className="w-auto">{order.street}</TableCell>
                  <TableCell className="w-auto">{order.building}</TableCell>
                  <TableCell className="w-auto">{order.floor}</TableCell>
                  <TableCell className="w-auto">
                    {METHODS[order.method as keyof typeof METHODS]}
                  </TableCell>
                  <TableCell className="w-auto">
                    {order.total -
                      order.total * JSON.parse(order.discount).value}
                  </TableCell>
                  <TableCell className="w-auto">
                    {new Date(order.created_at).toLocaleDateString("ar-EG", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EditOrder orderEdit={order} refetch={refetch} />
                      <ShowOrder orderShow={order} />
                      <Link
                        to={`/admin/dashboard/receipt/${order.id}`}
                        className="cursor-pointer bg-accent px-2 py-1 text-sm text-accent-foreground hover:bg-accent/80 rounded shadow grid place-items-center"
                      >
                        <Printer className="w-6" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationNav
            numberOfPages={data?.data.totalPages}
            pageName="order-page"
            setLimit={setLimit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
