import { useState, useEffect } from "react";
import {
  PhotoIcon,
  XMarkIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
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

  const API_BASE = "https://apilab-dev.runasp.net/api/Responser";

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // تحقق من نوع وحجم الملف
    if (!file.type.startsWith('image/')) {
      toast.error("الملف يجب أن يكون صورة");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error("حجم الصورة يجب أن يكون أقل من 5MB");
      return;
    }

    try {
      setImage(URL.createObjectURL(file));
      const base64 = await convertToBase64(file);
      setImageBase64(base64);
      toast.success("تم تحميل الصورة بنجاح ✅");
    } catch (error) {
      toast.error("فشل في تحميل الصورة");
      console.error("Image conversion error:", error);
    }
  };

  const handleRemoveImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }
    setImage(null);
    setImageBase64("");
  };

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/GetAll`, {
        method: "GET",
        headers: {
          "accept": "*/*"
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Ads API Response:", data);

      // معالجة مختلف أشكال الرد
      if (Array.isArray(data)) {
        setAds(data);
      } else if (data && data.success && Array.isArray(data.resource)) {
        setAds(data.resource);
      } else if (data && Array.isArray(data.resource)) {
        setAds(data.resource);
      } else {
        setAds([]);
        toast.error("لا توجد إعلانات أو شكل البيانات غير متوقع");
      }
    } catch (error) {
      console.error("Fetch ads error:", error);
      toast.error("خطأ في الاتصال بالسيرفر");
      setAds([]);
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
      // تنظيف الـ base64 إذا كان يحتوي على prefix
      let cleanBase64 = imageBase64;
      if (imageBase64.includes(',')) {
        cleanBase64 = imageBase64.split(',')[1];
      }

      const payload = {
        imageBase64: cleanBase64
      };

      console.log("Sending payload:", { 
        imageBase64Length: cleanBase64.length,
        first50Chars: cleanBase64.substring(0, 50)
      });

      const res = await fetch(`${API_BASE}/Add`, {
        method: "POST",
        headers: { 
          "accept": "*/*",
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload),
      });

      console.log("Add response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Add error response:", errorText);
        throw new Error(`فشل في الإضافة: ${res.status}`);
      }

      const data = await res.json();
      console.log("Add success response:", data);

      if (data.success) {
        toast.success("تم رفع الإعلان بنجاح ✅");
        handleRemoveImage();
        setShowModal(false);
        fetchAds();
      } else {
        toast.error(data.message || "حدث خطأ أثناء رفع الإعلان");
      }
    } catch (error) {
      console.error("Add ad error:", error);
      toast.error(error.message || "فشل الاتصال بالسيرفر");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAd = async (id) => {
    if (!window.confirm("هل تريد حذف هذا الإعلان؟")) return;

    try {
      const res = await fetch(`${API_BASE}/Delete?id=${id}`, {
        method: "DELETE",
        headers: {
          "accept": "*/*"
        }
      });

      console.log("Delete response status:", res.status);

      if (!res.ok) {
        throw new Error(`فشل في الحذف: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.success) {
        toast.success("تم حذف الإعلان بنجاح ✅");
        setAds((prev) => prev.filter((ad) => ad.id !== id));
      } else {
        toast.error(data.message || "فشل في حذف الإعلان ❌");
      }
    } catch (error) {
      console.error("Delete ad error:", error);
      toast.error(error.message || "تعذر الاتصال بالسيرفر");
    }
  };

  // دالة لعرض الصور مع fallback
  const ImageWithFallback = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
      setHasError(true);
    };

    if (hasError || !src) {
      return (
        <div className={`${className} bg-base-300 flex items-center justify-center rounded-md`}>
          <PhotoIcon className="w-8 h-8 text-base-content opacity-50" />
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleError}
      />
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(ads.length / itemsPerPage);
  const currentAds = ads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-base-100 transition-colors duration-300">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#005FA1]">
            إدارة الإعلانات
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#005FA1] text-white px-4 py-2 rounded-lg hover:bg-[#004577] transition-colors duration-200 disabled:opacity-50 shadow-md"
              disabled={uploading}
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
            <div className="overflow-x-auto bg-base-200 rounded-lg shadow-md transition-colors duration-300">
              <table className="min-w-full border border-base-300 text-center">
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
                        key={ad.id || index}
                        className="border-t border-base-300 hover:bg-base-300 transition-colors duration-200"
                      >
                        <td className="px-4 py-3 text-base-content">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <ImageWithFallback
                            src={ad.imageUrl ? `https://apilab-dev.runasp.net${ad.imageUrl}` : ""}
                            alt="ad"
                            className="w-32 h-24 object-cover rounded-md mx-auto"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteAd(ad.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-1 mx-auto disabled:opacity-50 shadow-sm"
                            disabled={uploading}
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
                        className="text-base-content opacity-70 py-6 text-lg text-center"
                      >
                        لا توجد إعلانات حالياً
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {ads.length > 0 && totalPages > 1 && (
              <>
                <div className="flex justify-center mt-6">
                  <div className="join">
                    <button
                      className="join-item btn bg-[#005FA1] text-white hover:bg-[#004577] disabled:bg-base-400 transition-colors duration-200"
                      disabled={currentPage === 1 || uploading}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      الصفحة السابقة
                    </button>
                    <button
                      className="join-item btn bg-[#005FA1] text-white hover:bg-[#004577] disabled:bg-base-400 transition-colors duration-200"
                      disabled={currentPage === totalPages || uploading}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      الصفحة التالية
                    </button>
                  </div>
                </div>

                <p className="text-center mt-2 text-base-content opacity-70">
                  صفحة {currentPage} من {totalPages}
                </p>
              </>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4 transition-colors duration-300">
          <div className="bg-base-200 rounded-lg shadow-lg p-6 w-[90%] max-w-md relative transition-colors duration-300">
            <h1 className="text-2xl font-bold text-[#005FA1] mb-4 text-right">
              إضافة إعلان جديد
            </h1>

            <div className="flex flex-col items-center mb-4">
              {!image ? (
                <label className="flex flex-col items-center justify-center w-32 h-32 bg-base-300 border-2 border-dashed border-[#005FA1] rounded-lg cursor-pointer hover:bg-base-400 transition-colors duration-200">
                  <PhotoIcon className="w-12 h-12 text-[#005FA1] mb-2" />
                  <span className="text-[#005FA1] text-sm font-medium">
                    اختر صورة
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={image}
                    alt="preview"
                    className="w-48 h-48 object-cover rounded-lg shadow-md border-2 border-base-300"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition-colors duration-200"
                    disabled={uploading}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-base-300 text-base-content rounded-lg hover:bg-base-400 transition-colors duration-200 disabled:opacity-50"
                onClick={() => setShowModal(false)}
                disabled={uploading}
              >
                إلغاء
              </button>
              <button
                onClick={handleAddAd}
                disabled={!imageBase64 || uploading}
                className="px-4 py-2 bg-[#005FA1] text-white rounded-lg hover:bg-[#004577] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-base-100 border-t-transparent rounded-full animate-spin"></div>
                    جارٍ الرفع...
                  </div>
                ) : (
                  "إضافة الإعلان"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Addads;