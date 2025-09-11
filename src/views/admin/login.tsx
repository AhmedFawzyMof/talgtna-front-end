import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { useMutation } from "@tanstack/react-query";
import { userLogin } from "@/actions/login";
import { useNavigate } from "react-router-dom";

interface userForm {
  username: string;
  password: string;
}

export default function Login() {
  const [userData, setUserData] = useState<userForm>({} as userForm);
  const [showPassword, setShowPassword] = useState(false);
  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    authStore.isLogedIn();
  }, []);

  useEffect(() => {
    if (authStore.isAuthenticated) {
      navigate("/admin/dashboard/orders");
    }
  }, [authStore.isAuthenticated]);

  const mutation = useMutation({
    mutationFn: () => userLogin(userData.username, userData.password),
    onSuccess: (response: any) => {
      authStore.login(response.data.token);
      toast.success("Login Success");
      setTimeout(() => {
        navigate("/admin/dashboard/orders");
      }, 1000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <Card dir="rtl" className="w-[350px]">
        <CardHeader>
          <CardTitle>تسجيل الدخول</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">اسم المستخدم</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Username"
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                  />
                  <a
                    className="cursor-pointer bg-primary px-2 py-1 rounded shadow text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </a>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            disabled={mutation.isPending}
            size={"lg"}
            className="w-full cursor-pointer"
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
