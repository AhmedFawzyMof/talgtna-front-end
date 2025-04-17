import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { useMutation } from "react-query";
import { BASE_URL } from "../config/config";
import { toast } from "sonner";
import { useCartStore } from "../store/CartStore";
import { useNavigate } from "react-router-dom";

export default function OrderForm({
  totalDiscount,
  cities,
}: {
  totalDiscount: number;
  cities: { city: string; value: number }[];
}) {
  const authStore = useAuthStore((state) => state);
  const cartStore = useCartStore((state) => state);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    spare_phone: "",
    street: "",
    floor: "",
    building: "",
    city: "",
    method: "",
    save_order_data: "",
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

  useEffect(() => {
    if (cities.length > 0) {
      const city = cities.find((city) => city.city === formData.city);
      if (city) {
        cartStore.setDilivery(city!.value);
      }
    }
  }, [cities, formData.city]);

  const mutation = useMutation(
    async (data: unknown) => {
      const header: { [key: string]: string } = {
        "Content-Type": "application/json",
      };

      if (authStore.isAuthenticated) {
        header["Authorization"] = `Bearer ${authStore.token}`;
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
        cartStore.clearCart();
        cartStore.setDiscount("", 0);
        authStore.login(data.token, data.favorites);
        navigate("/ordersuccess/" + data.order);
        toast.success("تم إرسال الطلب بنجاح");
      },
      onError: () => {
        toast.error("فشل في الطلب");
      },
    }
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, city: e.target.value });
    cartStore.setDilivery(
      cities.find((city) => city.city === e.target.value)?.value || 0
    );
  };

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
      cart: cartStore.cart,
      discount: cartStore.discount,
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
          save_order_data: data.get("save_order_data"),
        })
      );
    }

    mutation.mutate(order);
  };

  return (
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
              onChange={handleSelectChange}
            >
              <option value="">أختر المدينه</option>
              {cities.map((city) => (
                <option key={city.city} value={city.city}>
                  {city.city}
                </option>
              ))}
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
            value={formData.save_order_data}
            onChange={(e) =>
              setFormData({
                ...formData,
                save_order_data: e.target.value,
              })
            }
            id="save_order_data"
          />
        </div>
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
  );
}
