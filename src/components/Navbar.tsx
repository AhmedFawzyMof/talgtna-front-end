import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";
import { useState } from "react";
import { useCartStore } from "../store/CartStore";
import { useAuthStore } from "../store/AuthStore";

function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  return (
    <nav className="relative h-14 w-full bg-white shadow-sm flex items-center justify-between px-2 md:px-6 gap-5">
      <div
        className={`firstSection flex ${
          isAuth ? "gap-2" : "gap-2"
        } h-full items-center`}
      >
        <button id="menuBtn" onClick={() => setIsActive(!isActive)}>
          <i className="bx bx-menu text-3xl"></i>
        </button>
        <Link to="/cart" className="cart relative">
          <span
            id="cartQuantity"
            className={`${
              totalQuantity > 0 ? "block" : "hidden"
            } absolute bg-primary text-white p-1 rounded -top-2 -right-2`}
          >
            {totalQuantity}
          </span>
          <i className="bx bx-cart-alt text-3xl"></i>
          <p className="text-3xl sr-only">سلة الشراء</p>
        </Link>
        {isAuth ? (
          <Link to="/favorites" className="login">
            <i className="bx bx-heart text-3xl"></i>
            <p className="text-3xl sr-only">المفضلة</p>
          </Link>
        ) : null}
      </div>
      <form action="/search" className="relative w-[60%]">
        <input
          type="search"
          name="query"
          placeholder="ابحث عن منتجاتك ..."
          className="w-full h-full border border-primary rounded-md px-3 py-1"
        />
        <button
          type="submit"
          className="absolute bg-primary top-1/2 -translate-y-1/2 w-11 left-0 h-full rounded-l-md"
        >
          <i className="bx bx-search text-3xl text-white"></i>
        </button>
      </form>
      <div className="thirdSection">
        <Link to="/" className="logo">
          <img src={logoImg} alt="logo" className="w-12" />
        </Link>
      </div>

      <div
        className={`menu absolute bg-white h-[90vh] w-[250px] top-[105%] rounded shadow-xl z-50 right-0 flex flex-col gap-4 p-4 duration-300 transition-all ${
          isActive ? "translate-x-0" : " translate-x-[250px]"
        }`}
      >
        {isAuth ? (
          <Link
            to="/coupons"
            className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
          >
            القسائم
          </Link>
        ) : null}
        <Link
          to="/"
          className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
        >
          الصفحة الرئيسية
        </Link>
        {isAuth ? (
          <Link
            to="/order/history"
            className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
          >
            سجل الطلبات
          </Link>
        ) : null}
        <Link
          to="/contact"
          className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
        >
          أتصل بنا
        </Link>
        <Link
          to="/about"
          className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
        >
          معلومات عنا
        </Link>
        <Link
          to="/complaint"
          className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
        >
          الشكوي
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
