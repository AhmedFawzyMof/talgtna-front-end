import About from "@/views/About";
import Category from "@/views/Category";
import Cart from "@/views/Cart";
import Complaint from "@/views/Complaint";
import ContactUs from "@/views/ContactUs";
import Favorites from "@/views/Favorites";
import Home from "@/views/Home";
import Order from "@/views/Order";
import OrderHistory from "@/views/OrderHistory";
import OrderSuccess from "@/views/OrderSuccess";
import ProductView from "@/views/Product";
import Company from "@/views/Company";
import Coupons from "@/views/Coupons";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/AuthStore";
import { useCartStore } from "@/store/CartStore";
import Search from "@/views/Search";
import CartToast from "@/components/CartToast";
import CoinStore from "@/views/CoinStore";
import Download from "@/views/Download";
import TermsAndConditions from "@/views/Terms";
import WorkingHour from "@/components/WorkingHour";
import { Outlet } from "react-router-dom";
import Faq from "@/views/Faq";
import Sidebar from "@/components/admin/sidebar";
import Login from "@/views/admin/login";
import Dashboard from "@/views/admin/dashboard";
import Products from "@/views/admin/products";
import Orders from "@/views/admin/orders";
import Customers from "@/views/admin/users";
import Companies from "@/views/admin/companies";
import Categories from "@/views/admin/categories";
import Contact from "@/views/admin/contacts";
import Offers from "@/views/admin/offers";
import Receipt from "@/views/admin/receipt";
import Admins from "@/views/admin/admins";
import Delivery from "@/views/admin/delivery";

function Layout() {
  const authStore = useAuthStore((state) => state);
  const cartStore = useCartStore((state) => state);
  const totalQuantity = cartStore.getTotalQuantity();

  authStore.initlize();

  return (
    <>
      <Navbar />
      <WorkingHour />
      <div className="max-w-screen-2xl mx-auto xl:px-8">
        {totalQuantity > 0 ? <CartToast /> : null}
        <Outlet />
      </div>
    </>
  );
}

function AdminLayout() {
  return (
    <div dir="rtl" className="flex min-h-screen flex-col">
      <div className="flex">
        <Sidebar />
        <div className="flex w-full flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export const routes = [
  {
    path: "/admin",
    element: <Login />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "companies",
        element: <Companies />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "magazine",
        element: <Offers />,
      },
      {
        path: "receipt/:id",
        element: <Receipt />,
      },
      {
        path: "admins",
        element: <Admins />,
      },
      {
        path: "delivery",
        element: <Delivery />,
      },
      {
        path: "*",
        element: <div>404</div>,
      },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "faq",
        element: <Faq />,
      },
      {
        path: "company/:name",
        element: <Company />,
      },
      {
        path: "category/:name",
        element: <Category />,
      },
      {
        path: "contact",
        element: <ContactUs />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "complaint",
        element: <Complaint />,
      },
      {
        path: "products/:id",
        element: <ProductView />,
      },
      {
        path: "order",
        element: <Order />,
      },
      {
        path: "ordersuccess/:order",
        element: <OrderSuccess />,
      },
      {
        path: "order/history",
        element: <OrderHistory />,
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
      {
        path: "coupons",
        element: <Coupons />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "coin_store",
        element: <CoinStore />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "/download",
        element: <Download />,
      },
      {
        path: "/terms",
        element: <TermsAndConditions />,
      },
    ],
  },
];
