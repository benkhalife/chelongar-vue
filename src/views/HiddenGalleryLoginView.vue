<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 flex flex-col items-center justify-center p-6"
    dir="rtl">

    <!-- لوگو / آیکن گالری -->
    <div class="mb-8 flex flex-col items-center gap-3">
      <div class="w-20 h-20 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center">
        <svg class="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M4.5 3v18M19.5 3v18" />
        </svg>
      </div>
      <div class="text-center">
        <h1 class="text-xl font-bold text-slate-700">گالری خصوصی</h1>
        <p class="text-sm text-slate-400 mt-1">رمز عبور خود را وارد کنید</p>
      </div>
    </div>

    <!-- کارت اصلی -->
    <div class="w-full max-w-sm bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-6">

      <!-- دایره‌های پین -->
      <div class="flex justify-center gap-4 mb-6">
        <div v-for="i in 4" :key="i" :class="[
          'w-5 h-5 rounded-full transition-all duration-200',
          i <= currentPin.length
            ? (pinError ? 'bg-red-400 scale-110' : 'bg-teal-500 scale-110')
            : 'bg-slate-200'
        ]">
        </div>
      </div>

      <!-- پیام خطا -->
      <p v-if="pinError" class="text-center text-sm text-red-400 mb-4 font-medium">{{ pinError }}</p>
      <div v-else class="mb-4 h-5"></div>

      <!-- کیبورد عددی -->
      <div class="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
        <button v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="n" @click="onDigit(n)" class="h-16 rounded-2xl bg-slate-50 border border-slate-100 text-2xl font-bold text-slate-700
                 transition-all active:scale-90 hover:bg-teal-50 hover:border-teal-200 active:bg-teal-100">
          {{ n }}
        </button>

        <!-- دکمه خالی (placeholder) -->
        <div></div>

        <button @click="onDigit(0)" class="h-16 rounded-2xl bg-slate-50 border border-slate-100 text-2xl font-bold text-slate-700
                 transition-all active:scale-90 hover:bg-teal-50 hover:border-teal-200 active:bg-teal-100">
          ۰
        </button>

        <!-- بک‌اسپیس -->
        <button @click="onBackspace"
          class="h-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400
                 transition-all active:scale-90 hover:bg-orange-50 hover:border-orange-200 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- تعداد تلاش‌های باقی‌مانده -->
    <p v-if="attemptsLeft < 5" class="mt-4 text-xs text-slate-400">
      {{ attemptsLeft }} تلاش باقی‌مانده
    </p>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const MAX_ATTEMPTS = 5

const currentPin = ref('')
const pinError = ref('')
const attemptsLeft = ref(MAX_ATTEMPTS)


function onDigit(n) {
  if (currentPin.value.length >= 4) return
  pinError.value = ''
  currentPin.value += String(n)
  if (currentPin.value.length === 4) setTimeout(checkPin, 200)
}

function onBackspace() {
  if (currentPin.value.length > 0) {
    currentPin.value = currentPin.value.slice(0, -1)
    pinError.value = ''
  }
}

function checkPin() {
  const entered = currentPin.value
  console.log('checkPin', entered);
  
  const resultJson = window.HiddenGallery.checkPin(entered)
  const result = JSON.parse(resultJson)
  console.log('checkPin:result', result);

  switch (result.status) {
    case 'success':
      router.replace({ name: 'hg-home' })
      break

    case 'decoy':
      router.replace({ name: 'hg-home', query: { decoy: '1' } })
      break

    case 'wrong':
      currentPin.value = ''
      if (result.remaining === -1) {
        pinError.value = 'رمز اشتباه است'
      } else {
        pinError.value = `رمز اشتباه است (${result.remaining} تلاش باقی‌مانده)`
      }
      break

    case 'locked':
      currentPin.value = ''
      pinError.value = `گالری قفل شد. ${result.remaining} دقیقه صبر کنید`
      break
  }
}


// function checkPin() {
//   const mainPin = getPrefs('gallery_pin', '')
//   const decoyPin = getPrefs('gallery_decoy_pin', '')
//   const entered = currentPin.value

//   // رمز فریب - هدایت به گالری خالی
//   if (decoyPin.length === 4 && entered === decoyPin) {
//     router.replace({ name: 'hg-home', query: { decoy: '1' } })
//     return
//   }

//   // رمز اصلی - ورود عادی
//   if (entered === mainPin) {
//     router.replace({ name: 'hg-home' })
//     return
//   }

//   // رمز اشتباه
//   attemptsLeft.value--
//   currentPin.value = ''

//   if (attemptsLeft.value <= 0) {
//     pinError.value = 'تعداد تلاش‌ها به پایان رسید'
//     // می‌توانی اینجا اپ را ببندی یا به صفحه دیگری هدایت کنی
//     // try { AndroidApp.close() } catch {}
//     return
//   }

//   pinError.value = 'رمز اشتباه است'
// }
</script>
