import { Button } from "@/components/ui/button";
import type { UserData, City } from "@/config/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getDelivery } from "@/actions/delivery";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/store/CartStore";
import { BASE_URL } from "@/config/config";
import { toast } from "sonner";

export function AddOrder() {
  const authStore = useAuthStore();
  const [formData, setFormData] = useState<UserData>({
    name: "",
    phone: "",
    spare_phone: "",
    street: "",
    building: "",
    floor: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const cartStore = useCartStore((state) => state);
  const [subtotal, setSubtotal] = useState(0);

  const delivery = isNaN(cartStore.dilivery) ? 0 : cartStore.dilivery;

  const value: number = cartStore.discount.value;
  const percentage: number = subtotal * value;

  const total = subtotal + delivery;
  const totalDiscount = total - percentage;

  const { data: cities, isLoading } = useQuery({
    queryKey: ["delivery"],
    queryFn: () => getDelivery(authStore.token),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (cartStore.cart.length === 0) {
      return;
    }
    setSubtotal(
      cartStore.cart.reduce((acc, item) => {
        if (!item.with_coins) {
          return acc + item.price * item.quantity;
        }
        return acc;
      }, 0)
    );
  }, [cartStore.cart]);

  useEffect(() => {
    cartStore.setDilivery(
      Number(
        cities?.data.delivery.find((c: City) => c.city === formData.city)?.value
      ) || 0
    );
  }, [formData.city, cartStore.cart]);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else if (cities?.data?.delivery?.length > 0) {
      setLoading(false);
    }
  }, [isLoading, cities]);

  const handleChange = (key: keyof UserData, value: string) =>
    setFormData({ ...formData, [key]: value });

  const order = useMutation({
    mutationFn: async (user_token: string) => {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user_token}`,
        },
        body: JSON.stringify({
          cart: cartStore.cart,
          method: "cash_on_delivery",
          discount: cartStore.discount,
          dilivery: cartStore.dilivery,
        }),
      });
      if (!res.ok) throw new Error("فشل إنشاء الطلب");
      return res.json();
    },

    onSuccess: () => {
      cartStore.clearCart();
      cartStore.setDiscount("", 0);
      toast.success("تم إرسال الطلب بنجاح");
      setLoading(false);
    },
    onError: () => {
      toast.error("فشل في إنشاء الطلب");
      setLoading(false);
    },
  });

  const saveUser = useMutation({
    mutationFn: async () => {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer `,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("فشل حفظ البيانات");
      setLoading(false);
      return res.json();
    },

    onSuccess: (data) => {
      const user_token: string = data.token as string;
      order.mutate(user_token);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حفظ البيانات");
    },
  });

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.street.trim() !== "" &&
      formData.building.trim() !== "" &&
      formData.floor.trim() !== "" &&
      formData.city.trim() !== ""
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>إنشاء طلب</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إنشاء طلب</DialogTitle>
        </DialogHeader>
        <dl className="space-y-3 text-sm md:text-base text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <dt>المجموع الفرعي</dt>
            <dd id="subtotal">{subtotal} ج.م</dd>
          </div>

          <div className="flex justify-between border-b pb-2">
            <dt>التوصيل</dt>
            <dd>{delivery} ج.م</dd>
          </div>

          {percentage > 0 && (
            <div className="flex justify-between border-b pb-2 text-green-600">
              <dt>خصم</dt>
              <dd id="discountValue">- {percentage} ج.م</dd>
            </div>
          )}

          <div className="flex justify-between font-semibold text-lg text-primary">
            <dt>الإجمالي</dt>
            <dd id="total">
              {isNaN(totalDiscount)
                ? subtotal
                : percentage
                ? totalDiscount
                : total}{" "}
              ج.م
            </dd>
          </div>
        </dl>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input
            placeholder="الاسم"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="رقم الهاتف"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
            <Input
              placeholder="رقم هاتف احتياطي"
              value={formData.spare_phone}
              onChange={(e) => handleChange("spare_phone", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="شارع"
              value={formData.street}
              onChange={(e) => handleChange("street", e.target.value)}
              required
            />
            <Input
              placeholder="عمارة"
              value={formData.building}
              onChange={(e) => handleChange("building", e.target.value)}
              required
            />
          </div>
          <Input
            placeholder="طابق"
            value={formData.floor}
            onChange={(e) => handleChange("floor", e.target.value)}
            required
          />

          <Label>المدن</Label>
          <Select
            value={formData.city}
            onValueChange={(val) => handleChange("city", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المدينة" />
            </SelectTrigger>
            <SelectContent>
              {cities?.data.delivery.map((c: City) => (
                <SelectItem key={c.city} value={c.city}>
                  {c.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => saveUser.mutate()}
            className="w-full"
            disabled={loading || !isFormValid()}
          >
            {loading ? "جاري التحميل..." : "تأكيد الطلب"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
