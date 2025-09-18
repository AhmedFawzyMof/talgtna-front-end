import { useCartStore } from "../store/CartStore";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function CartToast() {
  const cartStore = useCartStore((state) => state);
  const [showToast, setShowToast] = useState(false);
  const pathname = useLocation().pathname;

  useEffect(() => {
    if (cartStore.getTotalQuantity() > 0) {
      setShowToast(true);
    }
  }, [cartStore.getTotalQuantity()]);

  useEffect(() => {
    if (pathname === "/cart" || pathname === "/order") {
      setShowToast(false);
    }
  }, [pathname]);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-4 z-50 max-w-sm w-full"
        >
          <Card className="relative shadow-xl border border-primary/20">
            <button
              className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive"
              onClick={() => setShowToast(false)}
            >
              <MdCancel className="text-xl" />
            </button>
            <CardContent className="p-4 flex flex-col gap-3">
              <p className="text-sm font-medium text-primary">
                🛒 عدد المنتجات في سلة التسوق:{" "}
                <span className="font-bold">
                  {cartStore.getTotalQuantity()}
                </span>
              </p>
              <Button asChild className="w-full">
                <Link to="/cart">انتقل إلى عربة التسوق لإكمال الطلب</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
