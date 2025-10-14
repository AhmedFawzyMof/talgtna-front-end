import Header from "@/components/admin/header";
import Loading from "@/components/admin/loading";
import { AddSubCategory } from "@/components/admin/sub_category/add";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SubCategory } from "@/lib/types";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/actions/categories";
import { Category } from "@/config/types";
import {
  deleteSubCategories,
  getSubCategories,
} from "@/actions/sub_categories";

export default function SubCategory() {
  const [category, setCategory] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>(
    []
  );

  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(authStore.token, ""),
    staleTime: Infinity,
  });

  const { data: subCategories, refetch } = useQuery({
    queryKey: ["subCategories", category],
    queryFn: () => getSubCategories(authStore.token, category),
    enabled: category !== "",
  });

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  const deleteMutation = useMutation({
    mutationFn: () =>
      deleteSubCategories(authStore.token, selectedSubCategories),
    onSuccess: () => {
      toast.success("تم حذف الشركات");
      refetch();
    },
    onError: () => {
      toast.error("فشل في حذف الشركات");
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Header title="الاقسام الفرعية" />
      <div className="flex flex-col w-full items-start gap-5 md:flex-row md:gap-2 space-x-2">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a subcategory" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>الاقسام </SelectLabel>
              {data?.data.categories.map((category: Category) => (
                <SelectItem
                  key={category.id}
                  value={category.name}
                  onClick={() => setCategory(category.name)}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          onClick={() => deleteMutation.mutate()}
          className="cursor-pointer"
        >
          حذف الاقسام الفرعية المحددة
        </Button>
        <AddSubCategory refetch={refetch} categories={data?.data.categories} />
      </div>
      <Card>
        <CardContent>
          <Table className=" overflow-y-clip">
            <TableCaption>قائمة بجميع الاقسام الفرعية</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-center">الرقم</TableHead>
                <TableHead className="text-center">الاسم</TableHead>
                <TableHead className="text-center">الصورة</TableHead>
                <TableHead className="text-center">القسم</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subCategories?.data.subCategories.map(
                (subCategory: SubCategory) => (
                  <TableRow key={subCategory.id}>
                    <TableCell className="w-auto">
                      <Input
                        type="checkbox"
                        className="max-w-4"
                        name="company_id"
                        value={subCategory.id}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubCategories((prev) => [
                              ...prev,
                              subCategory.id,
                            ]);
                          } else {
                            setSelectedSubCategories((prev) =>
                              prev.filter((id) => id !== subCategory.id)
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="w-auto">{subCategory.id}</TableCell>
                    <TableCell className="w-auto">{subCategory.name}</TableCell>
                    <TableCell>
                      <img
                        src={`/talgtna${subCategory.image}`}
                        alt={subCategory.name}
                        className=" w-24 h-24 rounded"
                      />
                    </TableCell>
                    <TableCell className="w-auto">
                      {subCategory.category}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
