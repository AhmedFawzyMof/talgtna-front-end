import Loading from "@/components/admin/loading";
import { deleteContacts, editContact, getContacts } from "@/actions/contacts";
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
import { useAuthStore } from "@/store/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Contact } from "@/lib/types";
import Header from "@/components/admin/header";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";
import { useCounterStore } from "@/store/counters";

export default function Contact() {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string>("");
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);

  const authStore = useAuthStore((state) => state);
  const counterStore = useCounterStore((state) => state);
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
    queryKey: ["users", value],
    queryFn: () => getContacts(authStore.token, search),
    staleTime: Infinity,
  });

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  const deleteMutation = useMutation({
    mutationFn: () => deleteContacts(authStore.token, selectedContacts),
    onSuccess: () => {
      toast.success("تم حذف الشركات");
      refetch();
      counterStore.setRefeatch(true);
    },
    onError: () => {
      toast.error("فشل في حذف الشركات");
    },
  });

  const editMutation = useMutation({
    mutationFn: (contact: { id: number; seen: boolean }) =>
      editContact(authStore.token, contact),
    onSuccess: () => {
      toast.success("تم حذف الشركات");
      refetch();
      counterStore.setRefeatch(true);
    },
    onError: () => {
      toast.error("فشل في حذف الشركات");
    },
  });

  const handelEdit = (id: number, seen: boolean) => {
    const contact = {
      id: id,
      seen: !seen,
    };

    editMutation.mutate(contact);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Header title="طلبات الاتصال" />
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          className="py-4"
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="cursor-pointer"
          onClick={() => deleteMutation.mutate()}
        >
          حذف طلبات الاتصال المحددة
        </Button>
      </div>
      <Card>
        <CardContent>
          <Table className=" overflow-y-clip">
            <TableCaption>قائمة بجميع طلبات الاتصال</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-auto"></TableHead>
                <TableHead className="text-center">معرف</TableHead>
                <TableHead className="text-center">اسم</TableHead>
                <TableHead className="text-center">هاتف</TableHead>
                <TableHead className="text-center">البريد</TableHead>
                <TableHead className="text-center">الرسالة</TableHead>
                <TableHead className="text-center">التاريخ</TableHead>
                <TableHead className="w-auto"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.contacts.map((contact: Contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="w-auto">
                    <Input
                      type="checkbox"
                      className="max-w-4"
                      name="contact_id"
                      value={contact.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedContacts((prev) => [...prev, contact.id]);
                        } else {
                          setSelectedContacts((prev) =>
                            prev.filter((id) => id !== contact.id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {contact.id}
                  </TableCell>
                  <TableCell className="text-center">{contact.name}</TableCell>
                  <TableCell className="text-center">{contact.phone}</TableCell>
                  <TableCell className="text-center">{contact.email}</TableCell>
                  <TableCell className="text-center">
                    {contact.message}
                  </TableCell>
                  <TableCell className="w-auto">
                    {new Date(contact.created_at).toLocaleDateString("ar-EG", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell className="w-auto">
                    <Button
                      className="cursor-pointer"
                      onClick={() => handelEdit(contact.id, contact.seen)}
                    >
                      {contact.seen ? <Eye /> : <EyeClosed />}
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
