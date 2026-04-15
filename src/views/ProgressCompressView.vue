<template>
    <div dir="rtl"
        class="min-h-screen bg-[#F7F8F9] font-[Vazirmatn] text-gray-800 flex flex-col items-center justify-center p-6">

        <div
            class="w-full max-w-sm flex flex-col items-center bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] p-8 border border-gray-100">

            <!-- عنوان صفحه -->
            <div class="text-center mb-8">
                <h2 v-if="!isFinished" class="text-xl font-bold text-gray-800 animate-pulse">در حال بهینه‌سازی...</h2>
                <h2 v-else class="text-xl font-bold text-teal-600">عملیات با موفقیت پایان یافت!</h2>
                <p class="text-sm text-gray-400 mt-2">عملیات ممکن است تا چند ساعت زمان ببرد</p>
                <p class="text-sm text-gray-400 mt-2">می‌توانید از برنامه خارج شوید برنامه در پس زمینه درحال اجرا است</p>
            </div>

            <!-- دایره پیشرفت (Circular Progress Bar) -->
            <div class="relative w-48 h-48 flex items-center justify-center mb-8">
                <!-- SVG برای رسم دایره -->
                <svg class="transform -rotate-90 w-full h-full">
                    <!-- دایره پس‌زمینه (خاکستری) -->
                    <circle cx="96" cy="96" r="84" stroke="currentColor" stroke-width="12" fill="transparent"
                        class="text-gray-100" />
                    <!-- دایره پیشرفت (Teal - سبزآبی) -->
                    <circle cx="96" cy="96" r="84" stroke="currentColor" stroke-width="12" fill="transparent"
                        stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset"
                        class="text-teal-500 transition-all duration-700 ease-out shadow-lg" />
                </svg>

                <!-- متن داخل دایره -->
                <div class="absolute flex flex-col items-center justify-center">
                    <span class="text-4xl font-extrabold text-teal-600 drop-shadow-sm" dir="ltr">
                        {{ toPersianDigits(percentage) }}٪
                    </span>
                    <span v-if="!isFinished" class="text-xs text-gray-400 mt-1">پیشرفت کلی</span>
                    <span v-else class="text-xs text-green-500 mt-1 font-bold">تکمیل شد</span>
                </div>
            </div>

            <!-- کارت‌های اطلاعات جزئی -->
            <div class="w-full space-y-3">

                <!-- تعداد عکس‌های پردازش شده -->
                <div class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="text-sm font-medium text-gray-600">تصاویر پردازش شده:</span>
                    </div>
                    <div class="font-bold text-gray-800 flex gap-2 items-center" dir="rtl">
                        <span :class="{'scale-125':scaleEffectProcessCounter}" class="inline-block text-blue-700 duration-100">{{ toPersianDigits(stats.processed) }}</span>
                         <span
                            class="text-xs text-gray-400 font-normal">از</span>
                             {{ toPersianDigits(stats.total) }}
                    </div>
                </div>

                <!-- حجم آزاد شده -->
                <div class="flex justify-between items-center bg-teal-50 p-4 rounded-2xl border border-teal-100">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-teal-600" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span class="text-sm font-bold text-teal-700">فضای آزاد شده:</span>
                    </div>
                    <span :class="{'scale-125':scaleEffectFreedSpaceCounter}"  class="font-extrabold text-teal-700 text-lg duration-100" dir="ltr">
                        {{ formatBytes(stats.freedSpace) }}
                    </span>
                </div>

            </div>

            <!-- دکمه توقف / بازگشت -->
            <button v-if="!isFinished" @click="stopCompression"
                class="mt-8 w-full bg-red-50 hover:bg-red-100 text-red-500 font-bold py-3 rounded-xl transition-all duration-300 active:scale-95">
                توقف عملیات
            </button>

            <button v-else @click="goBack"
                class="mt-8 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-300 active:scale-95">
                بازگشت به صفحه اصلی
            </button>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter()

// --- متغیرهای وضعیت (State) ---
const isFinished = ref(false);
const stats = ref({
    total: 1, // برای جلوگیری از خطای تقسیم بر صفر، پیش‌فرض 1 است
    processed: 0,
    freedSpace: 0 // به بایت
});

// --- منطق دایره پیشرفت (SVG Math) ---
const radius = 84;
const circumference = 2 * Math.PI * radius; // محیط دایره

// محاسبه درصد پیشرفت
const percentage = computed(() => {
    if (stats.value.total === 0) return 0;
    const p = Math.floor((stats.value.processed / stats.value.total) * 100);
    return p > 100 ? 100 : p;
});

const scaleEffectProcessCounter = ref(false)
const scaleEffectFreedSpaceCounter = ref(false)

// محاسبه میزان پر شدن دایره بر اساس درصد
const dashOffset = computed(() => {
    return circumference - (percentage.value / 100) * circumference;
});

// --- توابع کمکی ---

// تبدیل اعداد انگلیسی به فارسی
const toPersianDigits = (num) => {
    return num.toString().replace(/\d/g, (x) => String.fromCharCode(x.charCodeAt(0) + 1728));
};

