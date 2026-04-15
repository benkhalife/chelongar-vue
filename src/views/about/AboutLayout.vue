<template>
  <div dir="rtl" class="min-h-screen bg-gray-100 md:p-8">
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg  relative">
      
      <!-- هدر اپلیکیشن -->
      <div class="bg-indigo-600 text-white text-center py-8 px-4 sticky top-0 z-10">
        <h1 class="text-4xl font-extrabold mb-2">چلونگر</h1>
        <p class="text-indigo-200 text-sm md:text-base">کاهش حجم پیشرفته و افزایش حافظه گوشی</p>
      </div>

      <!-- نوار تب‌ها -->
      <div class="flex border-b border-gray-200 bg-gray-50">
        <router-link 
          to="/about/info" 
          class="flex-1 text-center py-4 font-semibold text-gray-500 hover:text-indigo-600 transition-colors duration-200"
          active-class="border-b-4 border-indigo-600 text-indigo-700 bg-indigo-50">
          درباره ما
        </router-link>
        
        <router-link 
          to="/about/guide" 
          class="flex-1 text-center py-4 font-semibold text-gray-500 hover:text-indigo-600 transition-colors duration-200"
          active-class="border-b-4 border-indigo-600 text-indigo-700 bg-indigo-50">
          آموزش استفاده
        </router-link>

        <router-link 
          to="/about/privacy" 
          class="flex-1 text-center py-4 font-semibold text-gray-500 hover:text-indigo-600 transition-colors duration-200"
          active-class="border-b-4 border-indigo-600 text-indigo-700 bg-indigo-50">
          حریم خصوصی
        </router-link>
      </div>

      <!-- محتوای تب‌ها (فایل‌های فرزند اینجا لود می‌شوند) -->
      <div class="p-6 md:p-8">
        <!-- اضافه کردن انیمیشن ساده برای تغییر تب ها -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
