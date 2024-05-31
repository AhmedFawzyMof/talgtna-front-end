import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";
import { useState } from "react";
import { useCartStore } from "../store/CartStore";
import { useAuthStore } from "../store/AuthStore";

function Navbar() {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  const [open, setOpen] = useState(false);

  function IsOpen() {
    setOpen(!open);
  }

  const menuClassNclassName =
    "fixed inset-y-0 left-0 z-10 w-60 overflow-hidden duration-300 bg-white rounded-r-lg shadow-lg lg:static lg:shadow-none lg:bg-transparent lg:overflow-visible lg:w-auto lg:pt-0 lg:border-0 transition-all transform lg:-translate-x-0";

  return (
    <header className="h-14 bg-white py-1 px-1 shadow-md flex items-center justify-between overflow-hidden">
      <div className="flex items-center gap-2">
        <button onClick={IsOpen}>
          <i className="bx bx-menu-alt-right text-3xl"></i>
        </button>
        <Link
          to="/cart"
          className="duration-300 hover:text-primary-600 relative"
        >
          <span className="sr-only">العربة</span>
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary-600 px-2 rounded-md text-white">
              {totalQuantity}
            </span>
          )}
          <i className="bx bx-cart-alt text-3xl"></i>
        </Link>
        <form className="search rounded-md shadow bg-gray-50 text-primary-600 flex items-center px-2">
          <button type="submit" className="cursor-pointer">
            <i className="bx bx-search text-3xl"></i>
          </button>
          <input
            type="search"
            name="search"
            placeholder="ابحث عن منتجاتك ..."
            className="border-gray-50 bg-gray-50 w-full"
          />
        </form>
      </div>
      <ul
        className={
          open
            ? `${menuClassNclassName} translate-x-0`
            : `${menuClassNclassName} translate-x-full`
        }
      >
        <li className="link h-10 w-full flex items-center justify-start duration-300 hover:bg-primary-600 hover:pr-1 rounded-md hover:text-white">
          <Link
            to="/"
            className="w-full h-full flex items-center"
            onClick={IsOpen}
          >
            الرئيسية
          </Link>
        </li>
        <li className="link h-10 w-full flex items-center justify-start duration-300 hover:bg-primary-600 hover:pr-1 rounded-md hover:text-white">
          <Link
            to="/contact"
            className="w-full h-full flex items-center"
            onClick={IsOpen}
          >
            تواصل معنا
          </Link>
        </li>
        <li className="link h-10 w-full flex items-center justify-start duration-300 hover:bg-primary-600 hover:pr-1 rounded-md hover:text-white">
          <Link
            to="/about"
            className="w-full h-full flex items-center"
            onClick={IsOpen}
          >
            من نحن
          </Link>
        </li>
        {isAuth && (
          <>
            <li>
              <Link
                onClick={IsOpen}
                to="/coupons"
                className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
              >
                قسائم الخصم
              </Link>
            </li>
            <li>
              <Link
                onClick={IsOpen}
                to="/order/history"
                className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
              >
                سجل الطلبات
              </Link>
            </li>
          </>
        )}
      </ul>
      <Link to="/">
        <img
          src={logoImg}
          alt="Easy Cook Frozen Logo"
          className="w-16 md:w-32"
        />
      </Link>
    </header>
  );
}

export default Navbar;