// تبدیل بایت به مگابایت با اعداد فارسی
const formatBytes = (bytes) => {
    if (bytes === 0) return '۰ مگابایت';
    const k = 1024;
    const sizes = ['بایت', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
    return `${value.toLocaleString('fa-IR')} ${sizes[i]}`;
};



// --- عملیات دکمه‌ها ---
const stopCompression = () => {
    console.log("درخواست توقف ارسال شد");
    // فراخوانی متد اندروید برای متوقف کردن سرویس
    if (window.AndroidTools && window.AndroidTools.stopCompression) {
        window.AndroidTools.stopCompression();
    }
    // در صورت نیاز به روتینگ برای برگشت به عقب:
    router.replace('/') 
};

const goBack = () => {
    // کدهای مربوط به برگشت به صفحه اصلی یا داشبورد
    console.log("بازگشت به داشبورد");
};



// --- چرخه حیات کامپوننت ---
onMounted(() => {
    // ۱. اتصال به EventListener برای معماری فعلی شما
    window.addEventListener('onCompressionProgress', handleProgressUpdate);

   getTotalFreeSpaceRunEvent()
});

const getTotalFreeSpaceRunEvent = ()=>{
    if(AndroidTools?.getTotalFreedSpace){
        AndroidTools.getTotalFreedSpace()
    }
    else{
        console.error('Not found AndroidTools.getTotalFreedSpace');
        
    }
}

// --- متغیرهای کنترل تداخل انیمیشن‌ها ---
let processedAnimId = null;
let freedSpaceAnimId = null;

// --- تابع جامع و بهینه برای انیمیشن اعداد ---
const animateCounter = (targetKey, startValue, endValue, duration, scaleRef, animType) => {
    // ۱. لغو انیمیشن قبلی (جلوگیری از قاطی شدن اعداد در آپدیت‌های سریع اندروید)
    if (animType === 'processed' && processedAnimId) cancelAnimationFrame(processedAnimId);
    if (animType === 'freedSpace' && freedSpaceAnimId) cancelAnimationFrame(freedSpaceAnimId);

    // ۲. فعال کردن افکت بزرگ‌نمایی (Scale)
    scaleRef.value = true;
    let startTime = null;

    // ۳. منطق انیمیشن نرم با 60FPS
    const step = (currentTime) => {
        if (!startTime) startTime = currentTime;
        // محاسبه درصد پیشرفت زمان بین 0 تا 1
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // محاسبه عدد در این لحظه
        stats.value[targetKey] = Math.floor(progress * (endValue - startValue) + startValue);

        // اگر زمان تمام نشده، فریم بعدی را اجرا کن
        if (progress < 1) {
            const id = requestAnimationFrame(step);
            if (animType === 'processed') processedAnimId = id;
            if (animType === 'freedSpace') freedSpaceAnimId = id;
        } else {
            // ۴. پایان زمان: خاموش کردن افکت بزرگ‌نمایی
            scaleRef.value = false;
        }
    };

    // شروع انیمیشن
    const id = requestAnimationFrame(step);
    if (animType === 'processed') processedAnimId = id;
    if (animType === 'freedSpace') freedSpaceAnimId = id;
};

// --- مدیریت رویدادها (ارتباط با اندروید) ---

const handleProgressUpdate = (event) => {
    try {
        let data = event;
        if (event.detail) data = event.detail;
        if (typeof data === 'string') data = JSON.parse(data);

        const oldProcessed = stats.value.processed;
        const newProcessed = data.processed || 0;
        
        stats.value.total = data.total || 1;

        // منطق جدید انیمیشن برای شمارنده عکس‌ها (مدت زمان: 600 میلی‌ثانیه)
        if (newProcessed > oldProcessed && oldProcessed > 10) {
            animateCounter('processed', oldProcessed, newProcessed, 600, scaleEffectProcessCounter, 'processed');
        } else {
            stats.value.processed = newProcessed;
        }

        if (data.isFinished) {
            isFinished.value = true;
            stats.value.processed = stats.value.total; 
        }
    } catch (error) {
        console.error("خطا در پردازش اطلاعات پیشرفت:", error);
    }
};

const handleGetTotalFreedSpace = (event)=> {
    
    // دریافت دیتای جدید
    let data = event;
    if (event.detail) data = event.detail;
    
    const oldFreedSpace = stats.value.freedSpace;
    const newFreedSpace = data.currentFreedSpace || 0;

    // منطق انیمیشن برای حجم آزاد شده (مدت زمان: 1000 میلی‌ثانیه)
    if (newFreedSpace > oldFreedSpace && oldFreedSpace > 0) {
        animateCounter('freedSpace', oldFreedSpace, newFreedSpace, 1000, scaleEffectFreedSpaceCounter, 'freedSpace');
    } else {
        stats.value.freedSpace = newFreedSpace;
    }

    // درخواست مجدد بعد از 10 ثانیه
    setTimeout(() => {
        getTotalFreeSpaceRunEvent();
    }, 10000);
}

// --- رویداد دریافت حجم آزاد شده ---

window.addEventListener('onGetTotalFreedSpace', handleGetTotalFreedSpace );


onUnmounted(() => {
    window.removeEventListener('onCompressionProgress', handleProgressUpdate);
    window.removeEventListener('onGetTotalFreedSpace', handleGetTotalFreedSpace);
});
</script>

<style scoped>
/* در صورت نیاز به استایل‌های اختصاصی غیر از Tailwind */
</style>
