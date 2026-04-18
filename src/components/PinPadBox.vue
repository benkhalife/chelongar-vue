<template>
  <div class="rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5 relative overflow-hidden">
    <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-50 pointer-events-none"
      :class="isDecoy ? 'bg-orange-50' : 'bg-teal-50'"></div>

    <div class="relative z-10">
      <!-- Header -->
      <div class="flex items-center gap-2 mb-4">
        <div class="w-8 h-8 rounded-xl flex items-center justify-center"
          :class="isDecoy ? 'bg-orange-50' : 'bg-teal-50'">
          <svg class="w-4 h-4" :class="isDecoy ? 'text-orange-500' : 'text-teal-600'"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <div>
          <span class="font-bold text-slate-700">{{ isDecoy ? 'رمز فریب' : 'رمز عبور' }}</span>
          <p v-if="isDecoy" class="text-xs text-orange-400 mt-0.5">
            با این رمز، گالری خالی نمایش داده می‌شود
          </p>
        </div>
      </div>

      <!-- حالت: رمز تنظیم نشده -->
      <div v-if="!hasPin && !showPinPad">
        <div v-if="isDecoy" class="flex items-start gap-2 p-3 rounded-2xl bg-orange-50 border border-orange-100 mb-3">
          <svg class="w-4 h-4 text-orange-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p class="text-xs text-orange-500 leading-relaxed">
            رمز فریب باید با رمز اصلی متفاوت باشد. هنگام ورود با این رمز، گالری خالی به نظر می‌رسد.
          </p>
        </div>
        <div v-else>

          <p class="text-sm text-slate-400 mb-3">هنوز رمز عبوری تنظیم نشده است</p>
          <p class="text-sm text-slate-400 mb-3">برای فعال‌سازی گالری مخفی رمزعبور را تنظیم کنید</p>
        </div>
        <button @click="openPinPad('set')"
          class="w-full py-3 rounded-2xl text-white text-sm font-bold shadow-sm transition-all active:scale-95"
          :class="isDecoy ? 'bg-orange-500 hover:bg-orange-600' : 'bg-teal-600 hover:bg-teal-700'">
          {{ isDecoy ? 'تنظیم رمز فریب' : 'تنظیم رمز عبور' }}
        </button>
      </div>

      <!-- حالت: رمز تنظیم شده -->
      <div v-if="hasPin && !showPinPad" class="flex flex-col gap-3">
        <div class="flex items-center gap-2 py-2 px-3 rounded-2xl border"
          :class="isDecoy ? 'bg-orange-50 border-orange-100' : 'bg-teal-50 border-teal-100'">
          <svg class="w-4 h-4" :class="isDecoy ? 'text-orange-500' : 'text-teal-500'"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm font-semibold" :class="isDecoy ? 'text-orange-700' : 'text-teal-700'">
            {{ isDecoy ? 'رمز فریب فعال است' : 'رمز عبور فعال است' }}
          </span>
          <span class="text-xs mr-auto" :class="isDecoy ? 'text-orange-400' : 'text-teal-400'">● ● ● ●</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button @click="openPinPad('change')"
            class="py-3 rounded-2xl text-white text-sm font-bold shadow-sm transition-all active:scale-95"
            :class="isDecoy ? 'bg-orange-500 hover:bg-orange-600' : 'bg-teal-600 hover:bg-teal-700'">
            تغییر رمز
          </button>
          <button @click="openPinPad('disable')"
            class="py-3 rounded-2xl border-2 border-red-200 bg-red-50 text-red-400 text-sm font-bold transition-all hover:bg-red-100 active:scale-95">
            غیرفعال کردن
          </button>
        </div>
      </div>

      <!-- صفحه کلید پین -->
      <transition name="pin-slide">
        <div v-if="showPinPad" class="mt-2">
          <p class="text-center text-sm font-bold text-slate-600 mb-3">{{ pinStepLabel }}</p>

          <!-- دایره‌های پین -->
          <div class="flex justify-center gap-3 mb-5">
            <div v-for="i in 4" :key="i"
              :class="[
                'w-4 h-4 rounded-full transition-all duration-200',
                i <= currentPin.length
                  ? (pinError ? 'bg-red-400 scale-110' : isDecoy ? 'bg-orange-400 scale-110' : 'bg-teal-500 scale-110')
                  : 'bg-slate-200'
              ]">
            </div>
          </div>

          <p v-if="pinError" class="text-center text-xs text-red-400 mb-3 font-medium">{{ pinError }}</p>

          <!-- کیبورد عددی -->
          <div class="grid grid-cols-3 gap-2 max-w-[260px] mx-auto">
            <button v-for="n in [1,2,3,4,5,6,7,8,9]" :key="n" @click="onPinDigit(n)"
              class="h-14 rounded-2xl bg-slate-50 border border-slate-100 text-xl font-bold text-slate-700 transition-all active:scale-90"
              :class="isDecoy ? 'hover:bg-orange-50 hover:border-orange-200 active:bg-orange-100' : 'hover:bg-teal-50 hover:border-teal-200 active:bg-teal-100'">
              {{ n }}
            </button>

            <button @click="closePinPad"
              class="h-14 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-400 transition-all hover:bg-red-50 hover:border-red-200 active:scale-90 flex items-center justify-center">
              لغو
            </button>

            <button @click="onPinDigit(0)"
              class="h-14 rounded-2xl bg-slate-50 border border-slate-100 text-xl font-bold text-slate-700 transition-all active:scale-90"
              :class="isDecoy ? 'hover:bg-orange-50 hover:border-orange-200 active:bg-orange-100' : 'hover:bg-teal-50 hover:border-teal-200 active:bg-teal-100'">
              ۰
            </button>

            <button @click="onPinBackspace"
              class="h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 transition-all hover:bg-orange-50 hover:border-orange-200 active:scale-90 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
              </svg>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps({
  // کلید ذخیره‌سازی در SharedPreferences
  pinKey: { type: String, required: true },
  // اگر true باشد، رنگ‌بندی و متن‌ها برای رمز فریب تغییر می‌کند
  isDecoy: { type: Boolean, default: false },
  // پین اصلی - برای جلوگیری از تکراری بودن رمز فریب
  mainPin: { type: String, default: '' },
})

