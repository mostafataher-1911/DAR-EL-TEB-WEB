import React, { useState, useEffect, useCallback, useMemo } from "react";
import Loading from "../component/Loading";
import toast from "react-hot-toast";
import {
  BuildingLibraryIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

function Dashboardunion() {
  const [unions, setUnions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUnion, setEditUnion] = useState(null);
  const [form, setForm] = useState({ 
    name: "", 
    discount: "", 
    image: "", 
    imageBase64: "",
    imageName: "" 
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_BASE = "https://apilab-dev.runasp.net";
  const API_URL = `${API_BASE}/api/Union`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/GetAll`, {
        method: "GET",
        headers: { "accept": "*/*" }
      });
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      console.log("API Response:", data);
      
      let unionsData = [];
      if (Array.isArray(data)) {
        unionsData = data;
      } else if (data && data.resource && Array.isArray(data.resource)) {
        unionsData = data.resource;
      }
      
      const processedUnions = unionsData.map(union => ({
        ...union,
        imageUrl: union.imageUrl 
          ? union.imageUrl.startsWith('http') 
            ? union.imageUrl 
            : `${API_BASE}${union.imageUrl}`
          : ""
      }));
      
      setUnions(processedUnions);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  }, []);

  const convertToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleImageChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("الملف يجب أن يكون صورة (JPG, PNG, GIF, WEBP)");
      return;
    }

    try {
      const previewUrl = URL.createObjectURL(file);
      const base64 = await convertToBase64(file);
      
      setForm(prev => ({ 
        ...prev, 
        image: previewUrl, 
        imageBase64: base64,
        imageName: file.name
      }));
      
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.success(`تم تحميل الصورة بنجاح (${sizeInMB} MB) ✅`);
      
    } catch (error) {
      console.error("Image processing error:", error);
      toast.error("فشل في تحميل الصورة");
    }
  }, [convertToBase64]);

  const removeImage = useCallback(() => {
    if (form.image && form.image.startsWith('blob:')) {
      URL.revokeObjectURL(form.image);
    }
    
    setForm(prev => ({ 
      ...prev, 
      image: "", 
      imageBase64: "",
      imageName: "" 
    }));
    
    toast("تم حذف الصورة 🚫", { icon: "🗑️" });
  }, [form.image]);

  const openModal = useCallback((union = null) => {
    if (union) {
      setEditUnion(union);
      setForm({
        name: union.name || "",
        discount: union.disCount?.toString() || "",
        image: union.imageUrl || "",
        imageBase64: "",
        imageName: ""
      });
    } else {
      setEditUnion(null);
      setForm({ 
        name: "", 
        discount: "", 
        image: "", 
        imageBase64: "",
        imageName: "" 
      });
    }
    setShowModal(true);
  }, []);

  const validateForm = useCallback(() => {
    if (!form.name.trim()) {
      toast.error("من فضلك أدخل اسم النقابة");
      return false;
    }
    
    const discountNum = Number(form.discount);
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
      toast.error("من فضلك أدخل نسبة خصم صحيحة بين 0 و 100");
      return false;
    }
    
    return true;
  }, [form]);

  const prepareImageForUpload = useCallback((base64String) => {
    if (base64String.includes(',')) {
      return base64String.split(',')[1];
    }
    return base64String;
  }, []);

  const handleLargeImageError = useCallback((error, fileSize) => {
    const sizeInMB = (fileSize / (1024 * 1024)).toFixed(2);
    console.error("Image upload error:", error);
    
    if (error.message.includes("413") || error.message.includes("Payload too large")) {
      toast.error(`الصورة كبيرة جداً (${sizeInMB} MB). الحد الأقصى المسموح به على السيرفر هو 10-20MB`);
    } else if (error.message.includes("timeout") || error.message.includes("Network Error")) {
      toast.error("الصورة كبيرة جداً وتحتاج وقت طويل للرفع. جرب صورة أصغر");
    } else {
      toast.error(error.message || "تعذر رفع الصورة");
    }
  }, []);

  const addUnion = useCallback(async () => {
    if (!validateForm()) return;
    
    if (!form.imageBase64) {
      toast.error("من فضلك اختر صورة للنقابة 📸");
      return;
    }

    const nameExists = unions.some(
      u => u.name.trim().toLowerCase() === form.name.trim().toLowerCase()
    );
    
    if (nameExists) {
      toast.error(`❌ النقابة "${form.name}" موجودة بالفعل`);
      return;
    }

    const payload = {
      name: form.name.trim(),
      imageBase64: prepareImageForUpload(form.imageBase64),
      disCount: Number(form.discount),
      orderRank: 0,
    };

    try {
      setProcessing(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600000);
      
      const res = await fetch(`${API_URL}/Add`, {
        method: "POST",
        headers: { 
          "accept": "*/*",
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log("Add Response Status:", res.status);

      if (!res.ok) {
        let errorMessage = `فشل في الإضافة: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("Add Success:", data);

      toast.success("✅ تمت الإضافة بنجاح");
      setShowModal(false);
      setForm({ 
        name: "", 
        discount: "", 
        image: "", 
        imageBase64: "",
        imageName: "" 
      });
      
      fetchData();
      
    } catch (error) {
      console.error("Add Union Error:", error);
      handleLargeImageError(error, payload.length);
    } finally {
      setProcessing(false);
    }
  }, [form, unions, fetchData, validateForm, prepareImageForUpload, handleLargeImageError]);

  const updateUnion = useCallback(async () => {
    if (!editUnion || !validateForm()) return;

    try {
      setProcessing(true);
      
      const payload = {
        id: editUnion.id,
        name: form.name.trim(),
        disCount: Number(form.discount),
        orderRank: editUnion.orderRank || 0,
      };

      if (form.imageBase64) {
        payload.imageBase64 = prepareImageForUpload(form.imageBase64);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600000);
      
      const res = await fetch(`${API_URL}/Update`, {
        method: "PUT",
        headers: { 
          "accept": "*/*",
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log("Update Response Status:", res.status);

      if (!res.ok) {
        let errorMessage = `فشل في التعديل: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("Update Success:", data);

      toast.success("✅ تم تعديل النقابة بنجاح");
      setShowModal(false);
      
      setUnions(prev => prev.map(u => 
        u.id === editUnion.id 
          ? { 
              ...u, 
              name: form.name.trim(),
              disCount: Number(form.discount),
              imageUrl: form.imageBase64 
                ? `${API_BASE}/uploads/${data.imageUrl || u.imageUrl}`
                : u.imageUrl
            } 
          : u
      ));
      
    } catch (error) {
      console.error("Update Union Error:", error);
      handleLargeImageError(error, JSON.stringify(payload).length);
    } finally {
      setProcessing(false);
    }
  }, [form, editUnion, validateForm, prepareImageForUpload, handleLargeImageError]);

  const deleteUnion = useCallback(async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه النقابة؟")) return;
    
    try {
      setProcessing(true);
      const res = await fetch(`${API_URL}/Delete?id=${id}`, { 
        method: "DELETE",
        headers: { "accept": "*/*" }
      });
      
      if (!res.ok) {
        throw new Error(`فشل في الحذف: ${res.status}`);
      }

      const responseText = await res.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {}

      if (data.success || res.ok) {
        toast.success("🗑️ تم حذف النقابة بنجاح");
        setUnions(prev => prev.filter(u => u.id !== id));
      } else {
        toast.error(data.message || "حدث خطأ أثناء الحذف");
      }
      
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error.message || "تعذر الاتصال بالسيرفر");
    } finally {
      setProcessing(false);
    }
  }, []);

  const paginatedUnions = useMemo(
    () => unions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [unions, currentPage]
  );

  const totalPages = Math.ceil(unions.length / itemsPerPage);

  const ImageWithFallback = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      setImgSrc(src);
      setHasError(false);
    }, [src]);

    const handleError = () => {
      setHasError(true);
    };

    if (hasError || !src) {
      return (
        <div className={`${className} bg-gray-100 flex items-center justify-center rounded-full`}>
          <BuildingLibraryIcon className="w-6 h-6 text-gray-400" />
        </div>
      );
    }

    return (
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} object-cover`}
        onError={handleError}
        loading="lazy"
      />
    );
  };

  return (
    <>
      <div className="p-6 min-h-screen">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#005FA1]">إدارة النقابات</h1>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#005FA1] text-white rounded-lg shadow-md hover:bg-[#00457a] transition-colors disabled:opacity-50"
                onClick={() => openModal()}
                disabled={processing}
              >
                <PlusCircleIcon className="w-5 h-5" />
                إضافة نقابة جديدة
              </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#005FA1]">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">الصورة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">اسم النقابة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">نسبة الخصم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUnions.length > 0 ? (
                    paginatedUnions.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <ImageWithFallback
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-12 h-12 rounded-full border border-gray-200"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold text-center">
                          {item.disCount}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex justify-center gap-2">
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              onClick={() => openModal(item)}
                              disabled={processing}
                              title="تعديل"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
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
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center text-gray-500">
                          <BuildingLibraryIcon className="w-12 h-12 mb-3 text-gray-400" />
                          <p className="text-lg">لا توجد نقابات مضافة بعد</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  className="px-4 py-2 bg-[#005FA1] text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#00457a] transition-colors"
                  disabled={currentPage === 1 || processing}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  السابق
                </button>
                <span className="text-gray-700 font-medium">
                  صفحة {currentPage} من {totalPages}
                </span>
                <button
                  className="px-4 py-2 bg-[#005FA1] text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#00457a] transition-colors"
                  disabled={currentPage === totalPages || processing}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal محسن مع Scroll */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            {/* Modal Header - ثابت */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-[#005FA1]">
                {editUnion ? "تعديل النقابة" : "إضافة نقابة جديدة"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={processing}
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Body - مع Scroll */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* اسم النقابة */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  اسم النقابة *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <BuildingLibraryIcon className="w-5 h-5 text-[#005FA1]" />
                  </div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pr-3 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005FA1] focus:border-transparent outline-none text-right"
                    placeholder="أدخل اسم النقابة"
                    disabled={processing}
                  />
                </div>
              </div>

              {/* نسبة الخصم */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  نسبة الخصم (%) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-full pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005FA1] focus:border-transparent outline-none text-right"
                    placeholder="0"
                    disabled={processing}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
              </div>

              {/* رفع الصورة */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  {editUnion ? "تغيير صورة النقابة (اختياري)" : "صورة النقابة *"}
                  <span className="text-xs text-gray-500 mr-2">(يمكنك رفع أي حجم)</span>
                </label>
                
                {/* معاينة الصورة */}
                {form.image && (
                  <div className="mb-4 relative">
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={form.image}
                        alt="معاينة الصورة"
                        className="w-full h-full object-cover rounded-lg border-2 border-[#005FA1]"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        disabled={processing}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                    {form.imageName && (
                      <div className="text-center mt-2">
                        <p className="text-xs text-gray-500 truncate max-w-xs mx-auto">
                          {form.imageName}
                        </p>
                        {form.imageBase64 && (
                          <p className="text-xs text-blue-600 mt-1">
                            ✓ جاهزة للرفع
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* زر رفع الصورة */}
                <div className="flex justify-center">
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'} ${form.image ? 'border-gray-300' : 'border-[#005FA1]'}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <PhotoIcon className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 font-medium mb-1">
                        {form.image ? 'تغيير الصورة' : 'انقر لرفع صورة'}
                      </p>
                      <p className="text-xs text-gray-400 text-center px-4">
                        يمكنك رفع الصور بأي حجم
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={processing}
                    />
                  </label>
                </div>
                
                {/* نص تحذيري */}
                {form.imageBase64 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 text-center">
                      ⚠️ الصور الكبيرة جداً قد تأخذ وقتاً طويلاً للرفع
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer - ثابت في الأسفل */}
            <div className="p-6 border-t sticky bottom-0 bg-white">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  disabled={processing}
                >
                  إلغاء
                </button>
                
                {editUnion ? (
                  <button
                    onClick={updateUnion}
                    disabled={processing || !form.name.trim()}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جارٍ الحفظ...
                      </>
                    ) : (
                      'حفظ التعديلات'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={addUnion}
                    disabled={processing || !form.name.trim() || !form.imageBase64}
                    className="px-6 py-2 bg-[#005FA1] text-white rounded-lg hover:bg-[#00457a] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جارٍ الإضافة...
                      </>
                    ) : (
                      'إضافة النقابة'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboardunion;