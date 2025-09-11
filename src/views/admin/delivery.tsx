import { getDelivery, hideCity } from "@/actions/delivery";
import { AddDelivery } from "@/components/admin/delivery/add";
import Header from "@/components/admin/header";
import Loading from "@/components/admin/loading";
import { Card, CardContent } from "@/components/ui/card";

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
import { useNavigate } from "react-router";

import type { Delivery } from "@/lib/types";
import { EditDelivery } from "@/components/admin/delivery/edit";
import DeleteDelivery from "@/components/admin/delivery/delete";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Delivery() {
  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["delivery"],
    queryFn: () => getDelivery(authStore.token),
    staleTime: Infinity,
  });

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  const hideMutation = useMutation({
    mutationFn: ({ id, hide }: { id: number; hide: number }) =>
      hideCity(authStore.token, id, hide),
    onSuccess: () => {
      toast.success("تم تغيير حالة المدينة");
      refetch();
    },
    onError: () => {
      toast.error("فشل في تغيير حالة المدينة");
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Header title="التوصيل والمدن" />
      <div className="flex flex-col w-full items-start gap-5 md:flex-row md:gap-2 space-x-2">
        <AddDelivery refetch={refetch} />
      </div>
      <Card>
        <CardContent>
          <Table className=" overflow-y-clip">
            <TableCaption>التوصيل والمدن</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">معرف</TableHead>
                <TableHead className="text-center">اسم المدينة</TableHead>
                <TableHead className="text-center">سعر التوصيل</TableHead>
                <TableHead className="text-center">الحالة</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.delivery.map((delivery: Delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="text-center">{delivery.id}</TableCell>
                  <TableCell className="text-center">{delivery.city}</TableCell>
                  <TableCell className="text-center">
                    {delivery.value}
                  </TableCell>
                  <TableCell className="text-center">
                    {delivery.hidden === 0 ? "غير مخفي" : "مخفي"}
                  </TableCell>
                  <TableCell className="text-center flex justify-center items-center gap-3">
                    <Button
                      onClick={() =>
                        hideMutation.mutate({
                          id: delivery.id,
                          hide: delivery.hidden,
                        })
                      }
                    >
                      {delivery.hidden === 0 ? "مخفي" : "غير مخفي"}
                    </Button>
                    <EditDelivery deliveryEdit={delivery} refetch={refetch} />
                    <DeleteDelivery id={delivery.id} refetch={refetch} />
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
