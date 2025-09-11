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
import { addCategory } from "@/actions/categories";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

export function AddCategories({ refetch }: any) {
  const authStore = useAuthStore((state) => state);

  const addCategoryMutation = useMutation({
    mutationFn: (formData: FormData) => addCategory(authStore.token, formData),
    onSuccess: () => {
      toast.success("تم اضافة المنتج بنجاح");
      refetch();
    },
    onError: () => {
      toast.error("فشل في اضافة المنتج");
    },
  });

  const handelAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addCategoryMutation.mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>اضافة قسم</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>اضافة قسم</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handelAddCategory}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input id="name" name="name" className="col-span-3" />
          </div>
          <Button className="w-full cursor-pointer" type="submit">
            أضافة
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
