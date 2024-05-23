import { Link } from "react-router-dom";
import { useCartStore } from "../store/CartStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { BASE_URL, IMAGE_BASE_URL } from "../store/config";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  company: string;
  description: string;
  offer: number;
  available: number;
}

function ProductCard({
  product,
  isFavorite,
}: {
  product: Product;
  isFavorite: boolean;
}) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const cart = useCartStore((state) => state.cart);
  const [isInCart, setInCart] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const [quantity, setQuantity] = useState(1);
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  const mutation = useMutation(
    async (data: unknown) => {
      const response = await fetch(`${BASE_URL}/user/fav`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.error("فشلت في الإضافة إلى المفضلة");
      }
      const responseData = await response.json();
      if (responseData.success) {
        toast.success("تمت الإضافة إلى المفضلة بنجاح");
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

  const addToFavourite = () => {
    if (isAuth) {
      mutation.mutate({ user: token, product: CartProduct.id });
    } else {
      toast.error("يجب عليك تسجيل الدخول");
    }
  };

  useEffect(() => {
    const item = cart.find((item) => item.id === product.id);
    if (item) {
      setInCart(true);
      setQuantity(item.quantity);
    }
  }, [cart, product.id, totalQuantity]);

  const CartProduct = {
    id: product.id,
    quantity: quantity,
    name: product.name,
    image: product.image,
    price: product.price,
  };

  const handelIncrement = () => {
    if (quantity < 20) {
      setQuantity(quantity + 1);
    }
    incrementQuantity(product.id);
  };

  const handelDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
    decrementQuantity(product.id);
  };

  if (product.available === 0) return null;
  return (
    <div
      key={product.id}
      className="block rounded-lg p-4 shadow-lg bg-white shadow-orange-100 relative"
    >
      <Link to={`/products/${product.id}`}>
        <img
          alt={product.name}
          src={IMAGE_BASE_URL + product.image}
          className="h-56 w-full rounded-md object-cover"
        />
      </Link>
      <Link to={`/products/${product.id}`}>
        <div className="mt-2">
          <dl>
            {product.offer > 0 ? (
              <div className="container">
                <div>
                  <dt className="sr-only">Price</dt>

                  <dd className="text-sm text-gray-500 line-through">
                    {product.price + product.offer} ج
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Offer Price</dt>

                  <dd className="text-sm text-primary font-bold">
                    {product.price} ج
                  </dd>
                </div>
              </div>
            ) : (
              <div>
                <dt className="sr-only">Price</dt>

                <dd className="text-sm text-primary">{product.price} ج</dd>
              </div>
            )}
            <div>
              <dt className="sr-only">Product Name</dt>

              <dd className="font-medium">{product.name}</dd>
            </div>
          </dl>
        </div>
      </Link>
      <div className="buttons absolute top-5 left-5 flex flex-col text-primary text-3xl gap-2 md:gap-5">
        <button
          id="addBtn"
          onClick={() => addToCart(CartProduct)}
          className={`${
            isInCart ? "hidden" : "flex"
          } bg-white p-2 rounded shadow z-50x`}
        >
          <i className="bx bx-cart-add"></i>
        </button>
        <div
          className={`inCart ${
            isInCart ? "flex" : "hidden"
          } bg-white p-1 flex-col items-center rounded shadow gap-2`}
        >
          <button
            onClick={handelIncrement}
            className="text-lg border border-primary rounded-lg cursor-pointer grid place-items-center w-full h-8"
          >
            <i className="bx bx-plus"></i>
          </button>
          <p className="Quantity text-lg">{quantity}</p>
          <button
            onClick={handelDecrement}
            className="text-lg border border-primary rounded-lg cursor-pointer grid place-items-center w-full h-8"
          >
            <i className="bx bx-minus"></i>
          </button>
        </div>
        {isAuth && !isFavorite ? (
          <button
            onClick={addToFavourite}
            id="addToFav"
            className="bg-white p-2 rounded shadow"
          >
            <i className="bx bxs-heart"></i>
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default ProductCard;
