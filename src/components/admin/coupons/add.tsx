import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { addCoupon } from "@/actions/coupons";
import { Coupon } from "@/lib/types";
import { useState } from "react";

export function AddCoupons({ refetch }: any) {
  const authStore = useAuthStore((state) => state);
  const [code, setCode] = useState("");
  const [value, setValue] = useState(0);

  const addCompanyMutation = useMutation({
    mutationFn: (coupon: Coupon) => addCoupon(authStore.token, coupon),
    onSuccess: () => {
      toast.success("تم اضافة قسيمة بنجاح");
      refetch();
    },
    onError: () => {
      toast.error(" فشل في اضافة قسيمة");
    },
  });

  const handelAddCompany = () => {
    const formData = {
      code: code,
      value: value,
    };
    addCompanyMutation.mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>اضافة قسيمة</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>اضافة قسيمة</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              رمز قسيمة
            </Label>
            <Input
              id="code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              قيمة القسيمة
            </Label>
            <Input
              id="value"
              type="number"
              className="col-span-3"
              name="value"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />
          </div>
          <Button
            onClick={handelAddCompany}
            className="w-full cursor-pointer"
            type="submit"
          >
            أضافة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
