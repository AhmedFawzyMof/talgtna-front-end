import {
  deleteCompanies,
  getCompanies,
  editCompanies,
} from "@/actions/companies";
import Header from "@/components/admin/header";
import Loading from "@/components/admin/loading";
import { AddCompanies } from "@/components/admin/companies/add";
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
import { Company } from "@/lib/types";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Companies() {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string>("");
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);

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
    queryKey: ["companies", value],
    queryFn: () => getCompanies(authStore.token, search),
    staleTime: Infinity,
  });

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  const deleteMutation = useMutation({
    mutationFn: () => deleteCompanies(authStore.token, selectedCompanies),
    onSuccess: () => {
      toast.success("تم حذف الشركات");
      refetch();
    },
    onError: () => {
      toast.error("فشل في حذف الشركات");
    },
  });

  const editMutation = useMutation({
    mutationFn: (company: { name: string; soon: boolean }) =>
      editCompanies(authStore.token, company),
    onSuccess: () => {
      refetch();
    },
  });

  const handelEdit = (name: string, soon: boolean) => {
    const company = { name, soon };
    editMutation.mutate(company);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Header title="الشركات" />
      <div className="flex flex-col w-full items-start gap-5 md:flex-row md:gap-2 space-x-2">
        <Input
          className="py-2 max-w-md"
          type="search"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="cursor-pointer"
          onClick={() => deleteMutation.mutate()}
        >
          حذف الشركات المحددة
        </Button>
        <AddCompanies refetch={refetch} />
      </div>
      <Card>
        <CardContent>
          <Table className=" overflow-y-clip">
            <TableCaption>قائمة بجميع الشركات</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-center">الرقم</TableHead>
                <TableHead className="text-center">الاسم</TableHead>
                <TableHead className="text-center">الصورة</TableHead>
                <TableHead className="text-center">قريبا</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.companies.map((company: Company) => (
                <TableRow key={company.id}>
                  <TableCell className="w-auto">
                    <Input
                      type="checkbox"
                      className="max-w-4"
                      name="company_id"
                      value={company.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCompanies((prev) => [...prev, company.id]);
                        } else {
                          setSelectedCompanies((prev) =>
                            prev.filter((id) => id !== company.id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="w-auto">{company.id}</TableCell>
                  <TableCell className="w-auto">{company.name}</TableCell>
                  <TableCell>
                    <img
                      src={`/talgtna${company.image}`}
                      alt={company.name}
                      className=" w-24 h-24 rounded"
                    />
                  </TableCell>
                  <TableCell className="w-auto">
                    <Button
                      onClick={() => handelEdit(company.name, !company.soon)}
                      className="cursor-pointer"
                    >
                      {company.soon ? "نعم" : "لا"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
