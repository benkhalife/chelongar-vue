<template>
  <div dir="rtl" class="min-h-screen bg-gray-100 p-4 md:p-8 font-sans flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      
      <!-- هدر نسخه حرفه ای -->
      <div class="bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-center text-white relative overflow-hidden">
        <!-- افکت پس زمینه -->
        <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-10"></div>
        
        <div class="relative z-10">
          <span class="inline-block bg-white text-orange-600 text-xs font-extrabold px-3 py-1 rounded-full mb-3 shadow-sm">
            PRO VERSION
          </span>
          <h1 class="text-3xl font-extrabold mb-2">چلونگر حرفه‌ای</h1>
          <p class="text-orange-50 text-sm">بدون محدودیت، استفاده کنید</p>
        </div>
      </div>

      <!-- لیست امکانات -->
      <div class="p-6 md:p-8 bg-white">
        <h2 class="text-lg font-bold text-gray-800 mb-5 border-b pb-2">امکانات نسخه حرفه‌ای:</h2>
        
        <ul class="space-y-4">
          <!-- آیتم 1 -->
          <li class="flex items-start">
            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="mr-3">
              <h3 class="font-bold text-gray-800 text-sm md:text-base">افزایش فضای ذخیره‌سازی گوشی</h3>
              <p class="text-xs text-gray-600 mt-0.5">بهینه‌سازی و کاهش حجم عکس‌ها و ویدیوها بدون محدودیت و آزادسازی فضای گوشی تاحد امکان</p>
            </div>
          </li>

          <!-- آیتم 2 -->
          <li class="flex items-start">
            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="mr-3">
              <h3 class="font-bold text-gray-800 text-sm md:text-base">گالری مخفی بدون محدودیت</h3>
              <p class="text-xs text-gray-500 mt-0.5">استفاده نامحدود از گالری با تمام قابلیت‌های آن</p>
            </div>
          </li>

          <!-- آیتم 3 -->
          <li class="flex items-start">
            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="mr-3">
              <h3 class="font-bold text-gray-800 text-sm md:text-base">کاهش حجم اتوماتیک</h3>
              <p class="text-xs text-gray-500 mt-0.5">شناسایی خودکار و کاهش حجم فایل های جدید</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- بخش خرید و دکمه -->
      <div class="bg-gray-50 p-6 md:p-8 text-center border-t border-gray-100">
        
        <button 
          @click="buyPremium"
          class="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-orange-500/30 transform transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
          <!-- آیکون سبد خرید -->
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          خرید و فعال‌سازی نسخه حرفه‌ای
        </button>

        <!-- متن پایین دکمه -->
        <div class="mt-4 flex items-center justify-center text-gray-500">
          <svg class="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          <span class="text-sm font-semibold">پرداخت یک‌بار - استفاده همیشگی</span>
        </div>
        
      </div>

    </div>
  </div>
</template>

<script setup>
import {BuyPackage} from '@/data/Payment'
// در صورت استفاده از Vue 3 Setup
const buyPremium = () => {

  BuyPackage('pro', 'chelongar');
    
}
</script>
