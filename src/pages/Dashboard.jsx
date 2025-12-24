import React, { useEffect, useState } from "react";
import Loading from "../component/Loading";
import {
  BanknotesIcon,
  BuildingLibraryIcon,
  PencilSquareIcon,
  PhoneIcon,
  PlusCircleIcon,
  TrashIcon,
  UserIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterUnion, setFilterUnion] = useState("");
  const [unions, setUnions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    coins: "",
    union: "",
  });

  const [labsData, setLabsData] = useState([]);
  const [showCoinsModal, setShowCoinsModal] = useState(false);
  const [coinsForm, setCoinsForm] = useState({ phone: "", selectedLabs: [] });

  const itemsPerPage = 7;
  const CLIENT_API = "https://apilab-dev.runasp.net/api/Client";
  const UNION_API = "https://apilab-dev.runasp.net/api/Union";

  // تحميل النقابات
  const fetchUnions = async () => {
    try {
      const res = await fetch(`${UNION_API}/GetAll`);
      const result = await res.json();
      if (result.success && result.resource) {
        setUnions(result.resource);
      }
    } catch (err) {
      console.error("Error fetching unions:", err);
    }
  };

  // تحميل العملاء
  const fetchClients = async (unionName = "") => {
    setLoading(true);
    try {
      const res = await fetch(`${CLIENT_API}/GetAll`);
      const result = await res.json();
      if (result.success && result.resource) {
        let clients = result.resource.map((c) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          gender: c.gender || "ذكر",
          coins: c.bonus,
          union: c.address || "غير محدد",
        }));

        // تطبيق الفلتر محلياً بناءً على اسم النقابة
        if (unionName) {
          clients = clients.filter((client) => client.union === unionName);
        }

        setData(clients);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("حدث خطأ أثناء تحميل البيانات ❌");
    }
    setLoading(false);
  };

  // تحميل التحاليل (لل coins)
  useEffect(() => {
    fetch("https://apilab-dev.runasp.net/api/MedicalLabs/GetAll")
      .then((res) => res.json())
      .then((data) => {
        if (data.resource) {
          const labsWithPrice = data.resource.map((lab) => ({
            id: lab.id,
            name: lab.name,
            price: lab.price,
          }));
          setLabsData(labsWithPrice);
        }
      })
      .catch((err) => console.error("Error fetching labs:", err));
  }, []);

  useEffect(() => {
    fetchUnions();
    fetchClients();
  }, []);

  // فلترة البحث
  const filteredData = data.filter((item) =>
    item.phone.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const openModal = (user = null) => {
    console.log("📝 فتح مودال للمستخدم:", user);
    
    if (user) {
      setEditUser(user);
      setForm({
        name: user.name,
        phone: user.phone,
        gender: user.gender,
        coins: user.coins,
        union: user.union,
      });
      console.log("🎯 بيانات النموذج - الجندر:", user.gender);
    } else {
      setEditUser(null);
      setForm({ 
        name: "", 
        phone: "", 
        gender: "ذكر",
        coins: "", 
        union: "" 
      });
    }
    setShowModal(true);
  };

  const saveUser = async () => {
    if (saving) {
      return;
    }

    if (!form.name || !form.phone) {
      toast.error("من فضلك ادخل الاسم ورقم المحمول");
      return;
    }
    
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("رقم المحمول يجب أن يحتوي على 10 أرقام فقط");
      return;
    }

    const phoneExists = data.some(
      (item) =>
        item.phone === form.phone && (!editUser || item.id !== editUser.id)
    );
    
    if (phoneExists) {
      toast.error("هذا الرقم مسجل بالفعل ❌");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name,
      phone: form.phone,
      gender: form.gender || "ذكر",
      address: form.union,
      bonus: Number(form.coins) || 0,
      id: editUser?.id || undefined,
    };

    console.log("📤 إرسال البيانات:", payload);

    try {
      let res;
      if (editUser) {
        res = await fetch(`${CLIENT_API}/Update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${CLIENT_API}/Add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      
      const result = await res.json();
      
      if (result.success) {
        toast.success(editUser ? "تم التعديل بنجاح ✅" : "تمت الإضافة بنجاح ✅");
        fetchClients(filterUnion);
        setShowModal(false);
      } else {
        if (result.message && result.message.includes("مسجل")) {
          toast.error("هذا الرقم مسجل بالفعل ❌");
        } else {
          toast.error(result.message || "حدث خطأ أثناء الحفظ ❌");
        }
      }
    } catch (err) {
      console.error("Error saving user:", err);
      toast.error("حدث خطأ في الاتصال بالسيرفر ❌");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      try {
        const res = await fetch(`${CLIENT_API}/Delete?id=${id}`, {
          method: "DELETE",
        });
        const result = await res.json();
        if (result.success) {
          toast.success("تم الحذف بنجاح ✅");
          fetchClients(filterUnion);
        } else {
          toast.error("تعذر حذف المستخدم ❌");
        }
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error("حدث خطأ في الاتصال بالسيرفر ❌");
      }
    }
  };

  const openCoinsModal = () => {
    setCoinsForm({ phone: "", selectedLabs: [] });
    setShowCoinsModal(true);
  };

  const addCoinsToUser = async () => {
    const user = data.find((u) => u.phone === coinsForm.phone);
    if (!user) {
      toast.error("رقم المحمول غير موجود ❌");
      return;
    }

    let totalCoins = 0;
    coinsForm.selectedLabs.forEach((lab) => {
      const foundLab = labsData.find((l) => l.name === lab.name);
      if (foundLab) {
        totalCoins += (foundLab.price * (lab.discount || 0)) / 100;
      }
    });

    const updatedData = data.map((u) =>
      u.phone === user.phone ? { ...u, coins: u.coins + totalCoins } : u
    );
    setData(updatedData);

    const payload = {
      phone: user.phone,
      coins: user.coins + totalCoins,
    };

    console.log("📤 إرسال بيانات التحديث:", payload);

    try {
      const res = await fetch(`https://apilab-dev.runasp.net/api/Client/UpdateCoins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      console.log("📥 نتيجة التحديث:", result);

      if (result.success || res.status === 200) {
        toast.success(`تم إضافة ${totalCoins} كوينز للمستخدم ✅`);
        setShowCoinsModal(false);
        fetchClients(filterUnion);
      } else {
        toast.error("حدث خطأ أثناء إضافة الكوينز ❌");
      }
    } catch (err) {
      console.error("Error updating coins:", err);
      toast.error("حدث خطأ في الاتصال بالسيرفر ❌");
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="p-4 sm:p-6 min-h-screen bg-base-100 transition-colors duration-300">
        {/* البحث والفلتر والأزرار */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <button
              className="flex justify-center items-center gap-2 w-full sm:w-auto p-2 bg-[#005FA1] text-white rounded-lg shadow-md hover:bg-[#005FA1] focus:bg-[#005FA1] text-sm sm:text-base transition-colors duration-200"
              onClick={() => openModal()}
            >
              <PlusCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              إضافة مستخدم جديد
            </button>

            <button
              className="flex justify-center items-center gap-2 w-full sm:w-auto p-2 bg-warning text-base-100 rounded-lg shadow-md hover:bg-warning-focus text-sm sm:text-base transition-colors duration-200"
              onClick={openCoinsModal}
            >
              <CurrencyDollarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              إضافة كوينز
            </button>
          </div>

          <div className="w-full lg:flex-1 lg:max-w-md">
            <div className="relative">
              <input
                type="number"
                placeholder="... ابحث برقم المحمول"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-base-300 rounded-lg py-2 px-4 outline-none text-right border-2 border-transparent focus:border-[#005FA1] focus:bg-base-100 transition-colors duration-200"
              />
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <select
              className="p-2 border-2 outline-0 border-[#005FA1] text-[#005FA1] bg-base-100 rounded-lg shadow-sm w-full lg:w-48 transition-colors duration-200 focus:border-[#005FA1]-focus"
              value={filterUnion}
              onChange={(e) => {
                const unionName = e.target.value;
                setFilterUnion(unionName);
                setPage(1);
                fetchClients(unionName);
              }}
            >
              <option value="">كل النقابات</option>
              {unions.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* الجدول */}
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="overflow-x-auto bg-base-200 rounded-lg shadow-md transition-colors duration-300">
              <table className="table table-zebra w-full text-center">
                <thead className="bg-[#005FA1] text-white">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">الاسم</th>
                    <th className="p-3">رقم المحمول</th>
                    <th className="p-3">النوع</th>
                    <th className="p-3">عدد الكوينز</th>
                    <th className="p-3">النقابة</th>
                    <th className="p-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-base-300 transition-colors duration-200">
                        <td className="p-3 text-base-content">{startIndex + index + 1}</td>
                        <td className="p-3 text-base-content">{item.name}</td>
                        <td className="p-3 text-base-content">{item.phone}</td>
                        <td className="p-3 text-base-content">{item.gender}</td>
                        <td className="p-3 text-base-content">{item.coins}</td>
                        <td className="p-3 text-base-content">{item.union}</td>
                        <td className="p-3">
                          <div className="flex justify-center gap-3">
                            <button
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                              onClick={() => openModal(item)}
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 transition-colors duration-200"
                              onClick={() => deleteUser(item.id)}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-4 text-center text-base-content opacity-70">
                        لا توجد نتائج مطابقة
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredData.length > 0 && (
              <>
                <div className="flex justify-center mt-6">
                  <div className="join">
                    <button
                      className="join-item btn bg-[#005FA1] text-white hover:bg-[#005FA1] transition-colors duration-200"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      الصفحة السابقة
                    </button>
                    <button
                      className="join-item btn bg-[#005FA1] text-white hover:bg-[#005FA1] transition-colors duration-200"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      الصفحة التالية
                    </button>
                  </div>
                </div>

                <p className="text-center mt-2 text-base-content opacity-70">
                  صفحة {page} من {totalPages}
                </p>
              </>
            )}
          </>
        )}
      </div>

      {/* مودال إضافة مستخدم */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4 transition-colors duration-300">
          <div className="bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md transition-colors duration-300">
            <h1 className="text-2xl font-bold text-[#005FA1] mb-4 text-right">
              {editUser ? "تعديل الحساب" : "إضافة حساب جديد"}
            </h1>

            <div className="space-y-4">
              {/* اسم المستخدم */}
              <div className="w-full">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <UserIcon className="w-5 h-5 text-base-content opacity-70" />
                  </div>
                  <input
                    type="text"
                    placeholder="اسم المستخدم"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-base-100 border border-base-300 rounded-lg py-2 pr-10 pl-10 outline-none text-right focus:ring-2 focus:ring-[#005FA1] focus:border-transparent transition-colors duration-200"
                  />
                </div>
              </div>

              {/* النوع */}
              <div className="w-full">
                <label className="block text-right text-base-content mb-2">النوع</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 font-medium ${
                      form.gender === "ذكر"
                        ? "bg-[#005FA1] text-base-100 border-[#005FA1] shadow-md"
                        : "bg-base-300 text-base-content border-base-300 hover:bg-base-400"
                    }`}
                    onClick={() => setForm({ ...form, gender: "ذكر" })}
                  >
                    ذكر
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 font-medium ${
                      form.gender === "أنثى"
                        ? "bg-secondary text-base-100 border-secondary shadow-md"
                        : "bg-base-300 text-base-content border-base-300 hover:bg-base-400"
                    }`}
                    onClick={() => setForm({ ...form, gender: "أنثى" })}
                  >
                    أنثى
                  </button>
                </div>
                <p className="text-xs text-base-content opacity-70 text-right mt-1">
                  القيمة المحددة: {form.gender || "لم يتم التحديد"}
                </p>
              </div>

              {/* رقم المحمول */}
              <div className="w-full">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <PhoneIcon className="w-5 h-5 text-base-content opacity-70" />
                  </div>
                  <input
                    type="text"
                    placeholder="رقم المحمول"
                    value={form.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) && value.length <= 10) {
                        setForm({ ...form, phone: value });
                      }
                    }}
                    className="w-full bg-base-100 border border-base-300 rounded-lg py-2 pr-10 pl-10 outline-none text-right focus:ring-2 focus:ring-[#005FA1] focus:border-transparent transition-colors duration-200"
                  />
                </div>
              </div>

              {/* عدد الكوينز */}
              <div className="w-full">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <BanknotesIcon className="w-5 h-5 text-base-content opacity-70" />
                  </div>
                  <input
                    type="number"
                    placeholder="عدد الكوينز"
                    value={form.coins}
                    onChange={(e) => setForm({ ...form, coins: e.target.value })}
                    className="w-full bg-base-100 border border-base-300 rounded-lg py-2 pr-10 pl-10 outline-none text-right focus:ring-2 focus:ring-[#005FA1] focus:border-transparent transition-colors duration-200"
                  />
                </div>
              </div>

              {/* اختيار النقابة */}
              <div className="w-full">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <BuildingLibraryIcon className="w-5 h-5 text-[#005FA1]" />
                  </div>
                  <select
                    value={form.union}
                    onChange={(e) => setForm({ ...form, union: e.target.value })}
                    className="w-full bg-base-100 border border-base-300 rounded-lg py-2 pr-10 pl-10 outline-none text-right focus:ring-2 focus:ring-[#005FA1] focus:border-transparent appearance-none transition-colors duration-200"
                  >
                    <option value="">اختر النقابة</option>
                    {unions.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-base-content opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-base-300 text-base-content rounded-lg hover:bg-base-400 transition-colors duration-200"
                onClick={() => setShowModal(false)}
                disabled={saving}
              >
                إلغاء
              </button>
              <button
                onClick={saveUser}
                disabled={saving}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                  saving 
                    ? 'bg-base-400 cursor-not-allowed' 
                    : 'bg-[#005FA1] hover:bg-[#005FA1]/80 text-base-100'
                }`}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-base-100 border-t-transparent rounded-full animate-spin"></div>
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

      {/* مودال إضافة كوينز */}
      {showCoinsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4 transition-colors duration-300">
          <div className="bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto transition-colors duration-300">
            <h1 className="text-2xl font-bold text-[#005FA1] mb-4 text-right">
              إضافة كوينز
            </h1>

            {/* رقم الهاتف */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="رقم المحمول"
                  value={coinsForm.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setCoinsForm({ ...coinsForm, phone: value });
                    }
                  }}
                  maxLength={10}
                  className="w-full bg-base-100 border border-base-300 rounded-lg py-3 px-4 outline-none text-right focus:ring-2 focus:ring-[#005FA1] focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>

            {/* البحث والتحاليل */}
            <div className="p-4 bg-base-300 rounded-lg transition-colors duration-200">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="ابحث عن التحليل..."
                  className="w-full bg-base-100 border border-base-300 rounded-lg py-2 px-4 outline-none text-right focus:ring-2 focus:ring-[#005FA1] focus:border-transparent transition-colors duration-200"
                  onChange={(e) =>
                    setCoinsForm({ ...coinsForm, searchLab: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {labsData
                  .filter((lab) =>
                    lab.name
                      .toLowerCase()
                      .includes((coinsForm.searchLab || "").toLowerCase())
                  )
                  .map((lab) => {
                    const isSelected = coinsForm.selectedLabs.some(
                      (l) => l.name === lab.name
                    );
                    const labDiscount = coinsForm.selectedLabs.find(
                      (l) => l.name === lab.name
                    )?.discount;

                    return (
                      <div
                        key={lab.id}
                        className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
                          isSelected
                            ? "bg-[#005FA1]/20 border-[#005FA1]"
                            : "bg-base-100 hover:bg-base-300 border-base-300"
                        }`}
                      >
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="checkbox bg-base-100 border-base-300 checked:bg-[#005FA1] checked:border-[#005FA1]"
                            style={{
                              outline: "none",
                              boxShadow: "none",
                            }}
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCoinsForm({
                                  ...coinsForm,
                                  selectedLabs: [
                                    ...coinsForm.selectedLabs,
                                    { name: lab.name, discount: 0 },
                                  ],
                                });
                              } else {
                                setCoinsForm({
                                  ...coinsForm,
                                  selectedLabs: coinsForm.selectedLabs.filter(
                                    (l) => l.name !== lab.name
                                  ),
                                });
                              }
                            }}
                          />
                          <span className="font-medium text-base-content">{lab.name}</span>
                        </label>

                        <input
                          type="number"
                          placeholder="%"
                          value={labDiscount || ""}
                          disabled={!isSelected}
                          className="input input-bordered input-sm w-20 border-base-300 focus:outline-none focus:ring-0 bg-base-100 text-base-content disabled:bg-base-200 disabled:text-base-content/50 transition-colors duration-200"
                          onChange={(e) => {
                            const numValue = Number(e.target.value);
                            if (numValue >= 0 && numValue <= 100) {
                              const updated = coinsForm.selectedLabs.map((l) =>
                                l.name === lab.name ? { ...l, discount: numValue } : l
                              );
                              setCoinsForm({ ...coinsForm, selectedLabs: updated });
                            }
                          }}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-base-300 text-base-content rounded-lg hover:bg-base-400 transition-colors duration-200"
                onClick={() => setShowCoinsModal(false)}
              >
                إلغاء
              </button>
              <button
                className="px-4 py-2 bg-[#005FA1] text-base-100 rounded-lg hover:bg-[#005FA1]/80 transition-colors duration-200"
                onClick={addCoinsToUser}
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;