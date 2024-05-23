import { useEffect, useState } from "react";
import { useCartStore } from "../store/CartStore";
import CartItem from "../components/CartItem";
import CartEmpty from "../assets/cart.png";
import { Link } from "react-router-dom";

function Cart() {
  const cart = useCartStore((state) => state.cart);
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());
  const [subtotal, setSubtotal] = useState(0);
  const discount = useCartStore((state) => state.discount);
  const total = subtotal + 25;
  const discountValue: number = discount.value as number;
  const totalDiscount: number = total - discountValue;
  document.title = "EasyCookFrozen | السلة";

  useEffect(() => {
    setSubtotal(
      cart.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  }, [cart, totalQuantity]);
  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 bg-white my-4 rounded shadow-lg">
        <div
          id="EmptyCart"
          className={`w-full ${
            totalQuantity > 0 ? "hidden" : "grid"
          } place-items-center`}
        >
          <img
            src={CartEmpty}
            alt="Empty Cart"
            className="max-h-80 max-w-80 w-full"
          />
          <div className="inset-x-0 bottom-10 flex flex-col items-center justify-center">
            <a
              href="/"
              className="bg-primary text-white px-4 py-2 rounded-full"
            >
              اذهب للتسوق
            </a>
          </div>
        </div>
        <div
          className={`mx-auto max-w-3xl ${totalQuantity > 0 ? "" : "hidden"}`}
        >
          <header className="text-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
              سلة التسوق
            </h1>
          </header>

          <div className="mt-8">
            <ul className="space-y-4" id="cartContainer">
              {cart.map((item) => (
                <CartItem key={item.id} product={item} />
              ))}
            </ul>

            <div
              id="checkout"
              className="mt-8 flex justify-start border-t border-gray-100 pt-8"
            >
              <div className="w-screen max-w-lg space-y-4">
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
                    <dd id="total">
                      {discountValue ? totalDiscount : total} ج.م
                    </dd>
                  </div>
                </dl>

                <div className="flex justify-start">
                  <Link
                    to="/order"
                    className="block rounded bg-primary px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                  >
                    اطلب الان
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
