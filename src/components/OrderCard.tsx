interface OrderProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  method: string;
  discount: string;
  delivered: number;
  paid: number;
  total: number;
  products: OrderProduct[];
}

function OrderCard({ order }: { order: Order }) {
  const discount = JSON.parse(order.discount);

  return (
    <div className=" w-11/12 md:w-4/5 flow-root shadow-lg bg-white rounded-lg border border-gray-100 py-3 mx-5 sm:mx-14">
      <dl className="-my-3 divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">رقم الطلب</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {order.id.substring(0, 8)}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">تاريخ الطلب</dt>
          <dd dir="ltr" className="text-gray-700 text-end sm:col-span-2">
            {order.created_at}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">طريقة الدفع</dt>
          <dd className="text-gray-700 sm:col-span-2 capitalize">
            {order.method === "creditcard_on_delivery" ? "Credit Card" : "Cash"}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">منتجات الطلب</dt>
          <dd className="text-gray-700 sm:col-span-2">
            <table className="w-full">
              <thead>
                <tr className="grid grid-cols-4">
                  <th>منتج</th>
                  <th>سعر</th>
                  <th>كمية</th>
                  <th>المجموع</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.products.map((product: OrderProduct) => (
                  <tr
                    key={product.id}
                    className="grid grid-cols-4 place-items-center"
                  >
                    <td className="text-center sm:hidden">
                      {product.name.length <= 20
                        ? product.name
                        : product.name.substring(0, 18) + "..."}
                    </td>
                    <td className="text-center hidden sm:block">
                      {product.name}
                    </td>
                    <td className="text-center">{product.price}</td>
                    <td className="text-center">{product.quantity}</td>
                    <td className="text-center">
                      {product.quantity * product.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">إجمالي الطلب</dt>
          {discount.code !== "" ? (
            <dd className="text-gray-700 sm:col-span-2">
              {order.total - discount.value} ج.م
            </dd>
          ) : (
            <dd className="text-gray-700 sm:col-span-2">{order.total} ج.م</dd>
          )}
        </div>
        {discount.code !== "" ? (
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-bold  text-primary">قسيمة</dt>
            <dd className="text-gray-700 sm:col-span-2">{discount.code}</dd>
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">الطلب مدفوع</dt>
          <dd className="text-gray-700 sm:col-span-2 capitalize">
            {order.paid == 1 ? "نعم" : "لا"}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold  text-primary">تم تسليم الطلب</dt>
          <dd className="text-gray-700 sm:col-span-2 capitalize">
            {order.delivered == 1 ? "نعم" : "لا"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default OrderCard;
