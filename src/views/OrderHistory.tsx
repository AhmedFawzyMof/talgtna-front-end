import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { toast } from "sonner";
import { useQuery } from "react-query";
import OrderCard from "../components/OrderCard";
import { BASE_URL } from "../store/config";

interface OrderProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  user: string;
  delivered: number;
  paid: number;
  date: string;
  discount: string;
  city: string;
  method: string;
  products: OrderProduct[];
}

function OrderHistory() {
  const token = useAuthStore((state) => state.token);
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  if (!isAuth) {
    toast.error("يجب عليك تسجيل الدخول");
    navigate("/");
  }

  const { isLoading, error, data } = useQuery("history", () =>
    fetch(`${BASE_URL}/order/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json())
  );

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>An error has occurred: {(error as Error).message}</p>;
  document.title = `EasyCookFrozen | سجل الطلبات`;

  if (data?.orders.length == 0) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <div className="bg-white w-11/12 md:w-5/6 shadow-md rounded px-8 pt-6 pb-8 mb-4 grid place-items-center">
          <i className="bx bxs-package text-primary text-[200px]"></i>
          <p className="text-center text-primary">لا يوجد طلبات</p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-auto grid place-items-center my-7 gap-5">
      {data?.orders.map((order: Order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

export default OrderHistory;