const emit = defineEmits(['update:hasPin'])

function getPrefs(key, fallback = '') {
  try { return AndroidPrefs.getString(key, fallback) } catch { return fallback }
}
function setPrefs(key, value) {
  try { AndroidPrefs.setString(key, value) } catch {}
}

const savedPin = getPrefs(props.pinKey, '')
const hasPin = ref(savedPin.length === 4)
const showPinPad = ref(false)
const currentPin = ref('')
const pinError = ref('')
const pinMode = ref('set')
const pinStep = ref(1)
const tempPin = ref('')

const pinStepLabel = computed(() => {
  if (pinMode.value === 'set') {
    return pinStep.value === 1 ? 'رمز ۴ رقمی جدید را وارد کنید' : 'رمز را دوباره وارد کنید (تکرار رمز)'
  }
  if (pinMode.value === 'change') {
    if (pinStep.value === 1) return 'رمز فعلی را وارد کنید'
    if (pinStep.value === 2) return 'رمز ۴ رقمی جدید را وارد کنید'
    return 'رمز جدید را دوباره وارد کنید'
  }
  return props.isDecoy ? 'رمز فریب فعلی را وارد کنید' : 'رمز فعلی را وارد کنید'
})

function openPinPad(mode) {
  pinMode.value = mode
  pinStep.value = 1
  currentPin.value = ''
  tempPin.value = ''
  pinError.value = ''
  showPinPad.value = true
}

function closePinPad() {
  showPinPad.value = false
  currentPin.value = ''
  tempPin.value = ''
  pinError.value = ''
}

function onPinDigit(n) {
  if (currentPin.value.length >= 4) return
  pinError.value = ''
  currentPin.value += String(n)
  if (currentPin.value.length === 4) setTimeout(handlePinComplete, 200)
}

function onPinBackspace() {
  if (currentPin.value.length > 0) {
    currentPin.value = currentPin.value.slice(0, -1)
    pinError.value = ''
  }
}

function handlePinComplete() {
  const entered = currentPin.value
  const saved = getPrefs(props.pinKey, '')

  if (pinMode.value === 'set') {
    if (pinStep.value === 1) {
      // بررسی تکراری نبودن با رمز اصلی (فقط برای رمز فریب)
      if (props.isDecoy && entered === props.mainPin) {
        pinError.value = 'رمز فریب نباید با رمز اصلی یکسان باشد'
        currentPin.value = ''
        return
      }
      tempPin.value = entered
      currentPin.value = ''
      pinStep.value = 2
      return
    }
    if (entered === tempPin.value) {
      setPrefs(props.pinKey, entered)
      hasPin.value = true
      emit('update:hasPin', true)
      closePinPad()
      toast.success(props.isDecoy ? 'رمز فریب تنظیم شد' : 'رمز عبور تنظیم شد')
    } else {
      pinError.value = 'رمزها یکسان نیستند، دوباره تلاش کنید'
      currentPin.value = ''
      tempPin.value = ''
      pinStep.value = 1
    }
    return
  }

  if (pinMode.value === 'change') {
    if (pinStep.value === 1) {
      if (entered === saved) { currentPin.value = ''; pinStep.value = 2 }
      else { pinError.value = 'رمز فعلی اشتباه است'; currentPin.value = '' }
      return
    }
    if (pinStep.value === 2) {
      if (props.isDecoy && entered === props.mainPin) {
        pinError.value = 'رمز فریب نباید با رمز اصلی یکسان باشد'
        currentPin.value = ''
        return
      }
      tempPin.value = entered; currentPin.value = ''; pinStep.value = 3
      return
    }
    if (entered === tempPin.value) {
      setPrefs(props.pinKey, entered)
      closePinPad()
      toast.success(props.isDecoy ? 'رمز فریب تغییر کرد' : 'رمز عبور تغییر کرد')
    } else {
      pinError.value = 'رمزها یکسان نیستند، دوباره تلاش کنید'
      currentPin.value = ''; tempPin.value = ''; pinStep.value = 2
    }
    return
  }

  if (pinMode.value === 'disable') {
    if (entered === saved) {
      setPrefs(props.pinKey, '')
      hasPin.value = false
      emit('update:hasPin', false)
      closePinPad()
      toast.info(props.isDecoy ? 'رمز فریب غیرفعال شد' : 'رمز عبور غیرفعال شد')
    } else {
      pinError.value = 'رمز اشتباه است'
      currentPin.value = ''
    }
  }
}
</script>
