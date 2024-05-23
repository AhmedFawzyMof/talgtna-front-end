import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useCartStore } from "../store/CartStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
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

function ProductView() {
  const { id } = useParams();
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const [quantity, setQuantity] = useState(1);
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  useEffect(() => {
    const ID = parseInt(id as string);
    const item = cart.find((item) => item.id === ID);
    if (item) {
      setQuantity(item.quantity);
    }
  }, [cart, id, totalQuantity]);

  const handelIncrement = () => {
    const ID = parseInt(id as string);
    const item = cart.find((item) => item.id === ID);

    if (item) {
      incrementQuantity(product.id);
    }

    if (quantity < 20) {
      setQuantity(quantity + 1);
    }
  };

  const handelDecrement = () => {
    const ID = parseInt(id as string);
    const item = cart.find((item) => item.id === ID);

    if (item) {
      decrementQuantity(product.id);
    }

    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const { isLoading, error, data } = useQuery("home", () =>
    fetch(`${BASE_URL}/products/${id}`).then((res) => res.json())
  );

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>An error has occurred: {(error as Error).message}</p>;

  const product: Product = data?.product ?? {};

  document.title = `EasyCookFrozen | ${product.name}`;
  const CartProduct = {
    id: product.id,
    quantity: quantity,
    name: product.name,
    image: product.image,
    price: product.price,
  };

  return (
    <div className="container">
      <div className="grid place-items-center ">
        <div
          key={product.id}
          className="product relative w-11/12 md:w-10/12 my-5 rounded p-2 shadow bg-white grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 place-items-center"
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
              <p>{product.price} ج</p>
            )}
            <div className="cart grid gap-2 md:gap-5">
              <div className="buttons flex border border-primary w-full md:w-64 items-center justify-between h-9 rounded gap-2 md:gap-5">
                <button
                  onClick={handelIncrement}
                  className="w-full text-xl grid place-items-center cursor-pointer h-full duration-300 hover:bg-primary hover:text-white transition ease-in-out"
                >
                  <i className="bx bx-plus"></i>
                </button>
                <p className="Quantity">{quantity}</p>
                <button
                  onClick={handelDecrement}
                  className="w-full text-xl grid place-items-center cursor-pointer h-full duration-300 hover:bg-primary hover:text-white transition ease-in-out"
                >
                  <i className="bx bx-minus"></i>
                </button>
              </div>
              <button
                onClick={() => addToCart(CartProduct)}
                className="w-full md:w-64 h-9 rounded bg-primary text-white"
              >
                اضافة الى السلة
              </button>
              {isAuth ? (
                <button className="absolute top-0 left-0 w-11 h-11 bg-primary text-white rounded grid place-items-center shadow-xl">
                  <i className="bx bx-heart text-xl"></i>
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
              className="w-full md:w-[398px] rounded shadow"
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductView;
