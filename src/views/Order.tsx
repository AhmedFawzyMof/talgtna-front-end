import { useEffect, useState } from "react";
import { useCartStore } from "../store/CartStore";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { BASE_URL } from "../store/config";

export default function Order() {
  const cart = useCartStore((state) => state.cart);
  const authStore = useAuthStore((state) => state);
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());
  const clearCart = useCartStore((state) => state.clearCart);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();
  const discount = useCartStore((state) => state.discount);
  const total = subtotal + 25;
  const discountValue: number = discount.value as number;
  const totalDiscount: number = total - discountValue;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    spare_phone: "",
    street: "",
    floor: "",
    building: "",
    city: "",
    method: "",
  });

  useEffect(() => {
    const savedOrderInfo = localStorage.getItem("order_info");
    if (savedOrderInfo) {
      try {
        const orderInfo = JSON.parse(savedOrderInfo);
        setFormData((prev) => ({
          ...prev,
          ...orderInfo,
        }));
      } catch (error) {
        console.error("Failed to parse saved order info", error);
      }
    }
  }, []);
  document.title = "Talgtna | الطلب";

  const mutation = useMutation(
    async (data: unknown) => {
      const header: { [key: string]: string } = {
        "Content-Type": "application/json",
      };

      if (authStore.isAuthenticated) {
        header["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/order`, {
        method: "POST",
        headers: header,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.error("فشل في الطلب");
      }

      return response.json();
    },
    {
      onSuccess: (data) => {
        clearCart();
        login(data.token, data.favorites);
        navigate("/ordersuccess/" + data.order);
        toast.success("تم إرسال الطلب بنجاح");
      },
    }
  );

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/");
    }

    setSubtotal(
      cart.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  }, [cart, totalQuantity]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const order = {
      name: data.get("name"),
      phone: data.get("phone"),
      spare_phone: data.get("spare_phone"),
      street: data.get("street"),
      floor: data.get("floor"),
      building: data.get("building"),
      city: data.get("city"),
      method: data.get("method"),
      cart: cart,
      discount: discount,
      total: totalDiscount,
    };

    if (data.get("save_order_data") === "on") {
      localStorage.setItem(
        "order_info",
        JSON.stringify({
          phone: data.get("phone"),
          spare_phone: data.get("spare_phone"),
          street: data.get("street"),
          floor: data.get("floor"),
          building: data.get("building"),
          city: data.get("city"),
          method: data.get("method"),
        })
      );
    }

    mutation.mutate(order);
  };

  return (
    <>
      <section className="grid place-items-center py-7">
        <div
          id="checkout"
          className="mb-8 flex flex-col w-[95%] md:w-4/5 justify-end bg-white p-8 lg:p-12 rounded shadow"
        >
          <div className="w-full">
            <dl className="space-y-0.5 text-sm text-gray-700">
              <div className="flex justify-between">
                <dt>المجموع الفرعي</dt>
                <dd id="subtotal">{subtotal} ج.م</dd>
              </div>

              <div className="flex justify-between">
                <dt>توصيل</dt>
                <dd>25 ج.م</dd>
              </div>

              {discountValue && (
                <div className="flex justify-between">
                  <dt>خصم</dt>
                  <dd id="discountValue">{discountValue} ج.م</dd>
                </div>
              )}

              <div className="flex justify-between !text-base font-medium">
                <dt>إجمالي</dt>
                <dd id="total">{discountValue ? totalDiscount : total} ج.م</dd>
              </div>
            </dl>
          </div>
          <form
            id="couponForm"
            className="hidden w-full mt-8  grid-cols-3 gap-4"
          >
            <input
              type="text"
              name="coupon"
              id="coupon"
              placeholder="كود الخصم"
              className="rounded-lg border border-primary h-9 p-3 col-span-2"
            />
            <button
              className="rounded-lg bg-primary text-white h-9 px-4"
              type="submit"
            >
              تأكيد
            </button>
          </form>
        </div>
      </section>
      <section className="grid place-items-center py-7">
        <div className="rounded-lg bg-white w-[95%] md:w-4/5 p-8 shadow-lg lg:col-span-3 lg:p-12">
          <form
            id="orderForm"
            onSubmit={(e) => handleSubmit(e)}
            className="space-y-4"
          >
            {authStore.isAuthenticated ? null : (
              <div>
                <label className="sr-only" htmlFor="name">
                  الاسم
                </label>
                <input
                  className="w-full rounded-lg p-3 text-sm border border-primary"
                  placeholder="الاسم"
                  type="text"
                  id="name"
                  required
                  name="name"
                />
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="sr-only" htmlFor="phone">
                  رقم الهاتف
                </label>
                <input
                  className="w-full rounded-lg border border-primary p-3 text-sm text-end"
                  placeholder="رقم الهاتف"
                  type="tel"
                  id="phone"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="spare_phone">
                  رقم هاتف احتياطي
                </label>
                <input
                  className="w-full rounded-lg border border-primary p-3 text-sm text-end"
                  placeholder="رقم هاتف احتياطي"
                  type="tel"
                  id="spare_phone"
                  name="spare_phone"
                  value={formData.spare_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, spare_phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="sr-only" htmlFor="street">
                  شارع
                </label>
                <input
                  className="w-full rounded-lg border border-primary p-3 text-sm text-start"
                  placeholder="شارع"
                  type="text"
                  id="street"
                  required
                  name="street"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="sr-only" htmlFor="building">
                  عماره
                </label>
                <input
                  className="w-full rounded-lg border border-primary p-3 text-sm text-start"
                  placeholder="عماره"
                  type="text"
                  id="building"
                  required
                  name="building"
                  value={formData.building}
                  onChange={(e) =>
                    setFormData({ ...formData, building: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="sr-only" htmlFor="floor">
                طابق
              </label>
              <input
                className="w-full rounded-lg p-3 text-sm border border-primary"
                placeholder="طابق"
                type="text"
                id="floor"
                required
                name="floor"
                value={formData.floor}
                onChange={(e) =>
                  setFormData({ ...formData, floor: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cities"
                  className="block text-sm font-medium text-gray-900"
                >
                  المدن
                </label>

                <select
                  required
                  id="cities"
                  name="city"
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                >
                  <option value="">أختر المدينه</option>
                  <option value="الشروق">الشروق</option>
                  <option value="بدر">بدر</option>
                  <option value="مدينتي">مدينتي</option>
                  <option value="المستقبل">المستقبل</option>
                  <option value="كمبوند البروج">كمبوند البروج</option>
                  <option value="العبور">العبور</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="payment"
                  className="block text-sm font-medium text-gray-900"
                >
                  طريقة الدفع
                </label>

                <select
                  required
                  name="method"
                  id="payment"
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                  value={formData.method}
                  onChange={(e) =>
                    setFormData({ ...formData, method: e.target.value })
                  }
                >
                  <option value="">اختار طريقة الدفع</option>
                  <option value="cash_on_delivery">الدفع عند الاستلام</option>
                  <option value="digital_wallet">
                    الدفع باستخدام المحفظة الرقمية عند التسليم
                  </option>
                </select>
              </div>
            </div>
            {authStore.isAuthenticated && (
              <div className="flex items-center gap-2">
                <label
                  htmlFor="save_order_data"
                  className="block text-sm font-medium text-gray-900"
                >
                  حفظ البينات
                </label>
                <input
                  type="checkbox"
                  name="save_order_data"
                  id="save_order_data"
                />
              </div>
            )}
            <div className="mt-4">
              <button
                type="submit"
                className="inline-block w-full rounded-lg bg-primary px-5 py-3 font-medium text-white sm:w-auto"
              >
                اطلب الان
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
