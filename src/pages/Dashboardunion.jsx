import React, { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "../layout/Navbar";
import CustomInputicon from "../component/CustomInputicon";
import CustomButton from "../component/CustomButton";
import Loading from "../component/Loading";
import toast from "react-hot-toast";
import {
  BuildingLibraryIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function Dashboardunion() {
  const [unions, setUnions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUnion, setEditUnion] = useState(null);
  const [form, setForm] = useState({ name: "", discount: "", image: "", imageBase64: "" });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_BASE = "https://apilab-dev.runasp.net/api/Union";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
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
      console.log("API Response:", data); // للتdebug
      
      if (data && Array.isArray(data)) {
        setUnions(data);
      } else if (data.success && data.resource) {
        setUnions(data.resource);
      } else {
        toast.error("فشل في جلب البيانات");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  }, []);

  const convertToBase64 = useCallback(
    (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }),
    []
  );

  const handleImageChange = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (file) {
        // تحقق من حجم الصورة
        if (file.size > 2 * 1024 * 1024) { // 2MB
          toast.error("حجم الصورة يجب أن يكون أقل من 2MB");
          return;
        }

        try {
          const base64 = await convertToBase64(file);
          const imageURL = URL.createObjectURL(file);
          setForm((prev) => ({ ...prev, image: imageURL, imageBase64: base64 }));
          toast.success("تم رفع الصورة بنجاح ✅");
        } catch (error) {
          toast.error("فشل في تحميل الصورة");
        }
      }
    },
    [convertToBase64]
  );

  const removeImage = useCallback(() => {
    if (form.image.startsWith('blob:')) {
      URL.revokeObjectURL(form.image);
    }
    setForm((prev) => ({ ...prev, image: "", imageBase64: "" }));
    toast("تم حذف الصورة 🚫", { icon: "🗑️" });
  }, [form.image]);

  const openModal = useCallback((union = null) => {
    if (union) {
      setEditUnion(union);
      setForm({
        name: union.name || "",
        discount: union.disCount || "",
        image: union.imageUrl ? `https://apilab-dev.runasp.net${union.imageUrl}` : "",
        imageBase64: "",
      });
    } else {
      setEditUnion(null);
      setForm({ name: "", discount: "", image: "", imageBase64: "" });
    }
    setShowModal(true);
  }, []);

  const addUnion = useCallback(async () => {
    if (!form.name.trim()) return toast.error("من فضلك أدخل اسم النقابة");
    if (!form.discount || Number(form.discount) < 0) return toast.error("من فضلك أدخل نسبة خصم صحيحة");
    if (!form.imageBase64) return toast.error("من فضلك اختر صورة للنقابة 📸");

    const nameExists = unions.some(
      (u) => u.name.trim().toLowerCase() === form.name.trim().toLowerCase()
    );
    if (nameExists) {
      toast.error(`❌ النقابة "${form.name}" موجودة بالفعل`);
      return;
    }

    const payload = {
      name: form.name.trim(),
      imageBase64: form.imageBase64,
      disCount: Number(form.discount),
      orderRank: 0,
    };

    try {
      setProcessing(true);
      const res = await fetch(`${API_BASE}/Add`, {
        method: "POST",
        headers: { 
          "accept": "*/*",
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload),
      });

      console.log("Add Response Status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Add Error:", errorText);
        throw new Error(`فشل في الإضافة: ${res.status}`);
      }

      const data = await res.json();
      console.log("Add Success:", data);

      toast.success("✅ تمت الإضافة بنجاح");
      setShowModal(false);
      setForm({ name: "", discount: "", image: "", imageBase64: "" });
      fetchData();
    } catch (error) {
      console.error("Add Union Error:", error);
      toast.error(error.message || "تعذر الاتصال بالسيرفر");
    } finally {
      setProcessing(false);
    }
  }, [form, unions, fetchData]);

  const updateUnion = useCallback(async () => {
    if (!form.name.trim()) return toast.error("من فضلك أدخل اسم النقابة");
    if (!form.discount || Number(form.discount) < 0) return toast.error("من فضلك أدخل نسبة خصم صحيحة");

    setProcessing(true);

    try {
      const payload = {
        id: editUnion.id,
        name: form.name.trim(),
        disCount: Number(form.discount),
        orderRank: 0,
      };

      // إذا المستخدم رفع صورة جديدة
      if (form.imageBase64) {
        payload.imageBase64 = form.imageBase64;
      }

      console.log("Update Payload:", payload);

      const res = await fetch(`${API_BASE}/Update`, {
        method: "PUT",
        headers: { 
          "accept": "*/*",
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload),
      });

      console.log("Update Response Status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Update Error:", errorText);
        throw new Error(`فشل في التعديل: ${res.status}`);
      }

      const data = await res.json();
      console.log("Update Success:", data);

      toast.success("✅ تم تعديل النقابة بنجاح");
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Update Union Error:", error);
      toast.error(error.message || "تعذر الاتصال بالسيرفر");
    } finally {
      setProcessing(false);
    }
  }, [form, editUnion, fetchData]);

  const deleteUnion = useCallback(
    async (id) => {
      if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
      try {
        const res = await fetch(`${API_BASE}/Delete?id=${id}`, { 
          method: "DELETE",
          headers: {
            "accept": "*/*"
          }
        });
        
        if (!res.ok) {
          throw new Error(`فشل في الحذف: ${res.status}`);
        }

        const data = await res.json();
        if (data.success || res.ok) {
          toast.success("🗑️ تم حذف النقابة بنجاح");
          setUnions((prev) => prev.filter((u) => u.id !== id));
        } else {
          toast.error(data.message || "حدث خطأ أثناء الحذف");
        }
      } catch (error) {
        console.error("Delete Error:", error);
        toast.error(error.message || "تعذر الاتصال بالسيرفر");
      }
    },
    []
  );

  const paginatedUnions = useMemo(
    () => unions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [unions, currentPage]
  );

  const totalPages = Math.ceil(unions.length / itemsPerPage);

  // دالة لعرض الصور مع fallback
  const ImageWithFallback = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
      setHasError(true);
    };

    if (hasError || !src) {
      return (
        <div className={`${className} bg-gray-200 flex items-center justify-center rounded-full`}>
          <BuildingLibraryIcon className="w-6 h-6 text-gray-400" />
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

  return (
    <>
      <div className="p-6 h-screen">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex justify-end items-center mb-6">
              <button
                className="flex justify-center items-center gap-2 w-70 p-2 bg-[#005FA1] text-white rounded-lg shadow-md hover:bg-[#00457a] transition-colors"
                onClick={() => openModal()}
                disabled={processing}
              >
                <PlusCircleIcon className="w-6 h-6" />
                إضافة نقابة جديدة
              </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="table table-zebra w-full text-center">
                <thead className="bg-[#005FA1] text-white">
                  <tr>
                    <th className="py-3">#</th>
                    <th className="py-3">الصورة</th>
                    <th className="py-3">اسم النقابة</th>
                    <th className="py-3">نسبة الخصم</th>
                    <th className="py-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUnions.length > 0 ? (
                    paginatedUnions.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="py-3">
                          <ImageWithFallback
                            src={item.imageUrl ? `https://apilab-dev.runasp.net${item.imageUrl}` : ""}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-full mx-auto"
                          />
                        </td>
                        <td className="py-3 font-medium">{item.name}</td>
                        <td className="py-3 text-green-600 font-semibold">{item.disCount}%</td>
                        <td className="py-3">
                          <div className="flex justify-center gap-3">
                            <button
                              className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded"
                              onClick={() => openModal(item)}
                              disabled={processing}
                              title="تعديل"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
                              onClick={() => deleteUnion(item.id)}
                              disabled={processing}
                              title="حذف"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">
                        لا توجد نقابات مضافة بعد
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 items-center gap-4">
                <button
                  className="px-4 py-2 bg-[#005FA1] text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#00457a] transition-colors"
                  disabled={currentPage === 1 || processing}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  الصفحة السابقة
                </button>
                <span className="text-gray-600">
                  صفحة {currentPage} من {totalPages}
                </span>
                <button
                  className="px-4 py-2 bg-[#005FA1] text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#00457a] transition-colors"
                  disabled={currentPage === totalPages || totalPages === 0 || processing}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  الصفحة التالية
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
            <h1 className="text-2xl font-bold text-[#005FA1] mb-4 text-right">
              {editUnion ? "تعديل النقابة" : "إضافة نقابة جديدة"}
            </h1>

            <div className="mb-4">
              <CustomInputicon
                icon={<BuildingLibraryIcon className="w-5 h-5 text-[#005FA1]" />}
                placeholder="اسم النقابة"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <p className="text-[#005FA1] text-right pb-2">نسبة الخصم:</p>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 pr-12 pl-3 outline-none focus:border-[#005FA1] text-right"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                  %
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[#005FA1] text-right mb-2">اختر صورة النقابة:</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="w-full p-2 border border-gray-300 rounded-lg"
                disabled={processing}
              />
              {form.image && (
                <div className="relative mt-3 w-fit mx-auto">
                  <img
                    src={form.image}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-full border-2 border-[#005FA1]"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                    disabled={processing}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                onClick={() => setShowModal(false)}
                disabled={processing}
              >
                إلغاء
              </button>

              {editUnion ? (
                <button
                  onClick={updateUnion}
                  className="px-4 py-2 bg-[#005FA1] text-white rounded-lg hover:bg-[#00457a] transition-colors disabled:opacity-50"
                  disabled={processing}
                >
                  {processing ? "جارٍ الحفظ..." : "حفظ التعديل"}
                </button>
              ) : (
                <button
                  onClick={addUnion}
                  className="px-4 py-2 bg-[#005FA1] text-white rounded-lg hover:bg-[#00457a] transition-colors disabled:opacity-50"
                  disabled={processing}
                >
                  {processing ? "جارٍ الحفظ..." : "حفظ"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboardunion;