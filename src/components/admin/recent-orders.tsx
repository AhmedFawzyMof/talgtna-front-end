import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

interface RecentOrders {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: boolean;
}

export function RecentOrders({
  recentOrders,
}: {
  recentOrders?: RecentOrders[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">معرف الطلب</TableHead>
          <TableHead className="text-center">العميل</TableHead>
          <TableHead className="text-center">تاريخ</TableHead>
          <TableHead className="text-center">إجمالي</TableHead>
          <TableHead className="text-center">الحالة</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentOrders!.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium text-center">
              {order.id.slice(0, 8)}
            </TableCell>
            <TableCell className="text-center">{order.customer}</TableCell>
            <TableCell className="text-center">{order.date}</TableCell>
            <TableCell className="text-center">{order.amount}</TableCell>
            <TableCell className="text-center">
              <Badge variant={order.status ? "default" : "secondary"}>
                {order.status ? "تم التوصيل" : "يتم تجهيزه"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
