import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { editOrder } from "@/actions/orders";
import { useCounterStore } from "@/store/counters";

export function EditOrder({ orderEdit, refetch }: any) {
  const [order, setOrders] = useState<any>({});
  const authStore = useAuthStore((state) => state);
  const counterStore = useCounterStore((state) => state);

  const editMutation = useMutation({
    mutationFn: () => editOrder(authStore.token, order),
    onSuccess: () => {
      toast.success("تم تعديل الطلب بنجاح");
      refetch();
      counterStore.setRefeatch(true);
    },
    onError: () => {
      toast.error("فشل في تعديل الطلب");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() =>
            setOrders({
              delivered: orderEdit?.delivered,
              id: orderEdit?.id,
              user: orderEdit?.user_id,
              processing: orderEdit?.processing,
            })
          }
          variant="outline"
        >
          تعديل الطلبات
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل الطلبات</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              حالة التوصيل
            </Label>
            <div className="col-span-3">
              <Select
                value={String(order.delivered)}
                onValueChange={(value) =>
                  setOrders({ ...order, delivered: Number(value) })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="تم التوصيل؟" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">تم التوصيل</SelectItem>
                    <SelectItem value="0">لم يتم التوصيل</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              يتم تجهيز
            </Label>
            <div className="col-span-3">
              <Select
                value={String(order?.processing)}
                onValueChange={(value) =>
                  setOrders({ ...order, processing: Number(value) })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="يتم تجهيز ؟" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">تم تجهيز</SelectItem>
                    <SelectItem value="0">لم يتم تجهيز</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full cursor-pointer"
            type="submit"
            onClick={() => editMutation.mutate()}
          >
            حفظ التغييرات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
