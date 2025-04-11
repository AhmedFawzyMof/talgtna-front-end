import { create } from "zustand";

interface CartProduct {
  id: number;
  quantity: number;
  name: string;
  image: string;
  price: number;
}

type CartStore = {
  cart: CartProduct[];
  discount: { [key: string]: number | string };
  setDiscount: (code: string, value: number) => void;
  initlize: () => void;
  addToCart: (product: CartProduct) => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  getTotalQuantity: () => number;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  discount: {},
  initlize: () => {
    set((state) => {
      const cart = JSON.parse(localStorage.getItem("cart") as string) || [];

      if (cart) {
        state.cart = cart;
        return state;
      }

      return state;
    });
  },
  setDiscount: (code: string, value: number) => {
    set((state) => {
      state.discount = { code: code, value: value };
      return { discount: state.discount };
    });
  },
  addToCart: (product: CartProduct) => {
    set((state) => {
      const item = state.cart.find((i: CartProduct) => i.id === product.id);
      if (!item) {
        const updatedCart = [...state.cart, { ...product }];
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        return { cart: updatedCart };
      }
      return { cart: state.cart };
    });
  },
  incrementQuantity: (id: number) => {
    set((state) => {
      const item = state.cart.find((i: CartProduct) => i.id === id);
      if (item) {
        const updatedCart = state.cart.map((i: CartProduct) => {
          if (i.id === id) {
            if (i.quantity < 20) {
              return { ...i, quantity: i.quantity + 1 };
            }
          }
          return i;
        });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return { cart: updatedCart };
      }
      return { cart: state.cart };
    });
  },
  decrementQuantity: (id: number) => {
    set((state) => {
      const item = state.cart.find((i: CartProduct) => i.id === id);
      if (item) {
        const updatedCart = state.cart.map((i: CartProduct) => {
          if (i.id === id) {
            if (i.quantity > 1) {
              return { ...i, quantity: i.quantity - 1 };
            }
          }
          return i;
        });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return { cart: updatedCart };
      }
      return { cart: state.cart };
    });
  },
  removeFromCart: (id: number) => {
    set((state) => {
      const updatedCart = state.cart.filter((i: CartProduct) => i.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    });
  },
  getTotalQuantity: () => {
    const state = useCartStore.getState();
    const totalQuantity: number = state.cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    return totalQuantity;
  },
  clearCart: () => {
    set(() => {
      localStorage.setItem("cart", JSON.stringify([]));
      return { cart: [] };
    });
  },
}));
