import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { BASE_URL } from "../config/config";
import { useMutation, useQuery } from "react-query";
import { useCartStore } from "../store/CartStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const METHODS = [
  {
    value: "cash_on_delivery",
    label: "نقدى",
  },
  {
    value: "payment",
    label: "(قريبا) عبر بطاقة الائتمان",
  },
] as const;

interface City {
  city: string;
  value: number;
}

interface UserData {
  name: string;
  phone: string;
  spare_phone: string;
  street: string;
  building: string;
  floor: string;
  city: string;
}

const useCities = (token: string) => {
  return useQuery<City[]>("cities", async () => {
    const response = await fetch(`${BASE_URL}/city`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.statusText}`);
    }

    return response.json();
  });
};

const useUserData = (token: string) => {
  return useQuery<UserData>(
    "user_data",
    async () => {
      const response = await fetch(`${BASE_URL}/user/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }

      const userdata = await response.json();
      return userdata.user;
    },
    {
      enabled: !!token,
    }
  );
};

function OrderForm() {
  const authStore = useAuthStore((state) => state);
  const cartStore = useCartStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [hasCoins, setHasCoins] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    spare_phone: "",
    street: "",
    building: "",
    floor: "",
    city: "",
  });
  const [orderForm, setOrderForm] = useState({
    method: "cash_on_delivery",
  });

  const navigate = useNavigate();

  const { data } = useCities(authStore.token);
  const { data: userData, isLoading: userDataLoading } = useUserData(
    authStore.token
  );

  useEffect(() => {
    if (authStore.isAuthenticated && userData && !userDataLoading) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        spare_phone: userData.spare_phone || "",
        street: userData.street || "",
        building: userData.building || "",
        floor: userData.floor || "",
        city: userData.city || "",
      });
    }
  }, [authStore.isAuthenticated, userData, userDataLoading]);

  useEffect(() => {
    cartStore.cart.forEach((product) => {
      if (product.with_coins) {
        setHasCoins(true);
      }
    });
    cartStore.setDilivery(
      Number(data?.find((city) => city.city === formData.city)?.value)
    );
  }, [data, formData.city]);

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, city: event.target.value });
    cartStore.setDilivery(
      Number(data?.find((city) => city.city === event.target.value)?.value)
    );
  };

  const login = useMutation(
    ["login"],
    async () => {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
      }
      setLoading(false);
      return response.json();
    },
    {
      onSuccess: (data) => {
        setStep(2);
        authStore.login(data.token, data.favorites);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login.mutate();
  };

  const order = useMutation(
    ["order"],
    async () => {
      setLoading(true);
      const orderData = {
        cart: cartStore.cart,
        method: orderForm.method,
        discount: cartStore.discount,
        dilivery: cartStore.dilivery,
      };
      const response = await fetch(`${BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      return response.json();
    },
    {
      onSuccess: (data) => {
        cartStore.clearCart();
        cartStore.setDiscount("", 0);
        navigate("/ordersuccess/" + data.order);
        setLoading(false);
        toast.success("تم إرسال الطلب بنجاح");
      },
      onError: () => {
        setLoading(false);
        toast.error("فشل في الطلب");
      },
    }
  );

  const CreatePayment = useMutation(
    ["payment"],
    async () => {
      setLoading(true);

      const orderData = {
        cart: cartStore.cart,
        discount: cartStore.discount,
        dilivery: cartStore.dilivery,
      };

      const response = await fetch(`${BASE_URL}/order/create/paymentlink`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(orderData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to create order");
      }

      return response.json();
    },
    {
      onSuccess(data) {
        console.log("Order created:", data);
        window.location.href = data.link;
        setLoading(false);
      },
      onError(error) {
        console.error("Mutation error:", (error as Error).message);
        setLoading(false);
      },
    }
  );

  return (
    <div className="rounded-lg bg-white w-[95%] md:w-4/5 p-8 shadow-lg lg:col-span-3 lg:p-12">
      {step === 1 && (
        <form id="orderForm" className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="sr-only" htmlFor="name">
              الاسم
            </label>
            <input
              className="w-full rounded-lg p-3 text-sm border border-primary"
              placeholder="الاسم"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              id="name"
              required
              name="name"
            />
          </div>

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
              className="mt-1.5 w-full rounded-lg border-primary text-gray-700 sm:text-sm"
              value={formData.city}
              onChange={handleCityChange}
            >
              <option value="" disabled>
                أختر المدينه
              </option>
              {data?.map((city) => (
                <option key={city.city} value={city.city}>
                  {city.city}
                </option>
              ))}
            </select>
          </div>
          <button
            className={`cursor-pointer bg-primary text-white py-2 px-4 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
            type="submit"
          >
            {loading ? "جارى التحميل..." : "التالي"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form>
          <fieldset className="space-y-3">
            <legend className="sr-only">طريقة الدفع</legend>
            {METHODS.map((method) => (
              <div key={method.value}>
                <label
                  htmlFor={method.value}
                  className={`flex items-center justify-between gap-4 rounded border  p-3 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 has-checked:border-primary has-checked:ring-1 has-checked:ring-primary 
                   ${
                     method.value === "payment"
                       ? "bg-gray-300"
                       : "border-gray-300 bg-white hover:bg-gray-50"
                   }`}
                >
                  <div>
                    <p className="text-gray-700">{method.label}</p>
                  </div>
                  <input
                    type="radio"
                    name="payment-method"
                    value={method.value}
                    required
                    checked={orderForm.method === method.value}
                    disabled={loading || method.value === "payment"}
                    onChange={() =>
                      setOrderForm({ ...orderForm, method: method.value })
                    }
                    id={method.value}
                    className={`size-5 border-gray-300 ${
                      method.value === "payment" && hasCoins
                        ? "bg-gray-300"
                        : ""
                    }`}
                  />
                </label>
              </div>
            ))}
          </fieldset>
          {orderForm.method !== "payment" ? (
            <button
              disabled={loading}
              onClick={() => order.mutate()}
              className="bg-primary text-white py-2 px-4 rounded mt-10"
            >
              {loading ? "جارى التحميل..." : "تأكيد الطلب"}
            </button>
          ) : (
            <button
              disabled={loading}
              onClick={() => CreatePayment.mutate()}
              className="bg-primary text-white py-2 px-4 rounded mt-10"
            >
              {loading ? "جارى التحميل..." : "استمر"}
            </button>
          )}
        </form>
      )}
    </div>
  );
}

export default OrderForm;
