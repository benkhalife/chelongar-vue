<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Logo/Title -->
    <div class="mb-8 text-center z-10">
      <h1 class="text-4xl font-bold text-white mb-2">چلونگر</h1>
      <p class="text-gray-400 text-sm">فشرده‌سازی هوشمند تصاویر</p>
    </div>

    <!-- Initial State: Scan Button -->
    <div v-if="state === 'initial'" class="text-center z-10 animate-fade-in">
      <p class="text-gray-300 text-lg mb-6">اسکن گوشی و بررسی فضای گوشی</p>
      <button @click="startScan"
        class="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 active:scale-95">
        شروع اسکن
      </button>
    </div>

    <!-- Scanning State -->
    <div v-if="state === 'scanning'" class="text-center z-10 animate-fade-in">
      <div class="relative">
        <!-- Main Circle -->
        <div
          class="w-72 h-72 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
          <!-- Animated scanning effect -->
          <div class="absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-transparent animate-pulse"></div>

          <div class="relative z-10">
            <h2 class="text-2xl font-bold text-white mb-2">عکس‌های یافت شده</h2>
            <p class="text-5xl font-bold text-emerald-400 animate-count-up">{{ foundImages }}</p>
          </div>
        </div>

        <!-- Scanning animation rings -->
        <div class="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping"></div>
        <div class="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-pulse"></div>
      </div>

      <p class="mt-6 text-gray-400 animate-pulse">در حال جستجو...</p>
    </div>

    <!-- Ready State -->
    <div v-if="state === 'ready'" class="text-center z-10 animate-fade-in">
      <!-- Stats Display -->
      <div class="mb-6 space-y-2">
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl px-6 py-3 border border-gray-700">
          <p class="text-gray-400 text-sm">حجم کل عکس‌ها</p>
          <p class="text-2xl font-bold text-white">{{ totalSize }} مگابایت</p>
        </div>
        <div
          class="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-emerald-500/30">
          <p class="text-emerald-300 text-sm">فضای قابل آزادسازی (تخمینی)</p>
          <p class="text-2xl font-bold text-emerald-400">{{ estimatedSavings }} مگابایت</p>
        </div>
      </div>

      <div class="relative">
        <!-- Main Circle - Clickable -->
        <button @click="startCompression"
          class="w-72 h-72 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-emerald-500 flex flex-col items-center justify-center shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/50 active:scale-95 relative overflow-hidden group">
          <!-- Hover effect -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300">
          </div>

          <div class="relative z-10">
            <div class="mb-4">
              <svg class="w-16 h-16 text-emerald-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5">
                </path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-white mb-1">شروع فشرده‌سازی</h2>
            <p class="text-sm text-gray-400">کلیک کنید</p>
          </div>
        </button>

        <!-- Ready pulse animation -->
        <div class="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-pulse pointer-events-none">
        </div>
      </div>
    </div>

    <!-- Compressing State -->
    <div v-if="state === 'compressing'" class="text-center z-10 animate-fade-in">
      <div class="mb-6">
        <p class="text-gray-300 text-lg mb-2">در حال فشرده‌سازی...</p>
        <p class="text-emerald-400 font-semibold">{{ processedImages }} از {{ totalImages }} عکس</p>
      </div>

      <div class="relative">
        <!-- Progress Circle -->
        <svg class="w-72 h-72 transform -rotate-90" viewBox="0 0 200 200">
          <!-- Background circle -->
          <circle cx="100" cy="100" r="90" stroke="currentColor" stroke-width="8" fill="none" class="text-gray-700" />
          <!-- Progress circle -->
          <circle cx="100" cy="100" r="90" stroke="currentColor" stroke-width="8" fill="none"
            class="text-emerald-500 transition-all duration-300" :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset" stroke-linecap="round" />
        </svg>

        <!-- Center Content -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div
            class="w-56 h-56 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 flex flex-col items-center justify-center">
            <h2 class="text-xl font-bold text-white mb-2">پیشرفت</h2>
            <p class="text-5xl font-bold text-emerald-400">{{ progress }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Completed State -->
    <div v-if="state === 'completed'" class="text-center z-10 animate-fade-in">
      <div class="mb-6">
        <div
          class="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-once">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">عملیات موفق!</h2>
        <p class="text-gray-400">فشرده‌سازی با موفقیت انجام شد</p>
      </div>

      <div
        class="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl px-8 py-6 border border-emerald-500/30 mb-6">
        <p class="text-emerald-300 text-sm mb-2">فضای آزاد شده</p>
        <p class="text-4xl font-bold text-emerald-400">{{ actualSavings }} مگابایت</p>
      </div>

      <button @click="reset"
        class="px-8 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300">
        اسکن مجدد
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const state = ref('initial') // initial, scanning, ready, compressing, completed
const foundImages = ref(0)
const totalImages = ref(0)
const totalSize = ref(0)
const estimatedSavings = ref(0)
const processedImages = ref(0)
const progress = ref(0)
const actualSavings = ref(0)

const circumference = 2 * Math.PI * 90
const progressOffset = computed(() => {
  return circumference - (progress.value / 100) * circumference
})

const startScan = () => {
  state.value = 'scanning'
  foundImages.value = 0
  foundImages.value = AndroidTools.scanAllImages()

  // Simulate scanning
  const scanInterval = setInterval(() => {
    foundImages.value = AndroidTools.getRealtimeScanerCounter()
  }, 100)

  addEventListener('scanAllImagesFinished', () => {
    console.log('scanAllImagesFinished');
    

    totalImages.value = foundImages.value
    const sss = AndroidTools.getFileSizeFormated()
    let size = sss.replace(' MB', '')
    size = size.replace(' KB', '')
    totalSize.value = Math.floor(size)
    estimatedSavings.value = Math.floor(size * 0.4) // 40% compression estimate

    clearInterval(scanInterval)

    setTimeout(() => {
      state.value = 'ready'
    }, 500)
  })

}

const startCompression = () => {
  state.value = 'compressing'
  processedImages.value = 0
  progress.value = 0

  // Simulate compression
  const compressionInterval = setInterval(() => {
    const increment = Math.floor(Math.random() * 8) + 3
    processedImages.value = Math.min(processedImages.value + increment, totalImages.value)
    progress.value = Math.floor((processedImages.value / totalImages.value) * 100)

    if (processedImages.value >= totalImages.value) {
      clearInterval(compressionInterval)
      progress.value = 100
      actualSavings.value = Math.floor(estimatedSavings.value * (0.9 + Math.random() * 0.2)) // 90-110% of estimate

      setTimeout(() => {
        state.value = 'completed'
      }, 500)
    }
  }, 150)
}

const reset = () => {
  state.value = 'initial'
  foundImages.value = 0
  totalImages.value = 0
  totalSize.value = 0
  estimatedSavings.value = 0
  processedImages.value = 0
  progress.value = 0
  actualSavings.value = 0
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-once {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-bounce-once {
  animation: bounce-once 0.6s ease-out;
}

.animate-count-up {
  animation: fade-in 0.3s ease-out;
}
</style>
