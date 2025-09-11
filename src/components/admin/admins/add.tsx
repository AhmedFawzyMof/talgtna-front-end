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
import { addAdmins } from "@/actions/admins";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

export function AddAdmin({ refetch }: any) {
  const authStore = useAuthStore((state) => state);

  const addAdminMutation = useMutation({
    mutationFn: (formData: FormData) => addAdmins(authStore.token, formData),
    onSuccess: () => {
      toast.success("تم اضافة بنجاح");
      refetch();
    },
    onError: () => {
      toast.error("فشل في اضافة");
    },
  });

  const handelAddAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addAdminMutation.mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>اضافة مشرف</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>اضافة مشرف</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handelAddAdmin}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input id="name" name="username" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              كلمة المرور
            </Label>
            <Input
              id="password"
              type="password"
              multiple={false}
              className="col-span-3"
              name="password"
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
