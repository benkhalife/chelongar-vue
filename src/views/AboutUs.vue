<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('about')

const getVersion = ref('')
const getClientVersion = ref('')
const getMarket = ref('')

let devModeIndex = 0;
const tryDeveloperMode = ()=>{
  devModeIndex++;
  if(devModeIndex == 5){
    AndroidTools?.showToast('Developer mode', true)
    AndroidTools?.setWebViewDebuggingEnabled(true)
  }
}

onMounted(()=>{
  getVersion.value = AndroidTools?.getVersionName()
  getClientVersion.value = import.meta.env.VITE_VERSION
  getMarket.value = import.meta.env.VITE_MARKET
})

const tabs = [
  { id: 'about', label: 'درباره برنامه' },
  { id: 'cuneiform', label: 'خط میخی' },
  { id: 'sources', label: 'منابع' },
  { id: 'contact', label: 'تماس با ما' },
]
</script>

<template>
  <div dir="rtl" class="fixed z-40 top-0 left-0 w-full h-full overflow-y-auto"
    style="background: linear-gradient(180deg, #0d0b08 0%, #1a1408 50%, #0d0b08 100%);">

    <!-- پس‌زمینه تزئینی -->
    <div class="fixed inset-0 opacity-5 pointer-events-none"
      style="background-image: repeating-linear-gradient(0deg, #c9a84c 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #c9a84c 0px, transparent 1px, transparent 40px);">
    </div>

    <!-- هدر -->
    <div class="relative z-10 px-4 pt-12 pb-6 text-center"
      style="border-bottom: 1px solid #c9a84c33;">
      <button @click="router.back()"
        class="absolute top-12 left-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
        style="background: #c9a84c22; border: 1px solid #c9a84c55; color: #c9a84c;">
        ← بازگشت
      </button>

      <!-- لوگو/عنوان -->
      <!-- <div class="text-xl mb-2" style="color: #c9a84c; font-family: serif; letter-spacing: 6px;">
        𐎴𐎹𐎫𐎽𐎣𐎭
      </div> -->
      <h1 class="text-xl font-bold mt-2" style="color: #e8d5a3;">خط‌میخی باستان</h1>
      <p class="text-sm mt-1" style="color: #8a7a5a;">Cuneiform Script Converter</p>
    </div>

    <!-- تب‌ها -->
    <div class="relative z-10 flex overflow-x-auto px-4 py-3 gap-2"
      style="background: #0d0b08ee; backdrop-filter: blur(10px); border-bottom: 1px solid #c9a84c22;">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
        :style="activeTab === tab.id
          ? 'background: #c9a84c; color: #1a1408;'
          : 'background: #c9a84c15; border: 1px solid #c9a84c33; color: #c9a84c;'">
        {{ tab.label }}
      </button>
    </div>

    <!-- محتوا -->
    <div class="relative z-10 px-4 py-6 pb-16 text-justify">

      <!-- تب: درباره برنامه -->
      <div v-if="activeTab === 'about'" class="flex flex-col gap-5">

        <div class="rounded-2xl p-5" style="background: #c9a84c0d; border: 1px solid #c9a84c33;">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style="background: #c9a84c22;">📜</div>
            <h2 class="text-lg font-bold" style="color: #e8d5a3;">درباره این برنامه</h2>
          </div>
          <p class="text-sm leading-7" style="color: #b0a080;">
            خط‌میخی باستان یک ابزار تخصصی برای تبدیل متن فارسی به خط میخی هخامنشی است. این برنامه
            امکان تایپ مستقیم با کیبورد اختصاصی، ایجاد تصاویر خط میخی و یادگیری این خط باستانی را
            فراهم می‌آورد.
          </p>
        </div>

        <div class="w-full">
          <router-link class="block text-center p-2 rounded-xl w-full" style="background: #c9a84c22; border: 1px solid #c9a84c55; color: #c9a84c;" to="/pro">مشاهده صفحه نسخه حرفه‌ای</router-link>
        </div>

        <div class="rounded-2xl p-5" style="background: #c9a84c0d; border: 1px solid #c9a84c33;">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style="background: #c9a84c22;">⚡</div>
            <h2 class="text-lg font-bold" style="color: #e8d5a3;">قابلیت‌های برنامه</h2>
          </div>
          <div class="flex flex-col gap-3">
            <div v-for="feature in [
              { icon: '🔤', text: 'تبدیل متن فارسی به خط میخی هخامنشی' },
              { icon: '⌨️', text: 'کیبورد جانبی اختصاصی خط میخی (نسخه حرفه‌ای)' },
              { icon: '🖼️', text: 'ایجاد تصویر از متن میخی با پس‌زمینه دلخواه' },
              { icon: '📚', text: 'آموزش و یادگیری حروف خط میخی' },
              { icon: '📋', text: 'کپی سریع متن میخی' },
            ]" :key="feature.text"
              class="flex items-center gap-3 p-3 rounded-xl"
              style="background: #ffffff08;">
              <span class="text-xl">{{ feature.icon }}</span>
              <span class="text-sm" style="color: #b0a080;">{{ feature.text }}</span>
            </div>

            <div dir="rtl" class="text-xs text-white/50 text-center">
              <div>نسخه:{{ getVersion }}</div>
              <div>Client Version: {{ getClientVersion }}-{{ getMarket }}</div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl p-5" style="background: #c9a84c0d; border: 1px solid #c9a84c33;">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style="background: #c9a84c22;">🏛️</div>
            <h2 class="text-lg font-bold" style="color: #e8d5a3;">سازنده</h2>
          </div>
          <div class="text-center py-2">
            <div class="text-3xl mb-2" style="color: #c9a84c; letter-spacing: 4px;">𐎴𐎹𐎫𐎽𐎣𐎭</div>
            <p class="font-bold text-lg" style="color: #e8d5a3;">نیتروکد</p>
            <p class="text-sm mt-1" style="color: #8a7a5a;">NitroCode.ir</p>
            <p @click="tryDeveloperMode()" class="text-xs mt-3 leading-6" style="color: #6a6050;">
            Benyamin Khalife
            </p>
          </div>
        </div>

      </div>

      <!-- تب: خط میخی -->
      <div v-if="activeTab === 'cuneiform'" class="flex flex-col gap-5">

        <div class="rounded-2xl p-5" style="background: #c9a84c0d; border: 1px solid #c9a84c33;">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style="background: #c9a84c22;">🏺</div>
            <h2 class="text-lg font-bold" style="color: #e8d5a3;">خط میخی چیست؟</h2>
          </div>
          <p class="text-sm leading-7" style="color: #b0a080;">
            خط میخی (Cuneiform) یکی از قدیمی‌ترین سیستم‌های نوشتاری شناخته‌شده در تاریخ بشر است که
            حدود ۵۰۰۰ سال پیش در بین‌النهرین (میان‌رودان) توسط سومری‌ها ابداع شد. این خط با فشار
            نی یا چوب بر روی لوح‌های گلی حک می‌شد و شکل‌های گوه‌ای شکل آن به این خط نام «میخی» را
            بخشیده است.
          </p>
        </div>

        <div class="rounded-2xl p-5" style="background: #c9a84c0d; border: 1px solid #c9a84c33;">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style="background: #c9a84c22;">👑</div>
            <h2 class="text-lg font-bold" style="color: #e8d5a3;">خط میخی هخامنشی</h2>
          </div>
          <p class="text-sm leading-7" style="color: #b0a080;">
            خط میخی هخامنشی (Old Persian Cuneiform) نسخه‌ای ساده‌شده از خط میخی است که در دوره
            امپراتوری هخامنشی (۵۵۰–۳۳۰ ق.م) برای نگارش زبان فارسی باستان به‌کار می‌رفت. این خط
            دارای ۳۶ نشانه هجایی، ۸ نشانه واژه‌نگار و ۳ نشانه برای اعداد است. کتیبه‌های بیستون،
            تخت‌جمشید و نقش رستم از مهم‌ترین منابع بازمانده از این خط هستند.
          </p>
        </div>

        <div class="rounded-2xl p-5" style="background: #c9a84c0d; border: 1px solid #c9a84c33;">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style="background: #c9a84c22;">🔍</div>
            <h2 class="text-lg font-bold" style="color: #e8d5a3;">رمزگشایی</h2>
          </div>
          <p class="text-sm leading-7" style="color: #b0a080;">
            رمزگشایی خط میخی در قرن نوزدهم میلادی توسط دانشمندانی چون گئورگ فردریش گروتفند و
            هنری رالینسون انجام شد. کتیبه بیستون که به سه زبان فارسی باستان، ایلامی و بابلی نوشته
            شده بود، کلید اصلی رمزگشایی این خط به‌شمار می‌رود.
          </p>
        </div>

       

      </div>

      <!-- تب: منابع -->
      <div v-if="activeTab === 'sources'" class="flex flex-col gap-5">

        <div class="rounded-2xl p-5" style="background: #c9a84c0d; border: 1px solid #c9a84c33;">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style="background: #c9a84c22;">📖</div>
            <h2 class="text-lg font-bold" style="color: #e8d5a3;">منابع علمی و آموزشی</h2>
          </div>
          <p class="text-sm leading-6 mb-4" style="color: #8a7a5a;">
            اطلاعات آموزشی این برنامه از منابع زیر جمع‌آوری شده است:
          </p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-4 p-4 rounded-xl"
              style="background: #ffffff08; border: 1px solid #c9a84c22;">
              <div class="text-2xl">🌐</div>
              <div>
                <p class="font-bold text-sm" style="color: #e8d5a3;">پارس هیستوری</p>
                <p class="text-xs mt-1" style="color: #8a7a5a;">parshistory.com</p>
                <p class="text-xs mt-1 leading-5" style="color: #6a6050;">
                  منبع اطلاعات تاریخی و آموزشی خط میخی
                </p>
              </div>
            </div>

            
          </div>
        </div>

        <div class="rounded-2xl p-5" style="background: #c9a84c0d; border: 1px solid #c9a84c33;">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style="background: #c9a84c22;">⚖️</div>
            <h2 class="text-lg font-bold" style="color: #e8d5a3;">مالکیت معنوی</h2>
          </div>
          <p class="text-sm leading-7" style="color: #b0a080;">
            طراحی و توسعه کیبورد خط میخی این برنامه توسط <span style="color: #c9a84c;">تیم نیتروکد</span>
            انجام شده است. هرگونه کپی‌برداری، بازتولید یا بهره‌برداری تجاری از محتوا، طراحی و
            الگوریتم‌های این برنامه بدون اجازه سازنده <span style="color: #e05050;">مجاز نمی‌باشد.</span>
          </p>
        </div>

      </div>

      <!-- تب: تماس -->
      <div v-if="activeTab === 'contact'" class="flex flex-col gap-5">

        <div class="rounded-2xl p-5" style="background: #c9a84c0d; border: 1px solid #c9a84c33;">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style="background: #c9a84c22;">📬</div>
            <h2 class="text-lg font-bold" style="color: #e8d5a3;">ارتباط با ما</h2>
          </div>
          <div class="flex flex-col gap-3">
            <div v-for="item in [
              { icon: '🌐', label: 'وب‌سایت', value: 'nitrocode.ir' },
              { icon: '📧', label: 'ایمیل پشتیبانی', value: 'info@nitrocode.ir' },
              { icon: '💬', label: 'پیامک (نظر و پیشنهاد)', value: '09038755123' },
            ]" :key="item.label"
              class="flex items-center gap-4 p-4 rounded-xl"
              style="background: #ffffff08; border: 1px solid #c9a84c22;">
              <div class="text-2xl">{{ item.icon }}</div>
              <div>
                <p class="text-xs" style="color: #8a7a5a;">{{ item.label }}</p>
                <p class="font-bold text-sm mt-1" style="color: #e8d5a3; direction: ltr;">{{ item.value }}</p>
              </div>
            </div>
          </div>
          <p class="text-xs mt-4 leading-6 text-center" style="color: #6a6050;">
            شماره پشتیبانی فقط برای دریافت پیامک (SMS) است و تماس تلفنی پاسخ داده نمی‌شود.
          </p>
        </div>

        <div class="rounded-2xl p-5" style="background: #c9a84c0d; border: 1px solid #c9a84c33;">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style="background: #c9a84c22;">🔗</div>
            <h2 class="text-lg font-bold" style="color: #e8d5a3;">صفحات مرتبط</h2>
          </div>
          <RouterLink to="/privacy"
            class="flex items-center justify-between p-4 rounded-xl transition-all duration-200"
            style="background: #ffffff08; border: 1px solid #c9a84c22;">
            <div class="flex items-center gap-3">
              <span class="text-xl">🔒</span>
              <span class="text-sm font-bold" style="color: #e8d5a3;">حریم خصوصی و قوانین استفاده</span>
            </div>
            <span style="color: #c9a84c;">←</span>
          </RouterLink>
        </div>

      </div>

    </div>
  </div>
</template>
