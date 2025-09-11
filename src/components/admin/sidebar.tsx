import { cn } from "@/lib/utils";

import {
  Package,
  ShoppingCart,
  Users,
  Home,
  LayoutDashboard,
  Menu,
  Building,
  Contact,
  GalleryHorizontal,
  LayoutList,
  Shield,
  Bike,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import api from "@/api";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useCounterStore } from "@/store/counters";
import { useQueryClient } from "@tanstack/react-query";

const items = [
  {
    title: "لوحة المعلومات",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    badge: false,
  },
  {
    title: "المنتجات",
    href: "/admin/dashboard/products",
    icon: ShoppingCart,
    badge: false,
  },
  {
    title: "الطلبات",
    href: "/admin/dashboard/orders",
    icon: Package,
    badge: true,
  },
  {
    title: "العملاء",
    href: "/admin/dashboard/customers",
    icon: Users,
    badge: false,
  },
  {
    title: "الشركات",
    href: "/admin/dashboard/companies",
    icon: Building,
    badge: false,
  },
  {
    title: "الاقسام",
    href: "/admin/dashboard/categories",
    icon: LayoutList,
    badge: false,
  },
  {
    title: "طلبات التواصل",
    href: "/admin/dashboard/contact",
    icon: Contact,
    badge: true,
  },
  {
    title: "مجلة العرض",
    href: "/admin/dashboard/magazine",
    icon: GalleryHorizontal,
    badge: false,
  },
  {
    title: "المشرفين",
    href: "/admin/dashboard/admins",
    icon: Shield,
    badge: false,
  },
  {
    title: "التوصيل والمدن",
    href: "/admin/dashboard/delivery",
    icon: Bike,
    badge: false,
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();
  const counterStore = useCounterStore((state) => state);
  const timeInterval = 5 * 60 * 1000;
  const queryClient = useQueryClient();

  authStore.initlize();
  const getCounters = async () => {
    const response = api.get(`/admin/counters`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    return response;
  };

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const fetchCounters = async () => {
    const response = await getCounters();
    if (!response?.data?.counters) return;

    const newData = response.data.counters;
    const newOrdersCount = newData.orders_count;

    if (newOrdersCount > 0) {
      new Notification("طلب جديد", {
        body: "لديك طلب جديد",
        icon: "/talgtna/img/logo.png",
        tag: "new-order",
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }

    counterStore.setCounters(newData);
    counterStore.setRefeatch(false);
  };
  useEffect(() => {
    fetchCounters();

    const interval = setInterval(fetchCounters, timeInterval);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (counterStore.reFeatch) {
      fetchCounters();
    }
  }, [counterStore.reFeatch]);

  const handleLogout = () => {
    authStore.logout();
    navigate("/admin");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="h-6 w-6 lg:mt-10 mt-8 mr-2 text-primary cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72 px-4">
        <SheetHeader>
          <SheetTitle>
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 px-2 py-4 mb-6"
            >
              <Home className="h-6 w-6" />
              <span className="font-bold text-xl">تالجنا</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav dir="rtl" className="grid items-start px-4 py-4">
          <div className="grid gap-1">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                  pathname === item.href
                    ? "bg-secondary font-medium text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
                {item.badge && (
                  <Badge>
                    {item.title === "الطلبات"
                      ? counterStore.orders_count
                      : counterStore.contact_count}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </nav>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleLogout}>
              تسجيل الخروج
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
