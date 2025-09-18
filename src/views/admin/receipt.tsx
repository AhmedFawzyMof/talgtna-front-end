import Loading from "@/components/admin/loading";
import { getReceipt } from "@/actions/receipt";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router";
import Header from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { useEffect, useRef, useState } from "react";
import "@/print.css";

const METHODS = {
  cash_on_delivery: "نقدى",
  fawaterk: "بطاقة إئتمان",
} as const;

export default function Receipt() {
  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();
  const id = useParams<{ id: string }>().id;
  const receiptRef = useRef(null);
  const [delivery, setDelivery] = useState(0);
  const [address, setAddress] = useState("");

  const { data, error, isLoading } = useQuery({
    queryKey: ["receipt"],
    queryFn: () => getReceipt(authStore.token, id!),
    staleTime: Infinity,
  });

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: "Receipt",
  });

  useEffect(() => {
    const city = data?.data.cities.find(
      (city: any) => city.city === data?.data.receipt.city
    );

    setAddress(
      `${data?.data.receipt.city} ${data?.data.receipt.street} ${data?.data.receipt.building} ${data?.data.receipt.floor}`
    );
    setDelivery(city?.value);
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Header title="إيصال" />
      <div className="flex flex-col w-full items-start gap-5 md:flex-row md:gap-2 space-x-2">
        <Button onClick={() => handlePrint()}>طباعة</Button>
      </div>
      <div className="w-full grid place-items-center">
        <div dir="rtl" className="printable-area" ref={receiptRef}>
          <div>
            <div className="logo">
              <img
                src="/talgtna/img/print_logo.webp"
                alt="Talagtna logo"
                className="h-40 w-40 mx-auto"
              />
            </div>
            <div className="divider"></div>
            <div className="header-info">
              <p>{data?.data.receipt.created_at}</p>
              <p>
                {METHODS[data?.data.receipt.method as keyof typeof METHODS]}
              </p>
            </div>
            <div className="divider"></div>
          </div>
          <div>
            <div className="user-details">
              <p>رقم الطلب: {data?.data.receipt.id.slice(0, 8)}</p>
              <p>اسم المستخدم: {data?.data.receipt.user}</p>
              <p>الهاتف: {data?.data.receipt.phone}</p>
              <p>العنوان: {address}</p>
              {data?.data.receipt.paymob_paid ? (
                <p>مدفوع: {data?.data.receipt.paymob_paid ? "نعم" : "لا"}</p>
              ) : null}
            </div>
            <div className="divider"></div>
            <dl className="product-table">
              <dt>المنتج</dt>
              <dt>السعر</dt>
              <dt>الكمية</dt>
              <dt>المجموع</dt>
              {data?.data.receipt.products.map((item: any, index: number) => (
                <div className="product-row" key={index}>
                  <dd>{item.name}</dd>
                  <dd> {!item.with_coins ? item.price_at_order : 0}</dd>
                  <dd>{item.quantity}</dd>
                  <dd>
                    {!item.with_coins ? item.price_at_order * item.quantity : 0}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="divider"></div>
            <div className="total">
              {JSON.parse(data?.data.receipt.discount).code !== "" && (
                <p>
                  خصم:{" "}
                  {data?.data.receipt.total *
                    JSON.parse(data?.data.receipt.discount).value}
                  -
                </p>
              )}
              <p>تكلفة التوصيل: {delivery}</p>
              <p>
                المجموع:{" "}
                {data?.data.receipt.total +
                  delivery -
                  data?.data.receipt.total *
                    JSON.parse(data?.data.receipt.discount).value}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
