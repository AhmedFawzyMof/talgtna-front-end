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
import { useMutation, useQuery } from "@tanstack/react-query";
import { addProduct } from "@/actions/products";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { getSubCategories } from "@/actions/sub_categories";
import { useState } from "react";

export function AddProduct({ categories, companies, refetch }: any) {
  const authStore = useAuthStore((state) => state);
  const [category, setCategory] = useState("");

  const addProductMutation = useMutation({
    mutationFn: (formData: FormData) => addProduct(authStore.token, formData),
    onSuccess: () => {
      toast.success("تم اضافة المنتج بنجاح");
      refetch();
    },
    onError: () => {
      toast.error("فشل في اضافة المنتج");
    },
  });

  const handelAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addProductMutation.mutate(formData);
  };

  const { data } = useQuery({
    queryKey: ["subCategories", category],
    queryFn: () => getSubCategories(authStore.token, category),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>اضافة المنتج</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>اضافة المنتج</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handelAddProduct}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input id="name" name="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              الوصف
            </Label>
            <Input id="description" name="description" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              الفئة
            </Label>
            <div className="col-span-3">
              <Select
                onValueChange={(e) => setCategory(e)}
                defaultValue={category}
                name="category"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الفئات</SelectLabel>
                    {categories?.map((category: any) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sub_category" className="text-right">
              الفئة الفرعية
            </Label>
            <div className="col-span-3">
              <Select name="sub_category">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الفئة الفرعية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الفئات</SelectLabel>
                    {data?.data.subCategories.map((category: any) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              الشركة
            </Label>
            <div className="col-span-3">
              <Select name="company">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر شركة" />
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
            <Label htmlFor="price" className="text-right">
              السعر
            </Label>
            <Input
              id="price"
              type="number"
              name="price"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="offerPrice" className="text-right">
              سعر العرض
            </Label>
            <Input
              id="offerPrice"
              type="number"
              name="offer"
              className="col-span-3"
            />
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
            <Label htmlFor="availableQuantity" className="text-right">
              سعر الشراء
            </Label>
            <Input
              id="availableQuantity"
              type="number"
              name="buy_price"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              الحالة
            </Label>
            <div className="col-span-3">
              <Select name="available">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الحالة</SelectLabel>
                    <SelectItem value="1">متاح</SelectItem>
                    <SelectItem value="0">غير متاح</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full cursor-pointer" type="submit">
            أضافة
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
