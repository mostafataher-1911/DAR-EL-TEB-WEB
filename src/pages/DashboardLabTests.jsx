import React, { useState, useEffect } from "react";
import Navbar from "../layout/Navbar";
import CustomInputicon from "../component/CustomInputicon";
import CustomButton from "../component/CustomButton";
import Loading from "../component/Loading";
import CustomSelect from "../component/CustomSelect";
import { Toaster, toast } from "react-hot-toast";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  TagIcon,
  BeakerIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function DashboardLabTests() {
  const [filterType, setFilterType] = useState("");
  const [tests, setTests] = useState([]);
  const [types, setTypes] = useState([]);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [editTest, setEditTest] = useState(null);
  const [editType, setEditType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // States for loading buttons
  const [savingTest, setSavingTest] = useState(false);
  const [deletingTestId, setDeletingTestId] = useState(null);
  const [savingType, setSavingType] = useState(false);
  const [deletingTypeId, setDeletingTypeId] = useState(null);
  const [editingTypeId, setEditingTypeId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    type: "",
    coins: "",
    unionCoins: "",
    firstUnionCoins: "",
    lastUnionCoins: "",
    image: "",
    categoryId: "",
  });

  const [newType, setNewType] = useState("");
  const [newTypeOrder, setNewTypeOrder] = useState("");

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const catRes = await fetch("https://apilab-dev.runasp.net/api/Category/GetAll");
      const catData = await catRes.json();
      if (catData.success) {
        // ترتيب الأنواع حسب orderRank
        const sortedTypes = catData.resource.sort((a, b) => a.orderRank - b.orderRank);
        setTypes(sortedTypes);
      }

      const labRes = await fetch("https://apilab-dev.runasp.net/api/MedicalLabs/GetAll");
      const labData = await labRes.json();
      if (labData.success) setTests(labData.resource);
    } catch (err) {
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  // دالة للتحقق من أن رقم الترتيب غير مكرر
  const isOrderRankUnique = (orderRank, excludeId = null) => {
    return !types.some(type => 
      type.orderRank === Number(orderRank) && 
      type.id !== excludeId
    );
  };

  // دالة لإيجاد أقرب رقم ترتيب متاح
  const getNextAvailableOrderRank = () => {
    if (types.length === 0) return 1;
    
    const maxOrderRank = Math.max(...types.map(t => t.orderRank));
    return maxOrderRank + 1;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result.split(",")[1] });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm({ ...form, image: "" });
  };

  const openTestModal = (test = null) => {
    if (test) {
      setEditTest(test);
      setForm({
        name: test.name,
        price: test.price,
        coins: test.coins || "",
        unionCoins: test.unionCoins || "",
        firstUnionCoins: test.firstUnionCoins || "",
        lastUnionCoins: test.lastUnionCoins || "",
        type: types.find((t) => t.id === test.categoryId)?.name || "",
        categoryId: test.categoryId,
        image: "",
      });
    } else {
      setEditTest(null);
      setForm({ 
        name: "", 
        price: "", 
        coins: "", 
        unionCoins: "", 
        firstUnionCoins: "",
        lastUnionCoins: "",
        type: "", 
        image: "", 
        categoryId: "" 
      });
    }
    setShowTestModal(true);
  };

  const openTypeModal = () => {
    setNewType("");
    // اقتراح رقم ترتيب تالي تلقائيًا
    setNewTypeOrder(getNextAvailableOrderRank().toString());
    setEditType(null);
    setShowTypeModal(true);
  };

  const openEditTypeModal = (type) => {
    setEditType(type);
    setEditingTypeId(type.id);
    setNewType(type.name);
    setNewTypeOrder(type.orderRank.toString());
  };

  const saveTest = async () => {
    if (!form.name || !form.price || !form.type) {
      toast.error("من فضلك ادخل اسم التحليل والسعر والنوع");
      return;
    }

    const selectedType = types.find((t) => t.name === form.type);
    if (!selectedType) {
      toast.error("النوع غير موجود");
      return;
    }

    const payload = {
      name: form.name,
      price: Number(form.price),
      coins: Number(form.coins) || 0,
      unionCoins: Number(form.unionCoins) || 0,
      firstUnionCoins: Number(form.firstUnionCoins) || 0,
      lastUnionCoins: Number(form.lastUnionCoins) || 0,
      categoryId: selectedType.id,
      orderRank: 0,
      ...(form.image ? { imageBase64: form.image } : {}),
    };

    try {
      setSavingTest(true);
      
      const url = editTest
        ? "https://apilab-dev.runasp.net/api/MedicalLabs/Update"
        : "https://apilab-dev.runasp.net/api/MedicalLabs/Add";

      const method = editTest ? "PUT" : "POST";

      const bodyData = editTest ? { ...payload, id: editTest.id } : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editTest ? "تم تعديل التحليل بنجاح" : "تمت إضافة التحليل بنجاح");
        fetchData();
        setShowTestModal(false);
      } else {
        toast.error(data.message || "حدث خطأ أثناء الحفظ");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setSavingTest(false);
    }
  };

  const deleteTest = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التحليل؟")) return;

    try {
      setDeletingTestId(id);
      
      const res = await fetch(
        `https://apilab-dev.runasp.net/api/MedicalLabs/Delete?id=${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("تم حذف التحليل بنجاح");
        setTests((prev) => prev.filter((t) => t.id !== id));
      } else {
        toast.error(data.message || "تعذر حذف التحليل");
      }
    } catch {
      toast.error("فشل الاتصال بالخادم");
    } finally {
      setDeletingTestId(null);
    }
  };

  const addType = async () => {
    if (!newType.trim()) {
      toast.error("من فضلك أدخل اسم النوع");
      return;
    }

    if (!newTypeOrder || isNaN(Number(newTypeOrder))) {
      toast.error("من فضلك أدخل رقم ترتيب صحيح");
      return;
    }

    // التحقق من أن الاسم غير مكرر
    const nameExists = types.some(type => 
      type.name.toLowerCase() === newType.trim().toLowerCase()
    );
    
    if (nameExists) {
      toast.error(`النوع "${newType}" موجود بالفعل`);
      return;
    }

    // التحقق من أن رقم الترتيب غير مكرر
    if (!isOrderRankUnique(newTypeOrder)) {
      toast.error(`رقم الترتيب ${newTypeOrder} مستخدم بالفعل. اختر رقمًا آخر`);
      return;
    }

    try {
      setSavingType(true);
      
      const res = await fetch("https://apilab-dev.runasp.net/api/Category/Add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newType.trim(), 
          colorHexa: "#005FA1",
          orderRank: Number(newTypeOrder) 
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("تمت إضافة النوع بنجاح");
        fetchData(); // إعادة تحميل البيانات للحصول على الترتيب الصحيح
        setNewType("");
        setNewTypeOrder(getNextAvailableOrderRank().toString()); // تحديث للرقم التالي
      } else {
        toast.error(data.message || "حدث خطأ أثناء الإضافة");
      }
    } catch {
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setSavingType(false);
    }
  };

  const updateType = async () => {
    if (!newType.trim()) {
      toast.error("من فضلك أدخل اسم النوع");
      return;
    }

    if (!newTypeOrder || isNaN(Number(newTypeOrder))) {
      toast.error("من فضلك أدخل رقم ترتيب صحيح");
      return;
    }

    // التحقق من أن الاسم غير مكرر (باستثناء النوع الحالي)
    const nameExists = types.some(type => 
      type.name.toLowerCase() === newType.trim().toLowerCase() &&
      type.id !== editType.id
    );
    
    if (nameExists) {
      toast.error(`النوع "${newType}" موجود بالفعل`);
      return;
    }

    // التحقق من أن رقم الترتيب غير مكرر (باستثناء النوع الحالي)
    if (!isOrderRankUnique(newTypeOrder, editType.id)) {
      toast.error(`رقم الترتيب ${newTypeOrder} مستخدم بالفعل. اختر رقمًا آخر`);
      return;
    }

    try {
      setSavingType(true);
      
      const res = await fetch("https://apilab-dev.runasp.net/api/Category/Update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: editType.id,
          name: newType.trim(), 
          colorHexa: editType.colorHexa || "#005FA1",
          orderRank: Number(newTypeOrder) 
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("تم تعديل النوع بنجاح");
        fetchData(); // إعادة تحميل البيانات للحصول على الترتيب الصحيح
        setNewType("");
        setNewTypeOrder("");
        setEditType(null);
        setEditingTypeId(null);
      } else {
        toast.error(data.message || "حدث خطأ أثناء التعديل");
      }
    } catch {
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setSavingType(false);
    }
  };

  const deleteType = async (type) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا النوع؟")) return;

    try {
      setDeletingTypeId(type.id);
      
      const res = await fetch(
        `https://apilab-dev.runasp.net/api/Category/Delete?id=${type.id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("تم حذف النوع بنجاح");
        fetchData(); // إعادة تحميل البيانات بعد الحذف
      } else {
        toast.error(data.message || "تعذر حذف النوع");
      }
    } catch {
      toast.error("فشل الاتصال بالخادم");
    } finally {
      setDeletingTypeId(null);
    }
  };

  const cancelEditType = () => {
    setEditType(null);
    setEditingTypeId(null);
    setNewType("");
    setNewTypeOrder(getNextAvailableOrderRank().toString());
  };

  const filteredTests = tests.filter((t) => {
    const matchesType = filterType ? String(t.categoryId) === String(filterType) : true;
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedTests = filteredTests.slice(startIndex, startIndex + itemsPerPage);

  // Component for loading spinner
  const LoadingSpinner = ({ size = "small" }) => (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent 
      ${size === "small" ? "w-4 h-4" : "w-5 h-5"}`} />
  );

  // اقتراح أرقام الترتيب المتاحة
  const suggestAvailableOrderRanks = () => {
    const usedRanks = types.map(t => t.orderRank);
    const maxRank = usedRanks.length > 0 ? Math.max(...usedRanks) : 0;
    
    const suggestions = [];
    for (let i = 1; i <= maxRank + 3; i++) {
      if (!usedRanks.includes(i)) {
        suggestions.push(i);
      }
      if (suggestions.length >= 5) break;
    }
    
    return suggestions;
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="p-4 sm:p-6 min-h-screen">
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* شريط التحكم - تصميم متجاوب */}
            <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
              {/* الأزرار */}
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <button
                  className="flex justify-center items-center gap-2 w-full sm:w-auto p-2 bg-[#005FA1] text-white rounded-lg shadow-md hover:bg-[#00457a] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => openTestModal()}
                  disabled={savingTest}
                >
                  {savingTest ? (
                    <>
                      <LoadingSpinner />
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      <PlusCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      إضافة تحليل جديد
                    </>
                  )}
                </button>

                <button
                  className="flex justify-center items-center gap-2 w-full sm:w-auto p-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-800 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={openTypeModal}
                  disabled={savingType}
                >
                  {savingType ? (
                    <>
                      <LoadingSpinner />
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      <TagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      إدارة أنواع التحاليل
                    </>
                  )}
                </button>
              </div>

              {/* البحث والفلتر */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:flex-1 lg:justify-end">
                <input
                  type="text"
                  placeholder="ابحث باسم التحليل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 border-[#005FA1] rounded-lg py-2 px-3 w-full sm:w-64 text-right text-[#005FA1] outline-none focus:ring-0 focus:outline-none"
                />

                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setPage(1);
                  }}
                  className="text-[#005FA1] border-2 border-[#005FA1] rounded-lg py-2 px-3 w-full sm:w-64 outline-none focus:outline-none"
                >
                  <option value="">جميع انواع التحاليل</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (الترتيب: {t.orderRank})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* الجدول */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="table table-zebra w-full text-center">
                <thead className="bg-[#005FA1] text-white">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">الصورة</th>
                    <th className="p-3">اسم التحليل</th>
                    <th className="p-3">النوع</th>
                    <th className="p-3">السعر</th>
                    <th className="p-3">كوينز</th>
                    <th className="p-3">كوينز النقابات</th>
                    <th className="p-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTests.length > 0 ? (
                    paginatedTests.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-3">{startIndex + index + 1}</td>
                        <td className="p-3">
                          {item.imageUrl ? (
                            <img
                              src={`https://apilab-dev.runasp.net${item.imageUrl}`}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-full mx-auto"
                            />
                          ) : (
                            <span className="text-gray-400">لا توجد صورة</span>
                          )}
                        </td>
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">
                          {types.find((t) => t.id === item.categoryId)?.name || "-"}
                        </td>
                        <td className="p-3">{item.price} ج.م</td>
                        <td className="p-3">{item.coins || 0}</td>
                        <td className="p-3">{item.unionCoins || 0}</td>
                        <td className="p-3">
                          <div className="flex justify-center gap-3">
                            <button
                              className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => openTestModal(item)}
                              disabled={savingTest || deletingTestId}
                              title="تعديل"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => deleteTest(item.id)}
                              disabled={deletingTestId === item.id || savingTest}
                              title="حذف"
                            >
                              {deletingTestId === item.id ? (
                                <LoadingSpinner size="small" />
                              ) : (
                                <TrashIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-4 text-center text-gray-500">
                        لا توجد تحاليل مضافة بعد
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredTests.length > 0 && (
              <>
                <div className="flex justify-center mt-6">
                  <div className="join">
                    <button
                      className="join-item btn bg-[#005FA1] text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={page === 1 || savingTest}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      الصفحة السابقة
                    </button>
                    <button
                      className="join-item btn bg-[#005FA1] text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={page === totalPages || savingTest}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      الصفحة التالية
                    </button>
                  </div>
                </div>

                <p className="text-center mt-2 text-gray-600">
                  صفحة {page} من {totalPages}
                </p>
              </>
            )}
          </>
        )}
      </div>

      {/* مودال التحليل */}
      {showTestModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-[#005FA1] mb-4 text-right">
              {editTest ? "تعديل التحليل" : "إضافة تحليل جديد"}
            </h1>

            <div className="space-y-4">
              <CustomInputicon
                icon={<BeakerIcon className="w-5 h-5" />}
                placeholder="اسم التحليل"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={savingTest}
              />

              <div className="mb-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-gray-200 rounded-lg py-2 pr-14 pl-3 outline-none text-right disabled:opacity-50"
                    disabled={savingTest}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                    ج.م
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={form.coins}
                    onChange={(e) => setForm({ ...form, coins: e.target.value })}
                    className="w-full bg-gray-200 rounded-lg py-2 pr-14 pl-3 outline-none text-left disabled:opacity-50"
                    disabled={savingTest}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                    coins
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={form.unionCoins}
                    onChange={(e) => setForm({ ...form, unionCoins: e.target.value })}
                    className="w-full bg-gray-200 rounded-lg py-2 pr-14 pl-3 outline-none text-left disabled:opacity-50"
                    disabled={savingTest}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                    النقابات
                  </span>
                </div>
              </div>

              {/* اختيار النوع */}
              <CustomSelect
                icon={<BeakerIcon className="w-5 h-5 text-[#005FA1]" />}
                value={form.type}
                onChange={(val) => {
                  const selected = types.find((t) => t.name === val);
                  setForm({
                    ...form,
                    type: val,
                    categoryId: selected ? selected.id : "",
                  });
                }}
                defaultValue="اختر النوع"
                options={types.map((t) => `${t.name} (الترتيب: ${t.orderRank})`)}
                disabled={savingTest}
              />

              {/* رفع صورة */}
              <div className="mb-4">
                <p className="text-[#005FA1] text-right">اختار صوره التحليل</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full mb-2 disabled:opacity-50"
                  disabled={savingTest}
                />

                {(form.image || (editTest && editTest.imageUrl)) && (
                  <div className="relative w-32 h-32 mx-auto">
                    <img
                      src={form.image ? `data:image/*;base64,${form.image}` : `https://apilab-dev.runasp.net${editTest.imageUrl}`}
                      alt="preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-800 disabled:opacity-50"
                      disabled={savingTest}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setShowTestModal(false)}
                disabled={savingTest}
              >
                إلغاء
              </button>
              <button
                className="px-4 py-2 bg-[#005FA1] text-white rounded-lg hover:bg-[#00457a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
                onClick={saveTest}
                disabled={savingTest}
              >
                {savingTest ? (
                  <>
                    <LoadingSpinner />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال الأنواع - محسن */}
      {showTypeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-green-700 mb-4 text-right">
              {editType ? "تعديل النوع" : "إدارة أنواع التحاليل"}
            </h1>

            {/* إضافة/تعديل نوع جديد */}
            <div className="space-y-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="اسم النوع"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="flex-1 bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 outline-none text-right focus:border-[#005FA1] disabled:opacity-50"
                  disabled={savingType}
                />
                <input
                  type="number"
                  placeholder="رقم الترتيب"
                  value={newTypeOrder}
                  onChange={(e) => setNewTypeOrder(e.target.value)}
                  className="w-full sm:w-32 bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 outline-none text-right focus:border-[#005FA1] disabled:opacity-50"
                  disabled={savingType}
                  min="1"
                />
                <div className="flex gap-2">
                  {editType ? (
                    <>
                      <button
                        className="flex-1 text-white bg-green-600 px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        onClick={updateType}
                        disabled={savingType}
                      >
                        {savingType ? (
                          <>
                            <LoadingSpinner size="small" />
                            جاري التعديل...
                          </>
                        ) : (
                          'تعديل النوع'
                        )}
                      </button>
                      <button
                        className="flex-1 text-white bg-gray-500 px-3 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={cancelEditType}
                        disabled={savingType}
                      >
                        إلغاء
                      </button>
                    </>
                  ) : (
                    <button
                      className="w-full text-white bg-[#005FA1] px-3 py-2 rounded-lg hover:bg-[#00457a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      onClick={addType}
                      disabled={savingType}
                    >
                      {savingType ? (
                        <>
                          <LoadingSpinner size="small" />
                          جاري الإضافة...
                        </>
                      ) : (
                        'إضافة النوع'
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              {/* رسائل التوجيه والتحذير */}
              {newTypeOrder && !isOrderRankUnique(newTypeOrder, editType?.id) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm text-right">
                    ⚠️ رقم الترتيب {newTypeOrder} مستخدم بالفعل.
                    <span className="block mt-1 text-red-500">
                      الأرقام المتاحة: {suggestAvailableOrderRanks().join(', ')}
                    </span>
                  </p>
                </div>
              )}
              
              {newType && types.some(t => 
                t.name.toLowerCase() === newType.trim().toLowerCase() && 
                t.id !== editType?.id
              ) && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-600 text-sm text-right">
                    ⚠️ اسم النوع "{newType}" موجود بالفعل
                  </p>
                </div>
              )}
              
              {/* عرض أرقام الترتيب المتاحة */}
              {!editType && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-600 text-sm text-right">
                    💡 اقتراحات لأرقام ترتيب متاحة: {suggestAvailableOrderRanks().join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* قائمة الأنواع */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-right">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 font-semibold text-gray-700">الترتيب</th>
                    <th className="p-3 font-semibold text-gray-700">اسم النوع</th>
                    <th className="p-3 font-semibold text-gray-700">عدد التحاليل</th>
                    <th className="p-3 font-semibold text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {types.map((t) => (
                    <tr key={t.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-bold">
                          {t.orderRank}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{t.name}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {tests.filter(test => test.categoryId === t.id).length}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-2 hover:bg-blue-50 rounded"
                            onClick={() => openEditTypeModal(t)}
                            disabled={savingType || deletingTypeId || editingTypeId === t.id}
                            title="تعديل"
                          >
                            {editingTypeId === t.id ? (
                              <LoadingSpinner size="small" />
                            ) : (
                              <PencilSquareIcon className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-2 hover:bg-red-50 rounded"
                            onClick={() => deleteType(t)}
                            disabled={deletingTypeId === t.id || savingType}
                            title="حذف"
                          >
                            {deletingTypeId === t.id ? (
                              <LoadingSpinner size="small" />
                            ) : (
                              <TrashIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ملاحظات */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm text-right">
                📝 <span className="font-medium">ملاحظات:</span> 
                <span className="block mt-1">
                  • كل نوع يجب أن يكون له رقم ترتيب فريد
                </span>
                <span className="block">
                  • يمكنك استخدام الأرقام المتاحة الموضحة أعلاه
                </span>
                <span className="block">
                  • الترتيب يتحكم في عرض الأنواع في القوائم
                </span>
              </p>
            </div>

            {/* الأزرار */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setShowTypeModal(false)}
                disabled={savingType}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardLabTests;