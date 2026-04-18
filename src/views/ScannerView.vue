<template>
  <div dir="rtl"
    class="min-h-screen bg-[#F7F8F9] font-[Vazirmatn] text-gray-800 flex flex-col items-center justify-center p-6">

    <!-- بخش انیمیشن اسکن (وقتی در حال پردازش است) -->
    <div v-if="isScanning" class="flex flex-col items-center justify-center w-full transition-opacity duration-500">
      <!-- افکت رادار/اسکنر با Tailwind -->
      <div class="relative flex justify-center items-center w-40 h-40 mb-8">
        <div class="absolute inset-0 rounded-full border-4 border-teal-500 opacity-20 animate-ping"></div>
        <div class="absolute inset-4 rounded-full border-4 border-teal-500 opacity-40 animate-pulse"></div>
        <div
          class="relative w-20 h-20 bg-gradient-to-tr from-teal-600 to-teal-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.6)]">
          <!-- آیکون ذره‌بین یا اسکن -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <h2 class="text-xl font-bold text-gray-700 mb-2">در حال اسکن گالری...</h2>
      <p class="text-sm text-gray-500 text-center max-w-xs leading-relaxed">
        لطفاً کمی صبر کنید. در حال محاسبه فضای قابل آزادسازی عکس‌های شما هستیم.
      </p>
    </div>

    <!-- بخش نمایش نتایج (بعد از دریافت اطلاعات از اندروید) -->
    <div v-else class="w-full max-w-sm flex flex-col items-center animate-fade-in-up">
      <!-- آیکون موفقیت -->
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 class="text-2xl font-bold text-gray-800 mb-6">اسکن تکمیل شد!</h2>

      <!-- کارت اطلاعات -->
      <div class="bg-white w-full rounded-2xl shadow-lg p-5 mb-8 border border-gray-100">

        <!-- ردیف حجم فعلی -->
        <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-gray-400"></div>
            <span class="text-gray-600 text-sm font-medium">حجم فعلی عکس‌ها:</span>
          </div>
          <span class="text-gray-800 font-bold" dir="ltr">{{ formatBytes(stats.totalCurrentSize) }}</span>
        </div>

        <!-- ردیف فضای قابل آزادسازی (برجسته شده) -->
        <div class="flex justify-between items-center bg-teal-50 p-3 rounded-xl border border-teal-100">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_5px_rgba(20,184,166,0.8)]"></div>
            <span class="text-teal-700 text-sm font-bold">حداقل فضای قابل آزادسازی:</span>
          </div>
          <span class="text-teal-700 font-extrabold text-lg" dir="ltr">{{ formatBytes(stats.expectedSavedSpace)
          }}</span>
        </div>

        <p class="text-sm text-center mt-4 bg-yellow-50 rounded-xl text-yellow-700 p-2">فضای قابل آزاد سازی نمایش داده
          شده تخمینی است و معمولا فضای بیشتری نسبت به آن آزاد می‌شود</p>

      </div>

      <!-- دکمه شروع عملیات -->
      <button v-if="isPro" @click="startCompression"
        class="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-4 rounded-xl shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        شروع فشرده‌سازی و افزایش فضا
      </button>
      <button v-else @click="startCompression"
        class="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-4 rounded-xl shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        افزایش 1 گیگ فضای رایگان
      </button>

      <router-link :to="{name:'pro'}"
        class="text-center inline-block w-full border-2 border-teal-500 mt-4 hover:to-teal-700 text-teal-500 font-bold py-4 rounded-xl shadow-md">
        مشاهده و ارتقا به نسخه حرفه‌ای
      </router-link>

      <p class="mt-4 text-xs text-gray-400 text-center">
        کیفیت عکس‌های شما پس از بهینه‌سازی حفظ خواهد شد.
      </p>
      <p class="mt-4 text-xs text-gray-400 text-center">
        هیچ فایلی از گوشی شما حذف نخواهد شد
      </p>
      <p class="mt-4 text-xs text-gray-400 text-center">
        نسخه حرفه‌ای برانامه بدون محدودیت است
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

// متغیرهای وضعیت (State)
const isScanning = ref(true);
const stats = ref({
  totalCurrentSize: 0,
  expectedSavedSpace: 0
});

const isPro = computed(() => AndroidPrefs.getBoolean('is_pro', false))

// تابع تبدیل بایت به مگابایت/گیگابایت با اعداد فارسی
const formatBytes = (bytes) => {
  if (bytes === 0) return '۰ مگابایت';
  const k = 1024;
  const sizes = ['بایت', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(1));

  // تبدیل اعداد انگلیسی به فارسی برای زیبایی بیشتر در رابط کاربری
  const persianValue = value.toLocaleString('fa-IR');
  return `${persianValue} ${sizes[i]}`;
};

// دریافت اطلاعات از اندروید
const handleAndroidResponse = (jsonString) => {
  try {
    const data = jsonString.detail
    console.log(jsonString);


    // const data = JSON.parse(jsonString);
    stats.value.totalCurrentSize = data.totalCurrentSize || 0;
    stats.value.expectedSavedSpace = data.expectedSavedSpace || 0;

    // پایان انیمیشن اسکن و نمایش نتایج
    isScanning.value = false;
  } catch (error) {
    console.error("خطا در پردازش اطلاعات دریافتی از اندروید:", error);
    isScanning.value = false; // در صورت خطا هم از حالت اسکن خارج شود
  }
};

// دکمه شروع فشرده سازی (فعلا خالی)
const startCompression = () => {
  if (window.AndroidTools) {
    window.AndroidTools.startCompression();
    router.push({ name: 'scanner-action-progress' })
  }
};

onMounted(() => {
  addEventListener('onImageScanFinished', handleAndroidResponse)
  // ۱. متصل کردن تابع دریافت جاوااسکریپت به شیء window تا اندروید بتواند آن را صدا بزند
  window.onScanResultsReceived = handleAndroidResponse;

  // ۲. ایجاد یک تاخیر حداقل 1 تا 1.5 ثانیه‌ای برای نمایش انیمیشن (برای UX بهتر)
  setTimeout(() => {
    // ۳. صدا زدن متد اندروید
    if (window.AndroidTools && window.AndroidTools.scanAndGetOptimizationStats) {
      window.AndroidTools.scanAndGetOptimizationStats();
    }
  }, 1200);
});

onUnmounted(() => {
  // پاکسازی حافظه
  delete window.onScanResultsReceived;
});
</script>

<style scoped>
/* انیمیشن نرم برای ظاهر شدن کارت نتایج */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>
