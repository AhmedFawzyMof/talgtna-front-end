import { Link, useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "../config/config";
import { MdMenuOpen } from "react-icons/md";
import { BsBasket2Fill } from "react-icons/bs";
import { FaHeart, FaDownload } from "react-icons/fa";
import { useAuthStore } from "../store/AuthStore";
import { Badge } from "flowbite-react";
import { useCartStore } from "../store/CartStore";
import { BiSearch } from "react-icons/bi";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function Navbar() {
  const authStore = useAuthStore((state) => state);
  const cartStore = useCartStore((state) => state);
  const [query, setQuery] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const isIos = /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase()
  );
  const isInStandaloneMode =
    "standalone" in window.navigator && (window.navigator as any).standalone;

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

  const handleLogout = () => {
    authStore.logout();
    navigate("/login");
  };

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;
    setQuery("");
    navigate(`/search?query=${query}`);
  };

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

  return (
    <header dir="ltr" className="sticky top-0 z-50 bg-white shadow ">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="block text-teal-600">
          <span className="sr-only">الرئيسية</span>
          <img
            src={IMAGE_BASE_URL + "/img/logo.png"}
            alt="Talgtna"
            className="h-10 w-auto"
          />
        </Link>

        <div
          dir="rtl"
          className="ml-auto flex items-center justify-start md:justify-between gap-2"
        >
          <button
            onClick={() => setIsActive(!isActive)}
            className="bg-primary text-white py-2 px-2 rounded shadow"
          >
            <span className="sr-only">القائمة</span>
            <MdMenuOpen className="text-xl" />
          </button>
          <Link
            to="/cart"
            className="relative bg-primary text-white py-2 px-2 rounded shadow"
          >
            <span className="sr-only">سلة التسوق</span>
            {cartStore.getTotalQuantity() > 0 && (
              <Badge className="absolute -top-2 -left-3 z-50" color="success">
                {cartStore.getTotalQuantity()}
              </Badge>
            )}
            <BsBasket2Fill className="text-xl" />
          </Link>
          {authStore.isAuthenticated && (
            <Link
              to="/favorites"
              className="relative bg-primary text-white py-2 px-2 rounded shadow"
            >
              <span className="sr-only">المفضلة</span>
              {authStore.favorites > 0 && (
                <Badge className="absolute z-50 -top-2 -left-3" color="success">
                  {authStore.favorites}
                </Badge>
              )}
              <FaHeart className="text-xl" />
            </Link>
          )}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="relative bg-primary text-white py-2 px-2 rounded shadow"
            >
              <FaDownload className="text-xl" />
            </button>
          )}
        </div>
      </div>
      <div
        dir="rtl"
        className={`absolute right-0 w-64 ${
          isActive ? "translate-x-0" : "translate-x-full"
        } duration-300 ease-in-out flex h-screen flex-col justify-between border-e border-gray-100 bg-white`}
      >
        <div className="px-4 py-6">
          <ul className="mt-6 space-y-3">
            <li>
              <form onSubmit={handelSubmit} className="relative">
                <input
                  type="search"
                  name="search"
                  className="w-full rounded-md border-2 border-primary-200 py-2 pr-10 focus:border-primary-200"
                  placeholder="بحث ..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute top-0 right-0 bg-primary text-white w-10 h-full grid place-items-center rounded-r-md"
                >
                  <BiSearch className="text-2xl" />
                </button>
              </form>
            </li>
            <li>
              <Link
                to="/"
                className="block rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-400 hover:text-white duration-300 ease-in-out"
              >
                الصفحة الرئيسية
              </Link>
            </li>
            {isInstallable && (
              <li>
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 w-full text-start rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-400 hover:text-white duration-300 ease-in-out"
                >
                  <p>تحميل التطبيق</p>
                  <FaDownload />
                </button>
              </li>
            )}
            <li>
              <Link
                to="/about"
                className="block rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-400 hover:text-white duration-300 ease-in-out"
              >
                من نحن
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-400 hover:text-white duration-300 ease-in-out"
              >
                تواصل معنا
              </Link>
            </li>
            <li>
              <Link
                to="/complaint"
                className="block rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-400 hover:text-white duration-300 ease-in-out"
              >
                شكوى
              </Link>
            </li>
            <li>
              <Link
                to="/policy"
                className="block rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-400 hover:text-white duration-300 ease-in-out"
              >
                سياسة الخصوصية
              </Link>
            </li>
            {authStore.isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/order/history"
                    className="block rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-400 hover:text-white duration-300 ease-in-out"
                  >
                    سجل الطلبات
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-start block rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-400 hover:text-white duration-300 ease-in-out"
                  >
                    تسجيل الخروج
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
