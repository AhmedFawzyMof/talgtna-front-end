import { deleteCategories, getCategories } from "@/actions/categories";
import Header from "@/components/admin/header";
import Loading from "@/components/admin/loading";
import { AddCategories } from "@/components/admin/categories/add";
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
import { Category } from "@/lib/types";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Categories() {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setValue(search);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["categories", value],
    queryFn: () => getCategories(authStore.token, search),
    staleTime: Infinity,
  });

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  const deleteMutation = useMutation({
    mutationFn: () => deleteCategories(authStore.token, selectedCategories),
    onSuccess: () => {
      toast.success("تم حذف الاقسام");
      refetch();
    },
    onError: () => {
      toast.error("فشل في حذف الاقسام");
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Header title="الاقسام" />
      <div className="flex flex-col w-full items-start gap-5 md:flex-row md:gap-2 space-x-2">
        <Input
          className="py-2 max-w-md"
          type="search"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="cursor-pointer"
          onClick={() => deleteMutation.mutate()}
        >
          حذف الاقسام المحددة
        </Button>
        <AddCategories refetch={refetch} />
      </div>
      <Card>
        <CardContent>
          <Table className=" overflow-y-clip">
            <TableCaption>قائمة بجميع الاقسام</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-center">الرقم</TableHead>
                <TableHead className="text-center">الاسم</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.categories.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell className="w-auto">
                    <Input
                      type="checkbox"
                      className="max-w-4"
                      name="category_id"
                      value={category.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories((prev) => [
                            ...prev,
                            category.id,
                          ]);
                        } else {
                          setSelectedCategories((prev) =>
                            prev.filter((id) => id !== category.id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="w-auto">{category.id}</TableCell>
                  <TableCell className="w-auto">{category.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
