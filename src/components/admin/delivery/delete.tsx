import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { deleteDelivery } from "@/actions/delivery";
import { toast } from "sonner";

export default function DeleteDelivery({
  id,
  refetch,
}: {
  id: number;
  refetch: () => void;
}) {
  const authStore = useAuthStore((state) => state);
  const editMutation = useMutation({
    mutationFn: () => deleteDelivery(authStore.token, id),
    onSuccess: () => {
      toast.success("تم الحذف بنجاح");
      refetch();
    },
    onError: () => {
      toast.error("فشل في الحذف");
    },
  });
  return (
    <Button onClick={() => editMutation.mutate()}>
      حذف <Trash />
    </Button>
  );
}
