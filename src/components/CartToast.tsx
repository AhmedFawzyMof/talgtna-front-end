import { Button } from "flowbite-react";
import { useCartStore } from "../store/CartStore";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CartToast() {
  const cartStore = useCartStore((state) => state);
  const [showToast, setShowToast] = useState(false);
  const pathname = useLocation().pathname;

  useEffect(() => {
    if (cartStore.getTotalQuantity() > 0) {
      setShowToast(true);
    }
  }, []);

  useEffect(() => {
    if (pathname === "/cart" || pathname === "/order") {
      setShowToast(false);
    }
  }, [pathname]);

  return showToast ? (
    <div className="fixed bottom-10 right-4 z-30 bg-white p-3 shadow-lg rounded flex flex-col gap-3">
      <p>عدد المنتجات في سلة التسوق: {cartStore.getTotalQuantity()}</p>
      <Button href="/cart" className="bg-primary font-bold">
        انتقل إلى عربة التسوق لإكمال الطلب
      </Button>
    </div>
  ) : null;
}
