import { Card, CardContent } from "@/components/ui/card";
import { FaFacebook, FaWhatsapp } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full mt-10">
      <Card className="rounded-none shadow-none border-t bg-gray-50">
        <CardContent className="container mx-auto py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p className="text-center md:text-right">
            © {new Date().getFullYear()} جميع الحقوق محفوظة | تطبيق الأطعمة
            المجمدة
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://whatsapp.com/channel/0029VbBcQ4A8V0thDScewZ04"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <FaWhatsapp className="w-5 h-5" />
              واتساب
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=100068666803046"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <FaFacebook className="w-5 h-5" />
              فيسبوك
            </a>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
}
