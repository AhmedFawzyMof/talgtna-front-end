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
import { addCompanies } from "@/actions/companies";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

export function AddCompanies({ refetch }: any) {
  const authStore = useAuthStore((state) => state);

  const addCompanyMutation = useMutation({
    mutationFn: (formData: FormData) => addCompanies(authStore.token, formData),
    onSuccess: () => {
      toast.success("تم اضافة المنتج بنجاح");
      refetch();
    },
    onError: () => {
      toast.error("فشل في اضافة المنتج");
    },
  });

  const handelAddCompany = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addCompanyMutation.mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>اضافة شركة</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>اضافة شركة</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handelAddCompany}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input id="name" name="name" className="col-span-3" />
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
