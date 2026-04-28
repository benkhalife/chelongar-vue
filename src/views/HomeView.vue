<template>
  <!-- Background: Soft Cream/Gray (Not blinding white) -->
  <div style="background-color: rgb(208 211 215);;"
    class="min-h-screen text-slate-800 overflow-hidden relative dir-rtl">

    <!-- Soft Background Elements (Subtle Teal & Cream blobs for depth) -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <div class="absolute -top-32 -right-32 w-96 h-96 bg-teal-100 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 -left-40 w-80 h-80 bg-cyan-100 rounded-full blur-3xl"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col min-h-screen px-5 pt-12 pb-8">

      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 overflow-hidden rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
            <img src="@/assets/images/Chelongar-icon-512.png" alt="">
          </div>
          <div>
            <h1 class="text-2xl font-black font-bold text-slate-800 tracking-tight">
              چلونگر
            </h1>
            <p class="text-xs text-slate-500 font-medium mt-0.5">فشرده‌سازی و کاهش حجم</p>
          </div>
        </div>
        <!-- Notification Button -->
        <button v-if="activeHideSmallGalleryButton" @click="exitApp" v-longpress="openHiddenGallery"
          class="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-teal-600 transition-colors">
          <BellIcon v-if="hideGalleryButtonIcon === 'notification'" class="w-6 h-6 text-black/70"></BellIcon>
          <ArrowRightOnRectangleIcon v-else-if="hideGalleryButtonIcon == 'exit'" class="w-6 h-6 text-black/70"></ArrowRightOnRectangleIcon>
          <EyeSlashIcon v-else class="w-6 h-6 text-black/70"></EyeSlashIcon>
        </button>

        <button v-else @click="exitApp" v-longpress="openHiddenGallery"
          class="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-teal-600 transition-colors">
          <ArrowRightOnRectangleIcon class="w-6 h-6 text-black/70"></ArrowRightOnRectangleIcon>
        </button>
      </div>

      <!-- Storage Overview Card -->
      <div
        class="mb-8 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 relative overflow-hidden">
        <!-- Decoration -->
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-teal-50 rounded-full opacity-50 pointer-events-none"></div>

        <div class="flex items-center justify-between mb-5 relative z-10">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
            <span class="text-sm font-semibold text-slate-700">فضای استفاده‌شده داخلی</span>
          </div>
          <span class="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-xl">{{ storagePercentage
            }}٪</span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden mb-4 relative z-10">
          <div
            class="h-full rounded-full bg-gradient-to-l from-teal-400 to-teal-600 transition-all duration-1000 ease-out"
            :style="{ width: `${storagePercentage}%` }"></div>
        </div>

        <!-- Storage Details -->
        <div class="flex justify-between items-center text-xs text-slate-500 font-medium relative z-10">
          <div class="flex flex-col gap-1">
            <span class="text-slate-800 font-bold text-sm">{{ usedGB }} GB</span>
            <span>استفاده شده</span>
          </div>
          <div class="flex flex-col gap-1 text-left">
            <span class="text-slate-800 font-bold text-sm">{{ totalGB }} GB</span>
            <span>کل فضا</span>
          </div>
        </div>
      </div>

      <!-- Menu Cards Grid -->
      <div class="grid grid-cols-2 gap-4 mb-4">

        <!-- Card 1: Image Compress -->
        <button @click="navigate('compress-image')"
          class="group bg-white rounded-3xl p-5 text-right shadow-sm border border-slate-100 active:scale-95 transition-all duration-200 hover:shadow-md hover:border-teal-200 flex flex-col justify-between min-h-[140px]">
          <div
            class="w-12 h-12 mx-auto rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
            <svg class="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <div>
            <p class="text-md font-bold text-slate-800 mb-1 text-center">کاهش حجم عکس</p>
            <p class="text-[12px] text-slate-600 text-center font-medium leading-relaxed">بدون افت کیفیت</p>
          </div>
        </button>

        <!-- Card 2: Video Compress -->
        <button @click="navigate('compress-video')"
          class="group bg-white rounded-3xl p-5 text-right shadow-sm border border-slate-100 active:scale-95 transition-all duration-200 hover:shadow-md hover:border-cyan-200 flex flex-col justify-between min-h-[140px]">
          <div
            class="w-12 mx-auto h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
            <svg class="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div>
            <p class="text-md text-center font-bold text-slate-800 mb-1">کاهش حجم ویدیو</p>
            <p class="text-center w-full text-[12px] text-slate-600 font-medium leading-relaxed">با کیفیت بالا</p>
          </div>
        </button>
      </div>

      <!-- Card 3: Boost Storage - Full Width -->
      <!-- <button @click="navigate('scanner')"
        class="group w-full bg-white rounded-3xl p-4 text-right shadow-sm border border-slate-100 active:scale-95 transition-all duration-200 hover:shadow-md hover:border-emerald-200 mb-4">
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m0 5.25c0 2.278 3.694 4.125 8.25 4.125s8.25-1.847 8.25-4.125" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <p class="text-md font-bold text-slate-900">افزایش فضای گوشی</p>
              <span class="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">ویژه</span>
            </div>
            <p class="text-[11px] text-slate-700 font-medium">بهینه سازی خودکار و افزایش حافظه گوشی بدون حذف فایل</p>
          </div>
          <div
            class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
            <svg class="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </div>
        </div>
      </button> -->

      <!-- Card 4: Settings & About + Hidden Gallery (Grid 3 columns) -->
      <div class="grid  gap-3 mb-4" :class="`${showHiddenGalleryBigButton ? 'grid-cols-2' : 'grid-cols-1'}`">

        <!-- دکمه تنظیمات -->
        <!-- <button @click="navigate('settings')"
          class="group bg-white rounded-3xl p-4 text-center shadow-sm border border-slate-100 active:scale-95 transition-all duration-200 hover:shadow-md hover:border-indigo-200 flex flex-col items-center justify-center">
          <div
            class="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-500 group-hover:text-white group-hover:rotate-90 transition-all duration-300">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-800 mb-0.5">تنظیمات</p>
            <p class="text-[10px] text-slate-500 font-medium">شخصی‌سازی</p>
          </div>
        </button> -->

        <!-- دکمه درباره ما -->
        <button @click="navigate('about')"
          class="group bg-white rounded-3xl p-4 text-center shadow-sm border border-slate-100 active:scale-95 transition-all duration-200 hover:shadow-md hover:border-violet-200 flex flex-col items-center justify-center">
          <div
            class="w-11 h-11 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
            <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-800 mb-0.5">درباره ما</p>
            <p class="text-[10px] text-slate-500 font-medium">راهنما</p>
          </div>
        </button>

        <!-- دکمه گالری مخفی -->
        <button v-if="showHiddenGalleryBigButton" @click="openHiddenGallery"
          class="group relative bg-slate-800 rounded-3xl p-4 text-center shadow-sm border border-slate-700 active:scale-95 transition-all duration-200 hover:shadow-lg hover:bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
          <!-- shimmer effect -->
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
          </div>
          <div
            class="w-11 h-11 rounded-2xl bg-slate-700 text-slate-300 flex items-center justify-center mb-3 group-hover:bg-slate-600 group-hover:text-white transition-all duration-300 relative z-10">
            <!-- آیکون قفل / گالری مخفی -->
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div class="relative z-10">
            <p class="text-xs font-bold text-slate-200 mb-0.5">گالری مخفی</p>
            <p class="text-[10px] text-slate-500 font-medium">خصوصی</p>
          </div>
        </button>

      </div>

      <!-- Footer -->
      <div class="mt-auto pt-6 flex items-center justify-center gap-2">
        <div class="w-1 h-1 rounded-full bg-slate-300"></div>
        <p class="text-[10px] font-bold text-slate-400 tracking-widest">نسخه ۱.۰.۰</p>
        <div class="w-1 h-1 rounded-full bg-slate-300"></div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { BellIcon, EyeSlashIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
// import { ArrowRightOnRectangleIcon } from '@heroicons/vue/20/solid';

const router = useRouter();

const hideGalleryButtonIcon = ref(AndroidPrefs.getString('gallery_icon', 'exit'))

const hideGalleryButton = ref(AndroidPrefs.getString('gallery_hide_button', '0') === 'true')
const hasPin = ref(AndroidPrefs.getString('gallery_pin', '').length === 4)

const showHiddenGalleryBigButton = computed(() => {

  if (hasPin.value == false || (hasPin.value && hideGalleryButton.value == false)) {
    return true;
  }
  return false;
})

const storageData = ref({
  total: 0,
  used: 0,
  available: 0
});

const openHiddenGallery = () => {
  const hasPermission = window.AndroidMediaPermission.hasStoragePermission();
  if (!hasPermission){
    router.push({ name: 'permission', params: { afterPermission: 'hg-login' } })
  }
  else{
    router.push({ name: 'hg-login' })
  }
}

const fetchStorageInfo = () => {
  try {
    if (window.AndroidTools && window.AndroidTools.getStorageInfo) {
      window.AndroidTools.getStorageInfo();
    }
  } catch (error) {
    console.error("خطا در دریافت یا پردازش اطلاعات حافظه:", error);
  }
};



const activeHideSmallGalleryButton = computed(() => {

  if (hasPin.value && hideGalleryButton.value) {
    return true;
  }
  return false;
})

const exitApp = () => {
  window.handleAndroidBackPress()
}

const bytesToGB = (bytes) => {
  if (!bytes || bytes === 0) return 0;
  const gb = bytes / (1024 * 1024 * 1024);
  return parseFloat(gb.toFixed(1));
};

const totalGB = computed(() => bytesToGB(storageData.value.total));
const usedGB = computed(() => bytesToGB(storageData.value.used));

const storagePercentage = computed(() => {
  if (storageData.value.total === 0) return 0;
  const percent = (storageData.value.used / storageData.value.total) * 100;
  return Math.round(percent);
});

onMounted(() => {

  setTimeout(() => {
    fetchStorageInfo();
  }, 500)

  addEventListener('HomeStorageInfo', event => {
    const parsedData = event.detail;
    if (parsedData && parsedData.internal) {
      storageData.value = parsedData.internal;
    }
  })
});

const navigate = (page) => {
  if (page == 'scanner') {
    if (AndroidMediaPermission.hasStoragePermission() == false) {
      router.push({ name: 'permission', params: { afterPermission: 'scanner' } })
      return;
    }
  }
  if (router) {
    router.push({ name: page }).catch(() => { });
  }
  if (window.AndroidTools && window.AndroidTools.navigate) {
    window.AndroidTools.navigate(page);
  }
};
</script>

<style scoped>
.dir-rtl {
  direction: rtl;
}


button {
  -webkit-tap-highlight-color: transparent;
  outline: none;
}
</style>