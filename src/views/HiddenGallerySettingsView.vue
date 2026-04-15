<template>
    <div style="background-color: rgb(208 211 215);" class="min-h-screen text-slate-800 overflow-hidden relative"
        dir="rtl">
        <!-- Background blobs -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            <div class="absolute -top-32 -right-32 w-96 h-96 bg-teal-100 rounded-full blur-3xl"></div>
            <div class="absolute top-1/2 -left-40 w-80 h-80 bg-cyan-100 rounded-full blur-3xl"></div>
        </div>

        <div class="relative z-10 flex flex-col min-h-screen px-5 pt-12 pb-24">

            <!-- Header -->
            <div class="mb-6 flex items-center gap-3">
                <button @click="onBack"
                    class="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-teal-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </button>
                <div>
                    <h1 class="text-2xl font-black text-slate-800 tracking-tight">تنظیمات گالری</h1>
                    <p class="text-xs text-slate-500 font-medium mt-0.5">شخصی‌سازی گالری مخفی</p>
                </div>
            </div>

            <!-- Section: PIN Code -->
            <!-- Section: PIN Code -->
            <PinPadBox pin-key="gallery_pin" class="mb-4"
                @update:has-pin="val => mainPin = val ? getPrefs('gallery_pin', '') : ''" />

            <!-- Section: Decoy PIN - فقط وقتی رمز فریب فعال است نمایش داده می‌شود -->
            <PinPadBox v-if="enableDecoyPassword" pin-key="gallery_decoy_pin" :is-decoy="true" :main-pin="mainPin"
                class="mb-4" />


            <!-- Section: App Icon -->
            <div
                class="mb-4 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5 relative overflow-hidden">
                <div
                    class="absolute -left-6 -bottom-6 w-24 h-24 bg-cyan-50 rounded-full opacity-50 pointer-events-none">
                </div>
                <div class="relative z-10">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center">
                            <svg class="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                            </svg>
                        </div>
                        <span class="font-bold text-slate-700">آیکن ورود به گالری</span>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <button v-for="icon in iconOptions" :key="icon.value" @click="selectedIcon = icon.value" :class="[
                            'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all',
                            selectedIcon === icon.value
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                        ]">
                            <div
                                :class="['w-10 h-10 rounded-xl flex items-center justify-center', selectedIcon === icon.value ? 'bg-teal-100' : 'bg-white']">
                                <svg v-if="icon.value === 'notification'" class="w-5 h-5"
                                    :class="selectedIcon === icon.value ? 'text-teal-600' : 'text-slate-400'"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                                <svg v-if="icon.value === 'exit'" class="w-5 h-5"
                                    :class="selectedIcon === icon.value ? 'text-teal-600' : 'text-slate-400'"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                </svg>
                                <svg v-if="icon.value === 'incognito'" class="w-5 h-5"
                                    :class="selectedIcon === icon.value ? 'text-teal-600' : 'text-slate-400'"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
                                </svg>
                            </div>
                            <span class="text-xs font-semibold"
                                :class="selectedIcon === icon.value ? 'text-teal-600' : 'text-slate-400'">
                                {{ icon.label }}
                            </span>
                        </button>
                    </div>

                    <button @click="saveIcon"
                        class="mt-4 w-full py-3 rounded-2xl bg-teal-600 text-white text-sm font-bold shadow-sm transition-all hover:bg-teal-700 active:scale-95">
                        ذخیره آیکن
                    </button>
                </div>
            </div>

            <!-- Section: Visibility -->
            <div class="mb-4 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center">
                        <svg class="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                    </div>
                    <span class="font-bold text-slate-700">نمایش و دسترسی</span>
                </div>

                <div class="flex flex-col gap-3">
                    <div class="flex items-center justify-between py-3 border-b border-slate-50">
                        <div>
                            <p class="text-sm font-semibold text-slate-700">مخفی کردن دکمه گالری</p>
                            <p class="text-xs text-slate-400 mt-0.5">دکمه گالری در صفحه اصلی نمایش داده نشود</p>
                        </div>
                        <button @click="toggleHideButton" :class="[
                            'relative w-12 h-6 rounded-full transition-all duration-300',
                            hideGalleryButton ? 'bg-teal-500' : 'bg-slate-200'
                        ]">
                            <span :class="[
                                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300',
                                hideGalleryButton ? 'right-0.5' : 'left-0.5'
                            ]"></span>
                        </button>
                    </div>

                    <div class="flex items-center justify-between py-3 border-b border-slate-50">
                        <div>
                            <p class="text-sm font-semibold text-slate-700">رمز فریب</p>
                            <p class="text-xs text-slate-400 mt-0.5">با رمز دوم، گالری خالی یا جعلی نمایش داده شود</p>
                        </div>
                        <button @click="toggleDecoyPassword" :class="[
                            'relative w-12 h-6 rounded-full transition-all duration-300',
                            enableDecoyPassword ? 'bg-teal-500' : 'bg-slate-200'
                        ]">
                            <span :class="[
                                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300',
                                enableDecoyPassword ? 'right-0.5' : 'left-0.5'
                            ]"></span>
                        </button>
                    </div>

                    <div class="flex items-center justify-between py-3">
                        <div>
                            <p class="text-sm font-semibold text-slate-700">قفل پس از تلاش ناموفق</p>
                            <p class="text-xs text-slate-400 mt-0.5">پس از ۵ بار رمز اشتباه، گالری موقتاً قفل شود</p>
                        </div>
                        <button @click="toggleFailedAttemptsLock" :class="[
                            'relative w-12 h-6 rounded-full transition-all duration-300',
                            failedAttemptsLock ? 'bg-teal-500' : 'bg-slate-200'
                        ]">
                            <span :class="[
                                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300',
                                failedAttemptsLock ? 'right-0.5' : 'left-0.5'
                            ]"></span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Section: Danger Zone -->
            <div class="mb-4 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-50 p-5">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                        <svg class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <span class="font-bold text-red-400">منطقه خطر</span>
                </div>

                <button @click="confirmClearGallery"
                    class="w-full py-3 rounded-2xl border-2 border-red-100 bg-red-50 text-red-400 text-sm font-bold transition-all hover:bg-red-100 active:scale-95">
                    پاک کردن تمام فایل‌های گالری
                </button>
            </div>

            <!-- Toast notification -->
            <transition name="toast">
                <div v-if="toastMessage"
                    class="fixed bottom-28 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-lg z-50 whitespace-nowrap">
                    {{ toastMessage }}
                </div>
            </transition>

        </div>
    </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'

