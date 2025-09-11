import { Button } from "@/components/ui/button";
import { addDelivery } from "@/actions/delivery";

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

export function AddDelivery({ refetch }: any) {
  const authStore = useAuthStore((state) => state);

  const addDeliveryMutation = useMutation({
    mutationFn: (formData: FormData) => addDelivery(authStore.token, formData),
    onSuccess: () => {
      toast.success("تم اضافة بنجاح");
      refetch();
    },
    onError: () => {
      toast.error("فشل في اضافة");
    },
  });

  const handelAddDelivery = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addDeliveryMutation.mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>اضافة</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>اضافة</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handelAddDelivery}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">
              المدينة
            </Label>
            <Input id="city" name="city" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="delivery" className="text-right">
              سعر التوصيل
            </Label>
            <Input
              id="delivery"
              type="number"
              className="col-span-3"
              name="delivery"
            />
          </div>
          <Button className="w-full cursor-pointer" type="submit">
            أضافة
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
