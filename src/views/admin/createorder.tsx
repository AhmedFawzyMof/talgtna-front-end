import { getProducts } from "@/actions/products";
import Header from "@/components/admin/header";
import Loading from "@/components/admin/loading";
import { PaginationNav } from "@/components/admin/pagination";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/Product";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCartStore } from "@/store/CartStore";
import CartItem from "@/components/CartItem";
import { AddOrder } from "@/components/admin/orders/add";

export default function CreateOrder() {
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string>("");
  const cartStore = useCartStore((state) => state);
  const [discount, setDiscount] = useState(cartStore.discount.value);
  const [subtotal, setSubtotal] = useState(0);
  const cart = cartStore.cart;
  const totalQuantity = cartStore.getTotalQuantity();

  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setValue(search);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  document.title = "Talagtna | السلة";

  useEffect(() => {
    setSubtotal(
      cart.reduce((total, item) => {
        if (!item.with_coins) {
          return total + item.price * item.quantity;
        }
        return total;
      }, 0)
    );
  }, [cart, totalQuantity]);

  useEffect(() => {
    if (subtotal > 100) {
      const value: number = cartStore.discount.value;
      const percentage: number = subtotal * value;
      setDiscount(percentage);
    } else {
      setDiscount(0);
      cartStore.setDiscount("", 0);
    }
  }, [subtotal, cartStore.discount.value]);

  const total = subtotal - discount;

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["products", limit, value],
    queryFn: () => getProducts(authStore.token, limit, search),
    staleTime: Infinity,
  });

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Header title="المنتجات" />
      <div className="flex flex-col w-full items-start gap-5 md:flex-row md:gap-2 space-x-2">
        <Input
          className="py-2 max-w-md"
          type="search"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <PaginationNav
        numberOfPages={data?.data.totalPages}
        pageName="product-page"
        setLimit={setLimit}
      />

      <div className="cart">
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
            <div className="flex flex-col mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div>
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

                      {discount !== 0 && (
                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                            التوفير
                          </dt>
                          <dd className="text-base font-medium text-green-600">
                            {discount} ج
                          </dd>
                        </dl>
                      )}
                    </div>

                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                      <dt className="text-base font-bold text-gray-900 dark:text-white">
                        المجموع
                      </dt>
                      <dd className="text-base font-bold text-gray-900 dark:text-white">
                        {total} ج
                      </dd>
                    </dl>
                  </div>
                  <AddOrder />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data?.data.products.map((product: any) => (
          <ProductCard
            product={product}
            isAuthenticated={false}
            inFavorites={false}
            refetch={refetch}
            key={product.id}
          />
        ))}
      </div>
    </div>
  );
}
