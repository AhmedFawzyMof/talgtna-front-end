import Loading from "@/components/admin/loading";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Coupon } from "@/lib/types";
import Header from "@/components/admin/header";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCounterStore } from "@/store/counters";
import { deleteCoupon, getCoupons } from "@/actions/coupons";
import { AddCoupons } from "@/components/admin/coupons/add";
import { EditCoupon } from "@/components/admin/coupons/edit";

export default function AdminCoupons() {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string>("");
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);

  const authStore = useAuthStore((state) => state);
  const counterStore = useCounterStore((state) => state);
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
    queryKey: ["users", value],
    queryFn: () => getCoupons(authStore.token, search),
    staleTime: Infinity,
  });

  console.log(data);

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  const deleteMutation = useMutation({
    mutationFn: () => deleteCoupon(authStore.token, selectedCoupons),
    onSuccess: () => {
      toast.success("تم حذف الشركات");
      refetch();
      counterStore.setRefeatch(true);
    },
    onError: () => {
      toast.error("فشل في حذف الشركات");
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Header title="كوبونات" />
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          className="py-4"
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="cursor-pointer"
          onClick={() => deleteMutation.mutate()}
        >
          حذف كوبونات المحددة
        </Button>
      </div>
      <AddCoupons refetch={refetch} />
      <Card>
        <CardContent>
          <Table className=" overflow-y-clip">
            <TableCaption>قائمة بجميع كوبونات</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-auto"></TableHead>
                <TableHead className="text-center">رمز قسيمة</TableHead>
                <TableHead className="text-center">قيمة القسيمة</TableHead>
                <TableHead className="w-auto"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.coupons.map((Coupon: Coupon) => (
                <TableRow key={Coupon.code}>
                  <TableCell className="w-auto">
                    <Input
                      type="checkbox"
                      className="max-w-4"
                      name="Coupon_id"
                      value={Coupon.code}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCoupons((prev) => [...prev, Coupon.code]);
                        } else {
                          setSelectedCoupons((prev) =>
                            prev.filter((code) => code !== Coupon.code)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-center">{Coupon.code}</TableCell>
                  <TableCell className="text-center">{Coupon.value}</TableCell>

                  <TableCell className="w-auto">
                    <EditCoupon couponEdit={Coupon} refetch={refetch} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
