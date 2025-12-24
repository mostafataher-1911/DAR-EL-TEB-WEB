import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

function NotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: ""
  });

  const sendNotification = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("من فضلك ادخل عنوان و محتوى الإشعار");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("https://apilab-dev.runasp.net/WeatherForecast/fcm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          body: form.body
        }),
      });

      if (response.ok) {
        toast.success("تم إرسال الإشعار بنجاح ✅");
        setForm({ title: "", body: "" });
      } else {
        toast.error("حدث خطأ أثناء إرسال الإشعار ❌");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("حدث خطأ في الاتصال بالخادم ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="p-6 min-h-screen flex items-center justify-center bg-base-100 transition-colors duration-300">
        <div className="bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md transition-colors duration-300">
          <h1 className="text-2xl font-bold text-[#005FA1] mb-6 text-center">
            إرسال إشعار
          </h1>
          
          <div className="space-y-4">
            {/* عنوان الإشعار */}
            <div>
              <label className="block text-right text-base-content mb-2">عنوان الإشعار</label>
              <input
                type="text"
                placeholder="اكتب عنوان الإشعار"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-base-300 rounded-lg py-3 px-4 outline-none text-right border-2 border-transparent focus:border-primary focus:bg-base-100 transition-colors duration-200"
              />
            </div>

            {/* محتوى الإشعار */}
            <div>
              <label className="block text-right text-base-content mb-2">محتوى الإشعار</label>
              <textarea
                placeholder="اكتب محتوى الإشعار هنا..."
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows="4"
                className="w-full bg-base-300 rounded-lg py-3 px-4 outline-none text-right resize-none border-2 border-transparent focus:border-primary focus:bg-base-100 transition-colors duration-200"
              />
            </div>

            {/* زر الإرسال */}
            <button
              onClick={sendNotification}
              disabled={loading || !form.title.trim() || !form.body.trim()}
              className={`w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                loading || !form.title.trim() || !form.body.trim()
                  ? 'bg-gray-400 cursor-not-allowed text-base-100'
                  : 'bg-primary hover:bg-primary-focus text-base-100 hover:shadow-md'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-base-100 border-t-transparent rounded-full animate-spin"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5" />
                  إرسال الإشعار
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationsPage;