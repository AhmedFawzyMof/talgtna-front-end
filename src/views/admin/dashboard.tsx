import { getDashboard } from "@/actions/dashboard";
import Loading from "@/components/admin/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Overview } from "@/components/admin/overview";
import { RecentOrders } from "@/components/admin/recent-orders";
import { TopProducts } from "@/components/admin/top-products";
import { DollarSign, ShoppingCart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/admin/header";

const differenceInPercent = (a: number, b: number) => {
  if (a !== 0 && b !== 0) {
    return Math.abs(((b - a) / a) * 100).toFixed(1);
  }

  return 0;
};

export default function Dashboard() {
  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(authStore.token),
    staleTime: Infinity,
  });

  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      authStore.logout();
      navigate("/admin");
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Header title="لوحة المعلومات" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الإيرادات
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.data.order.totalRevenue.total_revenue} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              +
              {differenceInPercent(
                data?.data.order.totalRevenue.total_revenue,
                data?.data.order.totalRevenue.total_revenue_lastmonth
              )}
              % من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{data?.data.order.numberOfOrders.total_orders}
            </div>
            <p className="text-xs text-muted-foreground">
              +
              {differenceInPercent(
                data?.data.order.numberOfOrders.total_orders,
                data?.data.order.numberOfOrders.total_orders_lastmonth
              )}
              % من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              + {data?.data.activeCustomers.total_user}
            </div>
            <p className="text-xs text-muted-foreground">
              +
              {differenceInPercent(
                data?.data.activeCustomers.total_user,
                data?.data.activeCustomers.total_users_lastmonth
              )}
              % من الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>نظرة عامة</CardTitle>
            <CardDescription>
              أداء المبيعات خلال الأشهر الـ 12 الماضية
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview chartData={data?.data.overview} />
          </CardContent>
        </Card>
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>أفضل المنتجات</CardTitle>
            <CardDescription>أفضل المنتجات مبيعا هذا الشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <TopProducts topProducts={data?.data.top_products} />
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>الطلبات الأخيرة</CardTitle>
            <CardDescription>أحدث طلبات العملاء</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrders recentOrders={data?.data.latestOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
