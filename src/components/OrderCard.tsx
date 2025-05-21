import { useEffect, useState } from "react";
import { BASE_URL, IMAGE_BASE_URL } from "../config/config";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { useAuthStore } from "../store/AuthStore";

const METHODS = {
  cash_on_delivery: "نقدى",
  digital_wallet: "محفظة رقمية",
} as const;

function OrderCard({
  order,
  cities,
  refetch,
}: {
  order: Order;
  cities: any;
  refetch: () => void;
}) {
  const discount = JSON.parse(order.discount);
  const authStore = useAuthStore((state) => state);
  const [total, setTotal] = useState(0);
  const [delivered, setDelivered] = useState(order.delivered);

  useEffect(() => {
    let sum = 0;
    order.products.forEach((product) => {
      if (!product.with_coins) sum += product.price * product.quantity;
    });

    const city = cities.find((city: any) => city.city === order.city);
    sum += city.value;
    sum -= discount.value;

    setTotal(sum);
    setDelivered(city.value);
  }, [order]);

  const handleCancel = useMutation({
    mutationFn: (id: string) => {
      return fetch(`${BASE_URL}/order/cancel/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("تم اضافة بنجاح");
      refetch();
    },
    onError: () => {
      toast.error("فشل في اضافة");
    },
  });

  return (
    <div className=" w-11/12 md:w-4/5 flow-root shadow-lg bg-white rounded-lg border border-gray-100 py-3 mx-5 sm:mx-14">
      {order.processing === 1 && order.delivered === 0 ? (
        <>
          <img
            src={`${IMAGE_BASE_URL}/img/processing.webp`}
            alt="الطلب قيد التجهيز"
            className="h-40 w-40 mx-auto"
          />
          <p className="text-center text-primary font-bold">
            الطلب قيد التجهيز
          </p>
        </>
      ) : (
        order.delivered === 0 && (
          <button
            onClick={() => handleCancel.mutate(order.id)}
            className="bg-primary-400 px-3 py-2 text-white rounded shadow mr-2 mb-2"
          >
            إلغاء الطلب
          </button>
        )
      )}
      {order.delivered === 1 && (
        <>
          <img
            src={`${IMAGE_BASE_URL}/img/delivered.webp`}
            alt="نشكركم على حسن ثقتكم بنا"
            className="h-40 w-40 mx-auto"
          />
          <p className="text-center text-primary font-bold">
            نشكركم على حسن ثقتكم بنا
          </p>
        </>
      )}

      <dl className="-my-3 divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">رقم الطلب</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {order.id.substring(0, 8)}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">تاريخ الطلب</dt>
          <dd dir="ltr" className="text-gray-700 text-end sm:col-span-2">
            {order.created_at}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">طريقة الدفع</dt>
          <dd className="text-gray-700 sm:col-span-2 capitalize">
            {METHODS[order.method as keyof typeof METHODS]}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">منتجات الطلب</dt>
          <dd className="text-gray-700 sm:col-span-2">
            <table className="w-full">
              <thead>
                <tr className="grid grid-cols-4">
                  <th>منتج</th>
                  <th>سعر</th>
                  <th>كمية</th>
                  <th>المجموع</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.products.map((product: OrderProduct) => (
                  <tr
                    key={product.id}
                    className="grid grid-cols-4 place-items-center"
                  >
                    <td className="text-center sm:hidden">
                      {product.name.length <= 20
                        ? product.name
                        : product.name.substring(0, 18) + "..."}
                    </td>
                    <td className="text-center hidden sm:block">
                      {product.name}
                    </td>
                    <td className="text-center">{product.price}</td>
                    <td className="text-center">{product.quantity}</td>
                    <td className="text-center">
                      {!product.with_coins
                        ? product.quantity * product.price
                        : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">التوصيل</dt>
          <dd className="text-gray-700 sm:col-span-2">{delivered} ج.م</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">إجمالي الطلب</dt>
          <dd className="text-gray-700 sm:col-span-2">{total} ج.م</dd>
        </div>
        {discount.code !== "" ? (
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-bold  text-primary">قسيمة</dt>
            <dd className="text-gray-700 sm:col-span-2">{discount.code}</dd>
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">الطلب قيد التجهيز</dt>
          <dd className="text-gray-700 sm:col-span-2 capitalize">
            {order.processing == 1 ? "نعم" : "لا"}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">تم تسليم الطلب</dt>
          <dd className="text-gray-700 sm:col-span-2 capitalize">
            {order.delivered == 1 ? "نعم" : "لا"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default OrderCard;
