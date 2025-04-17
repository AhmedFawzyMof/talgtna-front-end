import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";
import { useEffect, useState } from "react";
import { useCartStore } from "../store/CartStore";
import { useAuthStore } from "../store/AuthStore";
import { IoIosCart, IoIosMenu, IoIosHeart, IoIosSearch } from "react-icons/io";
import { Badge } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { FaDownload } from "react-icons/fa";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const isIos = /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase()
  );
  const isInStandaloneMode =
    "standalone" in window.navigator && (window.navigator as any).standalone;
  const authStore = useAuthStore((state) => state);
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: Event) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (isIos && !isInStandaloneMode) {
      setIsInstallable(true);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the PWA installation");
    } else {
      console.log("User dismissed the PWA installation");
    }
    setDeferredPrompt(null); // Clear the prompt
    setIsInstallable(false);
  };

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;
    setSearchOpen(false);
    setQuery("");
    navigate(`/search?query=${query}`);
  };

  const handelLogout = () => {
    authStore.logout();
    navigate("/");
  };

  return (
    <nav className="relative h-14 w-full bg-white shadow-sm flex items-center justify-between px-2 md:px-6 gap-5">
      <div className="flex items-center gap-2 md:gap-5">
        <button id="menuBtn" onClick={() => setIsActive(!isActive)}>
          <IoIosMenu className="text-3xl" />
        </button>
        <Link
          onClick={() => setIsActive(false)}
          to="/cart"
          className="cart relative"
        >
          {totalQuantity > 0 ? (
            <Badge className="absolute -top-2 -right-2 bg-primary text-white font-bold">
              {totalQuantity}
            </Badge>
          ) : null}
          <IoIosCart className="text-3xl" />
          <p className="text-3xl sr-only">سلة الشراء</p>
        </Link>
        {authStore.isAuthenticated ? (
          <Link
            onClick={() => setIsActive(false)}
            to="/favorites"
            className="relative"
          >
            <IoIosHeart className="text-3xl" />
            {authStore.favorites > 0 ? (
              <Badge className="absolute -top-2 -right-2 bg-primary text-white font-bold">
                {authStore.favorites}
              </Badge>
            ) : null}
            <p className="text-3xl sr-only">المفضلة</p>
          </Link>
        ) : null}
        {isInstallable && (
          <button onClick={handleInstallClick}>
            <FaDownload className="text-3xl" />
          </button>
        )}
        <button
          id="searchBtn"
          className="md:hidden"
          onClick={() => setSearchOpen(!isSearchOpen)}
        >
          <IoIosSearch className="text-3xl" />
        </button>
        <form
          action="/search"
          className="hidden md:block relative w-[60%]"
          onSubmit={(e) => handelSubmit(e)}
        >
          <input
            type="search"
            name="query"
            placeholder="ابحث عن منتجاتك ..."
            className="w-full h-full border border-primary rounded-md px-3 py-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute bg-primary top-1/2 -translate-y-1/2 w-11 left-0 h-full rounded-l-md flex items-center justify-center"
          >
            <IoIosSearch className="text-3xl text-white text-center" />
          </button>
        </form>
      </div>
      <Link onClick={() => setIsActive(false)} to="/" className="logo h-full">
        <img src={logoImg} alt="logo" className=" w-30 h-full" />
      </Link>

      <div
        className={`menu absolute bg-white h-[90vh] w-[250px] top-[105%] rounded shadow-xl z-50 right-0 flex flex-col gap-4 p-4 duration-300 transition-all ${
          isActive ? "translate-x-0" : " translate-x-[250px]"
        }`}
      >
        <Link
          onClick={() => setIsActive(false)}
          to="/"
          className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
        >
          الصفحة الرئيسية
        </Link>
        {isInstallable && (
          <button
            id="searchBtn"
            className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded flex gap-2 items-center "
            onClick={handleInstallClick}
          >
            تثبيت التطبيق <FaDownload className="text-xl" />
          </button>
        )}
        {isIos && isInstallable && (
          <div className="p-3 bg-yellow-200 text-sm rounded shadow">
            لتثبيت التطبيق، اضغط على <strong>مشاركة</strong> ثم اختر{" "}
            <strong>"إضافة إلى الشاشة الرئيسية"</strong>.
          </div>
        )}
        {authStore.isAuthenticated ? (
          <Link
            onClick={() => setIsActive(false)}
            to="/order/history"
            className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
          >
            سجل الطلبات
          </Link>
        ) : null}
        <Link
          onClick={() => setIsActive(false)}
          to="/contact"
          className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
        >
          تواصل معنا
        </Link>
        <Link
          onClick={() => setIsActive(false)}
          to="/about"
          className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
        >
          معلومات عنا
        </Link>
        <Link
          onClick={() => setIsActive(false)}
          to="/complaint"
          className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
        >
          الشكوي
        </Link>
        {authStore.isAuthenticated && (
          <button
            onClick={handelLogout}
            className="w-full py-2 duration-300 hover:bg-primary hover:pr-1 hover:text-white rounded"
          >
            تسجيل الخروج
          </button>
        )}
      </div>
      <div
        className={`h-14 bg-white duration-300 w-full absolute ${
          isSearchOpen ? "z-10" : "-z-10"
        } left-0 top-[56px] shadow-md grid place-items-center ${
          isSearchOpen ? "translate-y-0" : "translate-y-[-100%]"
        }`}
      >
        <form
          action="/search"
          className="relative w-full"
          onSubmit={(e) => handelSubmit(e)}
        >
          <input
            type="search"
            name="query"
            placeholder="ابحث عن منتجاتك ..."
            className="w-full h-full border border-primary rounded-md px-3 py-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute bg-primary top-1/2 -translate-y-1/2 w-11 left-0 h-full rounded-l-md flex items-center justify-center"
          >
            <IoIosSearch className="text-3xl text-white text-center" />
          </button>
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
