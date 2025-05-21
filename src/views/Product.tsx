import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../store/CartStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { BASE_URL, IMAGE_BASE_URL } from "../config/config";
import { FaRegHeart, FaHeart, FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "sonner";

function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authStore = useAuthStore((state) => state);
  const cartStore = useCartStore((state) => state);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const [product, setProduct] = useState<Product>({} as Product);
  const [quantity, setQuantity] = useState(1);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const coin_store = params.get("coin_store");

  useEffect(() => {
    const ID = parseInt(id as string);
    const item = cartStore.cart.find((item) => item.id === ID);
    if (item) {
      setQuantity(item.quantity);
    }
  }, [cartStore.cart, id, cartStore.getTotalQuantity()]);

  const handelIncrement = () => {
    const ID = parseInt(id as string);
    const item = cartStore.cart.find((item) => item.id === ID);

    if (item && product.id) {
      incrementQuantity(product.id);
    }

    if (quantity < 20) {
      setQuantity(quantity + 1);
    }
  };

  const handelDecrement = () => {
    const ID = parseInt(id as string);
    const item = cartStore.cart.find((item) => item.id === ID);

    if (item && product.id) {
      decrementQuantity(product.id);
    }

    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const { isLoading, error, data, refetch } = useQuery(
    ["product", id, coin_store],
    () =>
      fetch(`${BASE_URL}/products/${id}?coin_store=${coin_store}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }).then((res) => res.json())
  );

  const mutation = useMutation(
    async (data: unknown) => {
      const response = await fetch(`${BASE_URL}/user/fav`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.error("فشلت في الإضافة إلى المفضلة");
      }
      const responseData = await response.json();
      if (responseData.success) {
        toast.success("تمت الإضافة إلى المفضلة بنجاح");
        if (typeof refetch === "function") refetch();
        authStore.setFavorites();
      } else {
        toast.error("المنتج موجود بالفعل في المفضلة");
      }
    },
    {
      onError: () => {
        toast.error("فشلت في الإضافة إلى المفضلة");
      },
    }
  );

  useEffect(() => {
    if (data && data.redirect) {
      navigate("/");
    }
    if (data && data.product) {
      setProduct(data.product);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>An error has occurred: {(error as Error).message}</p>;

  if (!product || !product.id) {
    return <p>Product not found.</p>;
  }

  const addToFavourite = () => {
    if (authStore.isAuthenticated) {
      mutation.mutate({ product_id: product.id });
    } else {
      toast.error("يجب عليك تسجيل الدخول");
    }
  };

  document.title = `Talagtna | ${product.name}`;

  const CartProduct = {
    id: product.id,
    quantity: quantity,
    name: product.name,
    image: product.image,
    price: product.price,
    with_coins: coin_store === "true",
  };

  return (
    <div className="h-screen grid place-items-center">
      <div
        key={product.id}
        className="product relative my-5 rounded p-2 border shadow-md grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 place-items-center"
      >
        <section id="productDitails" className="flex flex-col gap-2 md:gap-5">
          <h1 className="text-2xl text-primary">{product.name}</h1>
          <p className="text-gray-400">{product.description}</p>
          {product.offer > 0 ? (
            <div className="container">
              <p className="line-through text-gray-500">
                {product.price + product.offer} ج
              </p>
              <p className="text-primary font-bold">{product.price} ج</p>
            </div>
          ) : (
            <p>
              {coin_store === "true"
                ? `${product.price * 50} نقط`
                : product.price + " ج"}
            </p>
          )}
          <div className="cart grid gap-2 md:gap-5">
            {coin_store !== "true" && (
              <div className="buttons flex border border-primary w-full md:w-64 items-center justify-between h-9 rounded gap-2 md:gap-5">
                <button
                  onClick={handelIncrement}
                  className="w-full text-xl grid place-items-center cursor-pointer h-full duration-300 hover:bg-primary hover:text-white transition ease-in-out"
                >
                  <FaPlus />
                </button>
                <p className="Quantity">{quantity}</p>
                <button
                  onClick={handelDecrement}
                  className="w-full text-xl grid place-items-center cursor-pointer h-full duration-300 hover:bg-primary hover:text-white transition ease-in-out"
                >
                  <FaMinus />
                </button>
              </div>
            )}
            <button
              onClick={() => cartStore.addToCart(CartProduct)}
              className="w-full md:w-64 h-9 rounded bg-primary text-white"
            >
              اضافة الى السلة
            </button>
            {authStore.isAuthenticated && coin_store !== "true" ? (
              <button
                onClick={addToFavourite}
                className="absolute top-0 left-0 w-11 h-11 bg-primary text-white rounded grid place-items-center shadow-xl"
              >
                {data.favorites ? <FaHeart /> : <FaRegHeart />}
              </button>
            ) : null}
          </div>
        </section>
        <section
          id="productImage "
          className="grid place-items-center w-full row-start-1 md:col-start-2"
        >
          <img
            src={`${IMAGE_BASE_URL}${product.image}`}
            alt={product.name}
            className="w-full md:w-[398px] rounded"
          />
        </section>
      </div>
    </div>
  );
}

export default ProductView;
