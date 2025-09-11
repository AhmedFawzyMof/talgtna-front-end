import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";

const METHODS = {
  cash_on_delivery: "نقدى",
  paymob: "Paymob",
} as const;

export function ShowOrder({ orderShow }: any) {
  const [order, setOrders] = useState<any>({});

  const details = [
    {
      label: "رقم الطلب",
      value: order?.id,
    },
    {
      label: "المستخدم",
      value: order?.user,
    },
    {
      label: "حالة التوصيل",
      value: order?.delivered ? "نعم" : "لا",
    },
    {
      label: "يتم تجهيز",
      value: order?.processing ? "نعم" : "لا",
    },
    {
      label: "تم الدفع",
      value: order?.paymob_paid ? "نعم" : "لا",
    },
    {
      label: "الخصم",
      value: order?.discount ? JSON.parse(order.discount).value : null,
    },
    {
      label: "المدينة",
      value: order?.city,
    },
    {
      label: "رقم الهاتف",
      value: order?.phone,
    },
    {
      label: "رقم هاتف اخر",
      value: order?.spare_phone,
    },
    {
      label: "الشارع",
      value: order?.street,
    },
    {
      label: "المبنى",
      value: order?.building,
    },
    {
      label: "الطابق",
      value: order?.floor,
    },
    {
      label: "طريقة الدفع",
      value: order?.method,
    },
    {
      label: "الاجمالي",
      value: order?.total,
    },
    {
      label: "تاريخ الطلب",
      value: new Date(order?.created_at).toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => setOrders(orderShow)} variant="outline">
          عرض تفاصيل الطلب
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>عرض تفاصيل الطلب</DialogTitle>
        </DialogHeader>
        <div className="rounded-md border p-4 max-h-[80vh] overflow-y-auto">
          <dl className="divide-y">
            {details.map((detail, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 py-3 first:pt-0 last:pb-0"
              >
                <dt className="text-sm font-medium text-muted-foreground">
                  {detail.label}
                </dt>
                <dd className="col-span-2 text-sm">
                  {detail.value === null ? (
                    <span className="text-muted-foreground">لا يوجد</span>
                  ) : detail.label === "discount" ? (
                    JSON.stringify(detail.value)
                  ) : detail.label === "طريقة الدفع" ? (
                    METHODS[detail.value as keyof typeof METHODS]
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-4 py-3">
              <dt className="text-sm font-medium text-muted-foreground text-center">
                المنتج
              </dt>
              <dt className="text-sm font-medium text-muted-foreground text-center">
                السعر
              </dt>
              <dt className="text-sm font-medium text-muted-foreground text-center">
                الكمية
              </dt>

              {orderShow?.products.map((op: any, index: number) => (
                <div key={index} className="col-span-3 grid grid-cols-3">
                  <dd
                    key={`name-${index}`}
                    className="text-sm font-medium text-muted-foreground text-center"
                  >
                    {op.name}
                  </dd>
                  <dd
                    key={`price-${index}`}
                    className="text-sm font-medium text-muted-foreground text-center"
                  >
                    {!op.with_coins ? op.price_at_order : 0}
                  </dd>
                  <dd
                    key={`qty-${index}`}
                    className="text-sm font-medium text-muted-foreground text-center"
                  >
                    {op.quantity}
                  </dd>
                </div>
              ))}
            </div>
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}
