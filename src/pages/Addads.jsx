import { useState, useEffect } from "react";
import {
  PhotoIcon,
  XMarkIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import CustomButton from "../component/CustomButton";
import Navbar from "../layout/Navbar";
import Loading from "../component/Loading";
import toast, { Toaster } from "react-hot-toast";

function Addads() {
  const [ads, setAds] = useState([]);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

const API_BASE =
  import.meta.env.MODE === "development"
    ? "/api/Responser"
    : "https://apilab.runasp.net/api/Responser";


  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));

      // 🟢 التحويل بعد لحظة صغيرة لتفادي تهنيج الـ UI
      setTimeout(async () => {
        const base64 = await convertToBase64(file);
        setImageBase64(base64);
      }, 100);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageBase64("");
  };

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/GetAll`);
      const data = await res.json();
      if (data.success) {
        setAds(data.resource || []);
      } else {
        toast.error("فشل في جلب الإعلانات");
      }
    } catch {
      toast.error("خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleAddAd = async () => {
    if (!imageBase64) {
      toast.error("من فضلك اختر صورة للإعلان");
      return;
    }

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE}/Add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });
      const data = await res.json();

     if (data.success) {
  toast.success("تم رفع الإعلان بنجاح");
  handleRemoveImage();
  setShowModal(false);
  fetchAds(); // ✅ جلب الإعلانات من السيرفر بعد الإضافة


        // ✅ تحديث محلي بدون إعادة تحميل الكل
       const newAd = { id: data.resource?.id, imageUrl: data.resource?.imageUrl || "" };
setAds((prev) => [newAd, ...prev]);

      } else {
        toast.error("حدث خطأ أثناء رفع الإعلان");
      }
    } catch {
      toast.error("فشل الاتصال بالسيرفر");
    } finally {
      setUploading(false);
    }
  };

 const handleDeleteAd = async (id) => {
  if (!window.confirm("هل تريد حذف هذا الإعلان؟")) return;

  try {
    const res = await fetch(`${API_BASE}/Delete?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.success) {
      toast.success("تم حذف الإعلان بنجاح ✅");
      setAds((prev) => prev.filter((ad) => ad.id !== id)); // حذف محلي
    } else {
      toast.error(data.message || "فشل في حذف الإعلان ❌");
    }
  } catch {
    toast.error("تعذر الاتصال بالسيرفر");
  }
};


  // ✅ Pagination logic
  const totalPages = Math.ceil(ads.length / itemsPerPage);
  const currentAds = ads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#005FA1]">إدارة الإعلانات</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#005FA1] text-white px-4 py-2 rounded-lg hover:bg-[#004577] transition"
            >
              <PlusCircleIcon className="w-5 h-5" />
              إضافة إعلان جديد
            </button>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full border border-gray-200 text-center">
                <thead className="bg-[#005FA1] text-white">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">صورة الإعلان</th>
                    <th className="px-4 py-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAds.length > 0 ? (
                    currentAds.map((ad, index) => (
                      <tr
                        key={index}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <img
                            src={`https://apilab.runasp.net${ad.imageUrl}`}
                            alt="ad"
                            className="w-32 h-24 object-cover rounded-md mx-auto"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteAd(ad.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-1 mx-auto"
                          >
                            <TrashIcon className="w-5 h-5" />
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-gray-500 py-6 text-lg text-center"
                      >
                        لا توجد إعلانات حالياً
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {ads.length > 0 && (
              <>
                <div className="flex justify-center mt-6">
                  <div className="join">
                    <button
                      className="join-item btn bg-[#005FA1] text-white"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      الصفحة السابقة
                    </button>
                    <button
                      className="join-item btn bg-[#005FA1] text-white"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      الصفحة التالية
                    </button>
                  </div>
                </div>

                <p className="text-center mt-2 text-gray-600">
                  صفحة {currentPage} من {totalPages}
                </p>
              </>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
            <h1 className="text-2xl font-bold text-[#005FA1] mb-4 text-right">
              إضافة إعلان جديد
            </h1>

            <div className="flex flex-col items-center mb-4">
              {!image ? (
                <label className="flex items-center justify-center w-24 h-24 bg-[#005FA1] text-white rounded-full shadow cursor-pointer hover:bg-[#004577] transition">
                  <PhotoIcon className="w-10 h-10" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="relative w-32 h-32">
                  <img
                    src={image}
                    alt="preview"
                    className="w-full h-full object-cover rounded-xl shadow-md"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-3 py-2 bg-gray-300 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                إلغاء
              </button>
              <CustomButton
                text={uploading ? "جارٍ الرفع..." : "إضافة"}
                onClick={handleAddAd}
                disabled={uploading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Addads;
