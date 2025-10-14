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
import { addSubCategories } from "@/actions/sub_categories";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Category } from "@/config/types";

export function AddSubCategory({ refetch, categories }: any) {
  const authStore = useAuthStore((state) => state);

  const addSubCategoryMutation = useMutation({
    mutationFn: (formData: FormData) =>
      addSubCategories(authStore.token, formData),
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

    addSubCategoryMutation.mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>اضافة الاقسام الفرعية</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>اضافة الاقسام الفرعية</DialogTitle>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              القسم
            </Label>
            <Select name="category">
              <SelectTrigger id="category" className="col-span-3">
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الاقسام</SelectLabel>
                  {categories.map((category: Category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full cursor-pointer" type="submit">
            أضافة
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
