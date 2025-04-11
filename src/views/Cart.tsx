import { useEffect, useState } from "react";
import { useCartStore } from "../store/CartStore";
import CartItem from "../components/CartItem";
import CartEmpty from "../assets/cart.png";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function Cart() {
  const cart = useCartStore((state) => state.cart);
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());
  const [subtotal, setSubtotal] = useState(0);
  const discount = useCartStore((state) => state.discount);
  const discountValue: number = discount.value as number;
  const delvery = 25;
  const total = subtotal + delvery;
  let totalDiscount: number = total;

  if (discountValue) {
    totalDiscount = total - discountValue;
  }

  document.title = "Talgtna | السلة";

  useEffect(() => {
    setSubtotal(
      cart.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  }, [cart, totalQuantity]);
  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      {cart.length > 0 && (
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            عربة التسوق
          </h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                {cart.map((product) => (
                  <CartItem key={product.id} product={product} />
                ))}
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  ملخص الطلب
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        السعر الأصلي
                      </dt>
                      <dd className="text-base font-medium text-gray-900 dark:text-white">
                        {subtotal} ج
                      </dd>
                    </dl>

                    {discountValue !== 0 || discountValue !== undefined || (
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                          التوفير
                        </dt>
                        <dd className="text-base font-medium text-green-600">
                          {discountValue} ج
                        </dd>
                      </dl>
                    )}
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        توصيل
                      </dt>
                      <dd className="text-base font-medium text-red-600">
                        {delvery} ج
                      </dd>
                    </dl>
                  </div>

                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">
                      المجموع
                    </dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                      {totalDiscount} ج
                    </dd>
                  </dl>
                </div>

                <Link
                  to="/order"
                  className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  الطلب
                </Link>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    أو
                  </span>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                  >
                    مواصلة التسوق <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {cart.length === 0 && (
        <div className="w-full grid place-items-center">
          <div className="flex items-center justify-center flex-col gap-4 mt-12 w-64 shadow-md border border-gray-200 rounded p-4">
            <img className="h-40 w-40" src={CartEmpty} alt="empty cart" />
            <Link
              to="/"
              className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              مواصلة التسوق
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;
