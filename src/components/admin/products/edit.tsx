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
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { editProduct } from "@/actions/products";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

export function EditProduct({
  productEdit,
  categories,
  companies,
  refetch,
}: any) {
  const [product, setProduct] = useState<any>({});
  const authStore = useAuthStore((state) => state);

  const editMutation = useMutation({
    mutationFn: (data: any) => editProduct(authStore.token, data, product.id),
    onSuccess: () => {
      toast.success("تم تعديل المنتج بنجاح");
      refetch();
    },
    onError: () => {
      toast.error("فشل في تعديل المنتج");
    },
  });

  const handelEditProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("id", product.id);
    editMutation.mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => setProduct(productEdit)} variant="outline">
          تعديل المنتج
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل المنتج</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handelEditProduct}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input
              id="name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              name="name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              الوصف
            </Label>
            <Input
              id="description"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              name="description"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              الفئة
            </Label>
            <div className="col-span-3">
              <Select
                name="category"
                value={product.category}
                onValueChange={(value) =>
                  setProduct({ ...product, category: value })
                }
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
            <Label htmlFor="company" className="text-right">
              الشركة
            </Label>
            <div className="col-span-3">
              <Select
                name="company"
                value={product.company}
                onValueChange={(value) =>
                  setProduct({ ...product, company: value })
                }
              >
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
            <Label htmlFor="in_coin_store" className="text-right">
              في متجر النقاط
            </Label>
            <div className="col-span-3">
              <Select
                name="in_coin_store"
                value={String(product.in_coin_store)}
                onValueChange={(value) =>
                  setProduct({ ...product, in_coin_store: Number(value) })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>متجر النقاط</SelectLabel>
                    <SelectItem value="0">ليس في المتجر</SelectItem>
                    <SelectItem value="1">في متجر</SelectItem>
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
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
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
              value={product.offer}
              onChange={(e) =>
                setProduct({ ...product, offer: e.target.value })
              }
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
            <Label htmlFor="buyPrice" className="text-right">
              سعر الشراء
            </Label>
            <Input
              id="buyPrice"
              type="number"
              value={product.buy_price}
              onChange={(e) =>
                setProduct({ ...product, buy_price: e.target.value })
              }
              name="buy_price"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              الحالة
            </Label>
            <div className="col-span-3">
              <Select
                name="available"
                value={String(product.available)}
                onValueChange={(value) =>
                  setProduct({ ...product, available: Number(value) })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الحالة</SelectLabel>
                    <SelectItem value="0">متاح</SelectItem>
                    <SelectItem value="1">غير متاح</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full cursor-pointer" type="submit">
            حفظ التغييرات
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
