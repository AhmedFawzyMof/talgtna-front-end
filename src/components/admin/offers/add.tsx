import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { addOffer } from "@/actions/offers";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

export function AddOffers({ companies, refetch }: any) {
  const authStore = useAuthStore((state) => state);

  const addOfferMutation = useMutation({
    mutationFn: (formData: FormData) => addOffer(authStore.token, formData),
    onSuccess: () => {
      toast.success("تم اضافة المنتج بنجاح");
      refetch();
    },
    onError: () => {
      toast.error("فشل في اضافة المنتج");
    },
  });

  const handelAddOffer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addOfferMutation.mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>اضافة العرض</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>اضافة العرض</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handelAddOffer}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              الشركة
            </Label>
            <div className="col-span-3">
              <Select name="company">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الشركة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>شركة</SelectLabel>
                    {companies?.map((company: any) => (
                      <SelectItem key={company.name} value={company.name}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              الصورة
            </Label>
            <Input
              id="image"
              type="file"
              accept=".png, .jpg, .jpeg"
              multiple={false}
              className="col-span-3"
              name="image"
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
