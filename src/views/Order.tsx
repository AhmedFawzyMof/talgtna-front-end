import { useEffect, useState } from "react";
import { useCartStore } from "../store/CartStore";
import { useNavigate } from "react-router-dom";
import OrderForm from "../components/OrderForm";
import { useQuery } from "react-query";
import { BASE_URL } from "../config/config";

export default function Order() {
  const cartStore = useCartStore((state) => state);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();
  const total = subtotal + cartStore.dilivery;
  const totalQuantity = cartStore.getTotalQuantity();
  const discountValue: number = cartStore.discount.value;
  const totalDiscount: number = total - discountValue;

  const { data, error, isLoading } = useQuery(["city"], () =>
    fetch(`${BASE_URL}/city`).then((res) => res.json())
  );

  document.title = "Talgtna | الطلب";

  useEffect(() => {
    if (cartStore.cart.length === 0) {
      navigate("/");
    }

    setSubtotal(
      cartStore.cart.reduce((total, item) => {
        if (!item.with_coins) {
          return total + item.price * item.quantity;
        }
        return total;
      }, 0)
    );
  }, [cartStore.cart, totalQuantity]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error has occurred: {(error as Error).message}</div>;
  }

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
                <dd>{cartStore.dilivery} ج.م</dd>
              </div>

              {discountValue > 0 && (
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
        </div>
      </section>
      <section className="grid place-items-center py-7">
        <OrderForm totalDiscount={totalDiscount} cities={data} />
      </section>
    </>
  );
}
