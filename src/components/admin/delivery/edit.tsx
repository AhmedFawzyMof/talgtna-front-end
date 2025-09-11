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
import { editDelivery } from "@/actions/delivery";

export function EditDelivery({ deliveryEdit, refetch }: any) {
  const [delivery, setDelivery] = useState<any>({});
  const authStore = useAuthStore((state) => state);
  const counterStore = useCounterStore((state) => state);

  const editMutation = useMutation({
    mutationFn: () => editDelivery(authStore.token, delivery),
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
          onClick={() => setDelivery({ ...deliveryEdit })}
          variant="outline"
        >
          تعديل المدينة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل المدينة</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">
              المدينة
            </Label>
            <div className="col-span-3">
              <Input
                type="text"
                value={delivery?.city}
                onChange={(e) =>
                  setDelivery({ ...delivery, city: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              يتم تجهيز
            </Label>
            <div className="col-span-3">
              <Input
                type="text"
                value={delivery?.value}
                onChange={(e) =>
                  setDelivery({ ...delivery, value: e.target.value })
                }
              />
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
