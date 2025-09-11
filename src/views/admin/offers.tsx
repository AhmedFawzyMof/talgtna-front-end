import Loading from "@/components/admin/loading";
import { getOffers, deleteOffers } from "@/actions/offers";
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
import { Offer } from "@/lib/types";
import Header from "@/components/admin/header";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AddOffers } from "@/components/admin/offers/add";

export default function Offers() {
  const [selectedOffers, setSelectedOffers] = useState<number[]>([]);
  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["offers"],
    queryFn: () => getOffers(authStore.token),
    staleTime: Infinity,
  });

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  const deleteMutation = useMutation({
    mutationFn: () => deleteOffers(authStore.token, selectedOffers),
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
      <Header title="العروض" />
      <div className="flex flex-col w-full items-start gap-5 md:flex-row md:gap-2 space-x-2">
        <Button
          className="cursor-pointer"
          onClick={() => deleteMutation.mutate()}
        >
          حذف العروض المحددة
        </Button>

        <AddOffers companies={data?.data.companies} refetch={refetch} />
      </div>
      <Card>
        <CardContent>
          <Table className=" overflow-y-clip">
            <TableCaption>قائمة بجميع العروض</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-center">معرف</TableHead>
                <TableHead className="text-center">الشركة</TableHead>
                <TableHead className="text-center">الصورة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.offers.map((offer: Offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="w-auto">
                    <Input
                      type="checkbox"
                      name="offer_id"
                      className="max-w-4"
                      value={offer.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOffers((prev) => [...prev, offer.id]);
                        } else {
                          setSelectedOffers((prev) =>
                            prev.filter((id) => id !== offer.id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {offer.id}
                  </TableCell>
                  <TableCell className="text-center">{offer.company}</TableCell>
                  <TableCell className="text-center">
                    <img
                      src={`/talgtna/${offer.image}`}
                      className="w-auto h-20 rounded-md "
                    />
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
