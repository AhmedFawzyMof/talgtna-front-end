import { useParams } from "react-router-dom";

function OrderSuccess() {
  const { order } = useParams<{ order: string }>();
  document.title = `Talgtna | رقم الطلب ${order}`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-[90vh] grid place-items-center">
      <article className="rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
        <div className="flex items-center sm:gap-8">
          <div
            className="hidden sm:grid sm:size-20 sm:shrink-0 sm:place-content-center sm:rounded-full sm:border-2 sm:border-primary"
            aria-hidden="true"
          >
            <i className="text-primary">تم</i>
          </div>

          <div>
            <h3 className="mt-4 text-lg font-medium sm:text-xl">
              <a className="hover:underline">
                تم إنشاء الطلب بنجاح رقم الطلب هو ( {order} )
              </a>
            </h3>
          </div>
        </div>
      </article>
    </div>
  );
}

export default OrderSuccess;
