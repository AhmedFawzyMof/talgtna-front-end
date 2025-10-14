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
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editProduct } from "@/actions/products";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { getSubCategories } from "@/actions/sub_categories";
import { Loader } from "lucide-react";

export function EditProduct({
  productEdit,
  categories,
  companies,
  refetch,
}: any) {
  const [product, setProduct] = useState<any>({});
  const authStore = useAuthStore((state) => state);
  const [subCategories, setSubCategories] = useState<any>([]);

  const { data } = useQuery({
    queryKey: ["subCategories", product.category],
    queryFn: () => getSubCategories(authStore.token, product.category),
  });

  useEffect(() => {
    if (data?.data.subCategories) {
      setSubCategories(data.data.subCategories);
    }
  }, [data?.data.subCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    if (e.target.name === "category") {
      setProduct({
        ...product,
        [e.target.name]: e.target.value,
        sub_category: "",
      });
      return;
    }
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const { mutate: editMutation, isPending } = useMutation({
    mutationFn: (data: any) => {
      return editProduct(authStore.token, data, product.id);
    },
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
    Object.entries(product).forEach(([key, value]) => {
      if (!formData.has(key) && key !== "image") {
        formData.append(key, String(value));
      }
    });
    editMutation(formData);
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
        <form
          className="grid gap-4 py-4 overflow-y-scroll max-h-80"
          onSubmit={handelEditProduct}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input
              id="name"
              value={product.name}
              onChange={handleChange}
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
              onChange={handleChange}
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
                  handleChange({ target: { name: "category", value } })
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
            <Label htmlFor="sub_category" className="text-right">
              الفئة الفرعية
            </Label>
            <div className="col-span-3">
              <Select
                name="sub_category"
                value={product.sub_category}
                onValueChange={(value) =>
                  handleChange({ target: { name: "sub_category", value } })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الفئة الفرعية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الفئات</SelectLabel>
                    {subCategories?.map((category: any) => (
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
                  handleChange({ target: { name: "company", value } })
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
                  handleChange({ target: { name: "in_coin_store", value } })
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
                  handleChange({
                    target: { name: "available", value: Number(value) },
                  })
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
          <Button
            disabled={isPending}
            className="w-full cursor-pointer"
            type="submit"
          >
            {isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "حفظ التغييرات"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
