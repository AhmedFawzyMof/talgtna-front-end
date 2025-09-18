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

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { useCounterStore } from "@/store/counters";
import { Input } from "@/components/ui/input";
import { editCoupon } from "@/actions/coupons";

export function EditCoupon({ couponEdit, refetch }: any) {
  const [coupon, setCoupon] = useState<{ code: string; value: number }>(
    {} as any
  );
  const authStore = useAuthStore((state) => state);
  const counterStore = useCounterStore((state) => state);

  const editMutation = useMutation({
    mutationFn: () => editCoupon(authStore.token, coupon),
    onSuccess: () => {
      toast.success("تم تعديل القسيمة بنجاح");
      refetch();
      counterStore.setRefeatch(true);
    },
    onError: () => {
      toast.error("فشل في تعديل القسيمة");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() =>
            setCoupon({
              code: couponEdit.code,
              value: couponEdit.value,
            })
          }
          variant="outline"
        >
          تعديل كوبونات
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل الطلبات</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              رمز قسيمة
            </Label>
            <Input
              id="code"
              name="code"
              value={coupon.code}
              onChange={(e) => setCoupon({ ...coupon, code: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              قيمة القسيمة
            </Label>
            <Input
              type="number"
              id="value"
              className="col-span-3"
              name="value"
              value={coupon.value}
              onChange={(e) =>
                setCoupon({ ...coupon, value: Number(e.target.value) })
              }
            />
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
