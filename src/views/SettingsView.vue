<template>
  <div class="min-h-screen bg-gray-50 p-4 rtl pt-10" dir="rtl">
    
    <!-- هدر صفحه -->
    <header class="mb-6 flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">تنظیمات چلونگر</h1>
    </header>

    <!-- کادر وضعیت نسخه برنامه -->
    <div 
      class="mb-8 rounded-2xl p-5 shadow-sm border"
      :class="isPro ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-white border-gray-200'"
    >
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold" :class="isPro ? 'text-yellow-700' : 'text-gray-700'">
            {{ isPro ? 'نسخه حرفه‌ای فعال است' : 'نسخه رایگان' }}
          </h2>
          <p class="text-sm mt-1 text-gray-500">
            {{ isPro ? 'شما به تمامی امکانات اپلیکیشن دسترسی دارید.' : 'برای استفاده‌ی بدون محدودیت می‌توانید برنامه را ارتقا دهید' }}
          </p>
        </div>
        
        <!-- دکمه ارتقا (فقط در نسخه رایگان) -->
        <router-link 
          v-if="!isPro" 
          to="/pro" 
          class="shrink-0 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-bold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-transform active:scale-95"
        >
          ارتقا به PRO
        </router-link>
        
        <!-- آیکون تیک (برای نسخه حرفه ای) -->
        <div v-else class="shrink-0 bg-yellow-100 p-2 rounded-full">
          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- لیست تنظیمات -->
    <div class="space-y-4">
      
      <!-- آیتم 1: فشرده‌سازی خودکار (ویژه پرو) -->
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-opacity" :class="{'opacity-60': !isPro}">
        <div class="pl-4">
          <div class="flex items-center gap-2">
            <h3 class="font-medium text-gray-800">فشرده‌سازی خودکار فایل‌های جدید</h3>
            <span v-if="!isPro" class="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">PRO</span>
          </div>
          <p class="text-xs text-gray-500 mt-1 leading-relaxed">
            برنامه در پس‌زمینه عکس‌های جدید را شناسایی کرده و به صورت خودکار حجم آن‌ها را کاهش می‌دهد.
          </p>
        </div>
        <!-- Toggle Switch -->
        <label class="relative inline-flex items-center cursor-pointer shrink-0" :class="{'pointer-events-none': !isPro}">
          <input type="checkbox" v-model="settings.autoCompress" class="sr-only peer" :disabled="!isPro">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
      </div>

      <!-- آیتم 2: عدم کاهش حجم عکس‌های زیر 1 مگابایت -->
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div class="pl-4">
          <h3 class="font-medium text-gray-800">چشم‌پوشی از عکس‌های زیر ۱ مگابایت</h3>
          <p class="text-xs text-gray-500 mt-1 leading-relaxed">
            عکس‌هایی که از قبل حجم کمی دارند (کمتر از ۱ مگابایت) فشرده نخواهند شد تا کیفیت آن‌ها کاملاً حفظ شود.
          </p>
        </div>
        <!-- Toggle Switch -->
        <label class="relative inline-flex items-center cursor-pointer shrink-0">
          <input type="checkbox" v-model="settings.skipSmallFiles" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
      </div>

      <!-- آیتم 3: نوتیفیکیشن گزارش حافظه -->
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div class="pl-4">
          <h3 class="font-medium text-gray-800">اعلان گزارش افزایش حافظه</h3>
          <p class="text-xs text-gray-500 mt-1 leading-relaxed">
            پس از پایان عملیات فشرده‌سازی، یک نوتیفیکیشن حاوی میزان فضای آزاد شدهِ دستگاه نمایش داده شود.
          </p>
        </div>
        <!-- Toggle Switch -->
        <label class="relative inline-flex items-center cursor-pointer shrink-0">
          <input type="checkbox" v-model="settings.enableNotifications" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

// متغیر وضعیت نسخه حرفه‌ای
const isPro = ref(false)

// آبجکت تنظیمات
const settings = reactive({
  autoCompress: false,
  skipSmallFiles: false,
  enableNotifications: true // معمولا نوتیفیکیشن پیش‌فرض فعال است
})

// شبیه‌سازی رابط کاربری اندروید برای جلوگیری از خطا در مرورگر وب هنگام توسعه
const getAndroidPrefs = () => {
  if (typeof AndroidPrefs !== 'undefined') {
    return AndroidPrefs
  }
  // در محیط وب (هنگام توسعه با لپ‌تاپ) این مقادیر بازگردانده می‌شوند
  return {
    getBoolean: (key, defValue) => defValue,
    setBoolean: (key, value) => console.log(`Saved: ${key} = ${value}`)
  }
}

onMounted(() => {
  const prefs = getAndroidPrefs()
  
  // دریافت وضعیت پرو
  isPro.value = prefs.getBoolean('is_pro', false)

  // دریافت مقادیر تنظیمات
  settings.autoCompress = prefs.getBoolean('auto_compress', false)
  settings.skipSmallFiles = prefs.getBoolean('skip_small_files', false)
  settings.enableNotifications = prefs.getBoolean('enable_notifications', true)

  // اگر کاربر پرو نبود، فشرده‌سازی خودکار حتما باید غیرفعال بماند
  if (!isPro.value && settings.autoCompress) {
    settings.autoCompress = false
    prefs.setBoolean('auto_compress', false)
  }
})

// ثبت مقادیر با استفاده از Watch 
// هر زمان یکی از مقادیر تغییر کند، بلافاصله در اندروید ذخیره می‌شود
watch(() => settings.autoCompress, (newValue) => {
  if (isPro.value) { // فقط در صورت پرو بودن ذخیره شود
    getAndroidPrefs().setBoolean('auto_compress', newValue)
  } else if (newValue === true) {
    // جلوگیری از فعال شدن توسط کاربر در صورتی که باگ UI رخ داده باشد
    settings.autoCompress = false 
  }
})

watch(() => settings.skipSmallFiles, (newValue) => {
  getAndroidPrefs().setBoolean('skip_small_files', newValue)
})

watch(() => settings.enableNotifications, (newValue) => {
  getAndroidPrefs().setBoolean('enable_notifications', newValue)
})
</script>

<style scoped>
/* در صورت نیاز می‌توانید استایل‌های اختصاصی خود را اینجا اضافه کنید */
</style>
