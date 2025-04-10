import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import About from "./views/About";
import Category from "./views/Category";
import Cart from "./views/Cart";
import Complaint from "./views/Complaint";
import ContactUs from "./views/ContactUs";
import Favorites from "./views/Favorites";
import Home from "./views/Home";
import Order from "./views/Order";
import OrderHistory from "./views/OrderHistory";
import OrderSuccess from "./views/OrderSuccess";
import ProductView from "./views/Product";
import Company from "./views/Company";
import Coupons from "./views/Coupons";

import Navbar from "./components/Navbar";

import { useAuthStore } from "./store/AuthStore";
import { useCartStore } from "./store/CartStore";

import { Toaster } from "sonner";
import Search from "./views/Search";

const queryClient = new QueryClient();

function Layout() {
  return (
    <>
      <Navbar />
      <div className=" max-w-screen-2xl mx-auto xl:px-8">
        <Outlet />
      </div>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
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
        path: "search",
        element: <Search />,
      },
    ],
  },
]);

function App() {
  const setCart = useCartStore((state) => state.setCart);
  const isAuth = useAuthStore((state) => state.isLogedIn);
  setCart();
  isAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-right" expand={false} richColors />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
