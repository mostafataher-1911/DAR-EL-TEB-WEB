import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

function QuickLabUpload() {
  const [tests, setTests] = useState([{ 
    name: '', 
    price: '', 
    coins: '', 
    unionCoins: '', 
    categoryId: '' 
  }]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: '1', name: 'تحاليل الدم' },
    { id: '2', name: 'تحاليل البول' },
    { id: '3', name: 'تحاليل الكيمياء' },
    { id: '4', name: 'تحاليل الغدد' }
  ];

  // إضافة تحليل جديد
  const addTest = () => {
    setTests(prev => [...prev, { 
      name: '', 
      price: '', 
      coins: '', 
      unionCoins: '', 
      categoryId: currentCategory || categories[0]?.id 
    }]);
  };

  // تحديث تحليل محدد
  const updateTest = (index, field, value) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, [field]: value } : test
    ));
  };

  // تطبيق النوع الحالي على جميع التحاليل
  const applyCategoryToAll = () => {
    if (!currentCategory) {
      toast.error('اختر نوع أولاً');
      return;
    }
    setTests(prev => prev.map(test => ({ ...test, categoryId: currentCategory })));
    toast.success('تم تطبيق النوع على جميع التحاليل');
  };

  // رفع التحاليل واحداً تلو الآخر
  const uploadTests = async () => {
    const validTests = tests.filter(test => 
      test.name.trim() && test.price && test.categoryId
    );

    if (validTests.length === 0) {
      toast.error('أدخل بيانات التحاليل أولاً');
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < validTests.length; i++) {
      const test = validTests[i];
      
      try {
        const payload = {
          name: test.name,
          price: Number(test.price),
          coins: Number(test.coins) || 0,
          unionCoins: Number(test.unionCoins) || 0,
          categoryId: test.categoryId,
          orderRank: 0
        };

        const response = await fetch('https://apilab.runasp.net/api/MedicalLabs/Add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.success) {
          successCount++;
          toast.success(`تم رفع: ${test.name}`, { duration: 1000 });
        } else {
          errorCount++;
          console.error(`فشل: ${test.name}`, data.message);
        }
      } catch (error) {
        errorCount++;
        console.error(`خطأ: ${test.name}`, error);
      }

      // انتظار بسيط بين الطلبات
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setLoading(false);
    toast.success(`تم الانتهاء! ناجح: ${successCount}, فاشل: ${errorCount}`);
    
    // مسح النموذج بعد الرفع
    if (successCount > 0) {
      setTests([{ name: '', price: '', coins: '', unionCoins: '', categoryId: currentCategory }]);
    }
  };

  // حذف تحليل
  const removeTest = (index) => {
    if (tests.length > 1) {
      setTests(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-center" />
      
      <h1 className="text-2xl font-bold text-[#005FA1] mb-2">رفع سريع للتحاليل</h1>
      <p className="text-gray-600 mb-6">أدخل جميع التحاليل مرة واحدة ثم ارفعها تلقائياً</p>

      {/* تحكم النوع */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex gap-4 items-center">
          <select 
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-2"
          >
            <option value="">اختر نوع التحاليل</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          
          <button
            onClick={applyCategoryToAll}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            تطبيق على الكل
          </button>
        </div>
      </div>

      {/* قائمة التحاليل */}
      <div className="space-y-4 mb-6">
        {tests.map((test, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم التحليل</label>
                <input
                  type="text"
                  value={test.name}
                  onChange={(e) => updateTest(index, 'name', e.target.value)}
                  placeholder="أدخل اسم التحليل"
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                  <input
                    type="number"
                    value={test.price}
                    onChange={(e) => updateTest(index, 'price', e.target.value)}
                    placeholder="السعر"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coins</label>
                  <input
                    type="number"
                    value={test.coins}
                    onChange={(e) => updateTest(index, 'coins', e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Union Coins</label>
                  <input
                    type="number"
                    value={test.unionCoins}
                    onChange={(e) => updateTest(index, 'unionCoins', e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <select
                value={test.categoryId}
                onChange={(e) => updateTest(index, 'categoryId', e.target.value)}
                className="border border-gray-300 rounded-lg p-2"
              >
                <option value="">اختر النوع</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              
              {tests.length > 1 && (
                <button
                  onClick={() => removeTest(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  حذف
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* أزرار التحكم */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={addTest}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          + إضافة تحليل آخر
        </button>
        
        <button
          onClick={uploadTests}
          disabled={loading}
          className="bg-[#005FA1] text-white px-8 py-3 rounded-lg hover:bg-[#00457a] disabled:bg-gray-400"
        >
          {loading ? 'جاري الرفع...' : `رفع ${tests.length} تحليل`}
        </button>
      </div>

      {/* إحصائيات */}
      <div className="mt-6 text-center text-sm text-gray-600">
        {tests.filter(t => t.name.trim()).length} / {tests.length} تحليل مكتمل
      </div>
    </div>
  );
}

export default QuickLabUpload;