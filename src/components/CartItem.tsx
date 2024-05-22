import { useCartStore } from "../store/CartStore";
import { IMAGE_BASE_URL } from "../store/config";

interface CartProduct {
  id: number;
  quantity: number;
  name: string;
  image: string;
  price: number;
}
function CartItem({ product }: { product: CartProduct }) {
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);

  return (
    <>
      <li className="flex items-center gap-4" id="cartItem">
        <img
          id="itemImage"
          src={IMAGE_BASE_URL + product.image}
          alt={product.name}
          className="w-16 h-16 rounded object-cover"
        />

        <div>
          <h3 className="text-sm text-gray-900" id="itemName">
            {product.name.length > 35
              ? product.name.slice(0, 35) + "..."
              : product.name}
          </h3>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="buttons flex flex-col md:flex-row border border-primary w-11 md:w-32 items-center justify-between h-auto md:h-9 rounded gap-2 md:gap-5">
            <button
              onClick={() => {
                incrementQuantity(product.id);
              }}
              id="incQuantityBtn"
              className="w-full text-xl grid place-items-center cursor-pointer h-full duration-300 hover:bg-primary hover:text-white transition ease-in-out"
            >
              <i className="bx bx-plus"></i>
            </button>
            <p className="Quantity text-lg">{product.quantity}</p>
            <button
              onClick={() => {
                decrementQuantity(product.id);
              }}
              id="decQuantityBtn"
              className="w-full text-xl grid place-items-center cursor-pointer h-full duration-300 hover:bg-primary hover:text-white transition ease-in-out"
            >
              <i className="bx bx-minus"></i>
            </button>
          </div>
          <button
            onClick={() => {
              removeFromCart(product.id);
            }}
            id="removeFromCart"
            className="text-gray-600 border border-primary grid place-items-center rounded px-3 h-9 transition hover:text-red-600"
          >
            <span className="sr-only">Remove item</span>
            <i className="bx bx-trash"></i>
          </button>
        </div>
      </li>
    </>
  );
}

export default CartItem;
