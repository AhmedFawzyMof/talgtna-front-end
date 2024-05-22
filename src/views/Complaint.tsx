function Complaint() {
  document.title = "EasyCookFrozen | الشكوي";

  return (
    <div className="my-10 mx-auto rounded-md shadow-md w-[95%] md:w-[80%] h-screen flex flex-col items-center justify-center gap-5 bg-white">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-10">
        سياسة التوصيل والاسترجاع
      </h1>
      <p>
        1. اكتب رسالتك من خلال البرنامج (تواصل معنا) عند وجود اي خطأ في الطلب او
        شكوه
      </p>
      <p>2. احضار اصل فاتورة الشراء</p>
      <p>3. توافر المنتج موضوع الشكوي</p>
      <p>4. ان يكون طلب الاسترجاع خلال 24 ساعه من تاريخ الطلب</p>
      <p>
        5. اني يكون تم حفظ المنتج بالطريقة الصحيحة لأن الشركة تخلي مسؤوليتها عن
        سوء التخزين
      </p>
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-10">
        نشكركم على حسن تعاونكم معنا
      </h1>
    </div>
  );
}

export default Complaint;
