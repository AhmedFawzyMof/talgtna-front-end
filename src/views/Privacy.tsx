import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Privacy() {
  return (
    <div className="container mx-auto p-6 rtl text-right">
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">سياسة الخصوصية</CardTitle>
          <p className="text-sm text-gray-500">آخر تحديث: 18 سبتمبر 2025</p>
        </CardHeader>
        <CardContent className="space-y-6 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">
              ١. المعلومات التي نجمعها
            </h2>
            <p>
              عند استخدامك لتطبيقنا، قد نقوم بجمع المعلومات التالية: الاسم، رقم
              الهاتف، عنوان التوصيل، بيانات الدفع (من خلال شركاء الدفع الآمنين)،
              سجل الطلبات.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              ٢. كيفية استخدام المعلومات
            </h2>
            <ul className="list-disc pr-6 space-y-1">
              <li>معالجة وتوصيل طلبات الطعام المجمد الخاصة بك.</li>
              <li>التواصل معك بشأن الطلبات والعروض والتحديثات.</li>
              <li>تحسين أداء التطبيق وتجربة المستخدم.</li>
              <li>ضمان أمان المعاملات ومنع الاحتيال.</li>
              <li>الامتثال للمتطلبات القانونية والتنظيمية.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">٣. مشاركة المعلومات</h2>
            <p>
              لا نقوم ببيع أو تأجير بياناتك الشخصية. قد تتم مشاركة بياناتك فقط
              مع شركاء التوصيل، مزودي الدفع الآمن، مقدمي خدمات استضافة ودعم
              العملاء، أو السلطات القانونية إذا لزم الأمر.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">٤. أمان البيانات</h2>
            <p>
              نتخذ إجراءات أمنية مناسبة لحماية بياناتك بما في ذلك التشفير،
              بوابات الدفع الآمنة، وتقييد الوصول إلى المعلومات الشخصية.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">٥. حقوقك</h2>
            <ul className="list-disc pr-6 space-y-1">
              <li>الوصول إلى بياناتك الشخصية أو تعديلها.</li>
              <li>
                طلب حذف حسابك وبياناتك (ما لم يتطلب القانون الاحتفاظ ببعض
                السجلات).
              </li>
              <li>إلغاء الاشتراك من الرسائل التسويقية في أي وقت.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              ٦. ملفات تعريف الارتباط
            </h2>
            <p>
              قد نستخدم ملفات تعريف الارتباط لتحسين تجربتك داخل التطبيق وتقديم
              توصيات مخصصة. يمكنك التحكم في الإعدادات من جهازك.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">٧. خصوصية الأطفال</h2>
            <p>
              تطبيقنا غير موجه للأطفال دون سن ١٣ عامًا، ولا نقوم بجمع بياناتهم
              عمدًا.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              ٨. التغييرات على هذه السياسة
            </h2>
            <p>
              قد نقوم بتحديث سياسة الخصوصية من وقت لآخر، وسيتم نشر أي تحديث داخل
              التطبيق مع تاريخ السريان الجديد.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

export default Privacy;
