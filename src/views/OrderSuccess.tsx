import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { BASE_URL } from "../config/config";
import { useAuthStore } from "../store/AuthStore";

function OrderSuccess() {
  const { order } = useParams<{ order: string }>();
  const url = new URL(window.location.href);
  const id = url.searchParams.get("id");
  const success = url.searchParams.get("success");
  const authStore = useAuthStore((state) => state);
  document.title = `Talagtna | رقم الطلب ${order}`;
  const navigate = useNavigate();
  const { isLoading, error, data } = useQuery(
    `order-success-${order}`,
    () =>
      fetch(`${BASE_URL}/order/success`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({ id, success }),
        credentials: "include",
      }).then((res) => res.json()),
    {
      refetchOnWindowFocus: false,
      enabled: !!id && success === "true",
    }
  );

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>An error has occurred: {(error as Error).message}</p>;

  if (data?.success) {
    navigate(`/ordersuccess/${id}`, { replace: true });
    toast.success(data?.message);
  } else {
    toast.error(data?.message);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-[90vh] grid place-items-center">
      <article className="rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
        <div className="flex items-center sm:gap-8">
          <div
            className="hidden sm:grid sm:size-20 sm:shrink-0 sm:place-content-center sm:rounded-full sm:border-2 sm:border-primary"
            aria-hidden="true"
          >
            {success === "false" ? (
              <i className="text-red-500">!</i>
            ) : (
              <i className="text-primary">تم</i>
            )}
          </div>

          <div>
            <h3 className="mt-4 text-lg font-medium sm:text-xl">
              <a className="hover:underline">
                {success === "false"
                  ? "حدث خطأ ما أثناء إنشاء الطلب"
                  : `تم إنشاء الطلب بنجاح رقم الطلب هو ( ${id ? id : order} )`}
              </a>
            </h3>
          </div>
        </div>
      </article>
    </div>
  );
}

export default OrderSuccess;
