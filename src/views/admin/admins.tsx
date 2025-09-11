import Header from "@/components/admin/header";
import Loading from "@/components/admin/loading";
import { AddAdmin } from "@/components/admin/admins/add";
import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Admin } from "@/lib/types";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { getAdmins } from "@/actions/admins";

export default function Admins() {
  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["admins"],
    queryFn: () => getAdmins(authStore.token),
    staleTime: Infinity,
  });

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Header title="قائمة المشرفين" />
      <div className="flex flex-col w-full items-start gap-5 md:flex-row md:gap-2 space-x-2">
        <AddAdmin refetch={refetch} />
      </div>
      <Card>
        <CardContent>
          <Table className=" overflow-y-clip">
            <TableCaption>قائمة بجميع المشرفين</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">الاسم</TableHead>
                <TableHead className="text-center">تسجيل الدخول عند</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.admins.map((admin: Admin, index: number) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    {admin.username}
                  </TableCell>
                  <TableCell className="text-center">
                    {admin.login_at}
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
