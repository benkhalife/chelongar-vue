<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()

const marketName = ref('')



let sections = ref([])

onMounted(() => {
  console.log('import.meta.env.VITE_MARKET', import.meta.env.VITE_MARKET);

  marketName.value = import.meta.env.VITE_MARKET === 'BAZAAR' ? 'کافه بازار' : 'مایکت'

  sections.value = [
    {
      icon: '📸',
      title: 'دسترسی به گالری تصاویر',
      content: `این برنامه برای قابلیت ایجاد تصویر از متن میخی، امکان انتخاب تصویر پس‌زمینه از گالری شما را فراهم می‌کند. این دسترسی کاملاً اختیاری است و تنها زمانی فعال می‌شود که شما به‌صراحت آن را درخواست کنید. تصاویر انتخاب‌شده هرگز از دستگاه شما خارج نمی‌شوند.`
    },
    {
      icon: '💾',
      title: 'ذخیره‌سازی تصاویر',
      content: `تصاویر ایجادشده توسط برنامه (تصویر متن میخی) با استفاده از سرویس استاندارد MediaStore اندروید در گالری دستگاه شما ذخیره می‌شوند. این فرایند کاملاً تحت کنترل شماست و هیچ تصویری بدون اجازه صریح شما ذخیره نمی‌شود.`
    },
    {
      icon: '🌐',
      title: 'اتصال به اینترنت',
      content: `برنامه از اتصال اینترنت صرفاً برای دو هدف زیر استفاده می‌کند:\n\n• بررسی وجود نسخه‌های جدید برنامه\n•  تأیید و همگام‌سازی پرداخت‌های درون‌برنامه‌ای از طریق سرویس های ${marketName.value}\n\nهیچ اطلاعات شخصی یا رفتاری در این فرایند ارسال نمی‌شود.`
    },
    {
      icon: '🔒',
      title: 'عدم جمع‌آوری اطلاعات',
      content: `در نسخه فعلی، این برنامه هیچ‌گونه اطلاعات شخصی، رفتاری یا تشخیصی از کاربران جمع‌آوری، ذخیره یا منتقل نمی‌کند.`
    },
    {
      icon: '💳',
      title: 'پرداخت‌های درون‌برنامه‌ای',
      content: `تمامی پرداخت‌ها از طریق سرویس پرداخت امن  (${marketName.value}) انجام می‌شود. برنامه خط میخی به هیچ یک از اطلاعات مالی یا بانکی شما دسترسی ندارد. اطلاعات تراکنش‌ها فقط توسط ${marketName.value} مدیریت می‌شوند.`
    },
    {
      icon: '⌨️',
      title: 'کیبورد خط میخی',
      content: `کیبورد جانبی خط میخی (نسخه حرفه‌ای) که به‌عنوان Input Method اندروید عمل می‌کند، هیچ‌گونه کلیدی را ثبت یا ذخیره نمی‌کند. این کیبورد هیچ داده‌ای از آنچه تایپ می‌کنید را جمع‌آوری، ذخیره یا ارسال نمی‌کند.`
    },
    {
      icon: '📦',
      title: 'ذخیره‌سازی محلی',
      content: `تنظیمات برنامه (مانند وضعیت اشتراک) به‌صورت کاملاً محلی روی دستگاه شما ذخیره می‌شوند و به هیچ سرور خارجی ارسال نمی‌شوند.`
    },
    {
      icon: '🔄',
      title: 'به‌روزرسانی سیاست حریم خصوصی',
      content: `در صورت هرگونه تغییر در سیاست حریم خصوصی، کاربران از طریق به‌روزرسانی برنامه مطلع خواهند شد. استفاده مستمر از برنامه پس از انتشار تغییرات، به‌منزله پذیرش آن‌ها تلقی می‌شود.`
    },
  ]
})
</script>

<template>
  <div dir="rtl" class="fixed z-40 top-0 left-0 w-full h-full overflow-y-auto text-justify"
    style="background: linear-gradient(180deg, #0d0b08 0%, #1a1408 50%, #0d0b08 100%);">

    <!-- پس‌زمینه تزئینی -->
    <div class="fixed inset-0 opacity-5 pointer-events-none"
      style="background-image: repeating-linear-gradient(0deg, #c9a84c 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #c9a84c 0px, transparent 1px, transparent 40px);">
    </div>

    <!-- هدر -->
    <div class="relative z-10 px-4 pt-12 pb-6 text-center" style="border-bottom: 1px solid #c9a84c33;">
      <button @click="router.back()"
        class="absolute top-12 left-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
        style="background: #c9a84c22; border: 1px solid #c9a84c55; color: #c9a84c;">
        ← بازگشت
      </button>
      <div class="text-3xl mb-2">🔒</div>
      <h1 class="text-xl font-bold" style="color: #e8d5a3;">حریم خصوصی و قوانین استفاده</h1>
      <p class="text-xs mt-2" style="color: #8a7a5a;">آخرین به‌روزرسانی: اسفند ۱۴۰۴</p>
    </div>

    <!-- مقدمه -->
    <div class="relative z-10 mx-4 mt-5 rounded-2xl p-5" style="background: #c9a84c15; border: 1px solid #c9a84c44;">
      <p class="text-sm leading-7" style="color: #c9a84c;">
        تیم نیتروکد به حریم خصوصی کاربران خود احترام می‌گذارد. این سند توضیح می‌دهد که
        برنامه «خط‌میخی باستان» چه داده‌هایی را استفاده می‌کند و چگونه آن‌ها را مدیریت می‌نماید.
      </p>
    </div>

    <!-- بخش‌ها -->
    <div class="relative z-10 px-4 py-5 flex flex-col gap-4 pb-16">
      <div v-for="(section, index) in sections" :key="index" class="rounded-2xl p-5"
        style="background: #c9a84c0d; border: 1px solid #c9a84c22;">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style="background: #c9a84c22;">
            {{ section.icon }}
          </div>
          <h2 class="text-base font-bold" style="color: #e8d5a3;">{{ section.title }}</h2>
        </div>
        <p class="text-sm leading-7 whitespace-pre-line" style="color: #b0a080;">
          {{ section.content }}
        </p>
      </div>



    </div>
  </div>
</template>