import PinPadBox from '@/components/PinPadBox.vue'

// پین اصلی برای پاس دادن به کامپوننت رمز فریب
const mainPin = ref('')

// ─── Emit ────────────────────────────────────────────────
const emit = defineEmits(['back'])


// ─── State: Other ────────────────────────────────────────
const selectedIcon = ref('notification')
const hideGalleryButton = ref(false)
const enableDecoyPassword = ref(false)
const failedAttemptsLock = ref(false)
// const toastMessage = ref('')

const iconOptions = [
    { value: 'notification', label: 'نوتیفیکیشن' },
    { value: 'exit', label: 'خروج' },
    { value: 'incognito', label: 'ناشناس' },
]


// ─── Helpers ─────────────────────────────────────────────
function getPrefs(key, fallback = '') {
    try { return AndroidPrefs.getString(key, fallback) }
    catch { return fallback }
}

function setPrefs(key, value) {
    try { AndroidPrefs.setString(key, value) } catch { }
}


// ─── Lifecycle ───────────────────────────────────────────
onMounted(() => {
    mainPin.value = getPrefs('gallery_pin', '')

    const savedPin = getPrefs('gallery_pin', '')

    selectedIcon.value = getPrefs('gallery_icon', 'notification')
    hideGalleryButton.value = getPrefs('gallery_hide_button', 'false') === 'true'
    enableDecoyPassword.value = getPrefs('gallery_decoy_enabled', 'false') === 'true'
    failedAttemptsLock.value = getPrefs('gallery_failed_lock', 'false') === 'true'
})



// ─── Actions ─────────────────────────────────────────────
function onBack() {
    emit('back')
}

function saveIcon() {
    setPrefs('gallery_icon', selectedIcon.value)
    toast.success('آیکن ذخیره شد')
}

function toggleHideButton() {
    hideGalleryButton.value = !hideGalleryButton.value
    setPrefs('gallery_hide_button', hideGalleryButton.value ? 'true' : 'false')
    toast.info(hideGalleryButton.value ? 'دکمه گالری مخفی شد' : 'دکمه گالری نمایش داده می‌شود')
}

function toggleDecoyPassword() {
    enableDecoyPassword.value = !enableDecoyPassword.value
    setPrefs('gallery_decoy_enabled', enableDecoyPassword.value ? 'true' : 'false')
}

function toggleFailedAttemptsLock() {
    failedAttemptsLock.value = !failedAttemptsLock.value
    setPrefs('gallery_failed_lock', failedAttemptsLock.value ? 'true' : 'false')
    toast.info(failedAttemptsLock.value ? 'قفل پس از تلاش ناموفق فعال شد' : 'غیرفعال شد')
}

function clearGalleryFiles() {
    try {
        AndroidGallery.clearAll()
        // reset prefs...
        toast.success('تمام فایل‌ها حذف شدند')
    } catch {
        toast.error('خطا در حذف فایل‌ها')
    }
}



function confirmClearGallery() {
    try {
        AndroidDialog.confirm(
            'حذف فایل‌ها',
            'تمام فایل‌های گالری مخفی حذف خواهند شد. ادامه می‌دهید؟',
            'حذف',
            'انصراف'
        )
        window.onClearGalleryConfirmed = function () {
            clearGalleryFiles()
        }
    } catch {
        if (confirm('تمام فایل‌های گالری مخفی حذف خواهند شد. ادامه می‌دهید؟')) {
            clearGalleryFiles()
        }
    }
}

</script>
