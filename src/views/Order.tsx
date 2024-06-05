import { useEffect, useState } from "react";
import { useCartStore } from "../store/CartStore";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { BASE_URL } from "../store/config";

function Order() {
  const cart = useCartStore((state) => state.cart);
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());
  const clearCart = useCartStore((state) => state.clearCart);
  const [subtotal, setSubtotal] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [spare_phone, setSparePhone] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [method, setMethod] = useState("");
  const navigate = useNavigate();
  const discount = useCartStore((state) => state.discount);
  const total = subtotal + 25;
  const discountValue: number = discount.value as number;
  const totalDiscount: number = total - discountValue;

  document.title = "EasyCookFrozen | الطلب";

  const mutation = useMutation(
    async (data: unknown) => {
      const header: { [key: string]: string } = {
        "Content-Type": "application/json",
      };

      if (isAuth) {
        header["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(`${BASE_URL}/order`, {
        method: "POST",
        headers: header,
        body: JSON.stringify(data),
      });

      // setName("");
      // setSparePhone("");
      // setPhone("");
      // setBuilding("");
      // setFloor("");
      // setStreet("");
      // setCity("");
      // setMethod("");

      if (!response.ok) {
        toast.error("فشل في الطلب");
      }

      return response.json();
    },
    {
      onError: () => {
        toast.error("فشل في الطلب");
      },

      onSuccess: (data) => {
        clearCart();
        login(data.token);
        navigate("/ordersuccess/" + data.order);
        toast.success("تم إرسال الطلب بنجاح");
      },
    }
  );

  useEffect(() => {
    setSubtotal(
      cart.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  }, [cart, totalQuantity]);

  const sendDataToServer = () => {
    const coupon =
      discount.code !== undefined
        ? { code: discount.code, value: discount.value }
        : { code: "", value: 0 };
    console.log(coupon);
    const data: { [key: string]: string | object } = {
      phone,
      spare_phone,
      city,
      street,
      building,
      floor,
      method,
      cart: cart,
      discount: coupon,
    };
    if (isAuth) {
      data.user = token;
    } else {
      data.name = name;
    }
    mutation.mutate(data);
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
            onSubmit={(e) => {
              e.preventDefault();
              sendDataToServer();
            }}
            className="space-y-4"
          >
            {isAuth ? null : (
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
                  onChange={(e) => setName(e.target.value)}
                  value={name}
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
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
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
                  required
                  onChange={(e) => setSparePhone(e.target.value)}
                  value={spare_phone}
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
                  onChange={(e) => setStreet(e.target.value)}
                  value={street}
                />
              </div>

              <div>
                <label className="sr-only" htmlFor="مبنى">
                  عماره
                </label>
                <input
                  className="w-full rounded-lg border border-primary p-3 text-sm text-start"
                  placeholder="عماره"
                  type="text"
                  id="building"
                  required
                  onChange={(e) => setBuilding(e.target.value)}
                  value={building}
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
                onChange={(e) => setFloor(e.target.value)}
                value={floor}
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
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
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
                  name="method"
                  required
                  id="payment"
                  onChange={(e) => setMethod(e.target.value)}
                  value={method}
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                >
                  <option value="">اختار طريقة الدفع</option>
                  <option value="cash_on_delivery">الدفع عند الاستلام</option>
                  <option value="creditcard_on_delivery">
                    بالكارت عند الاستلام
                  </option>
                </select>
              </div>
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
      </section>
    </>
  );
}

export default Order;
