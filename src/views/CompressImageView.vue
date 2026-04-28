<script setup>
import Swal from 'sweetalert2';
import { ref, computed, onMounted, onUnmounted } from 'vue'

const imageData = ref(null)
const compressedData = ref(null)
const status = ref('idle')
const displaySize = ref(0)
const progressPercent = ref(0)
const showSettings = ref(false)

// تنظیمات فشرده‌سازی
const quality = ref(80)
const format = ref('jpg')

// مقادیر استاندارد توان ۲ (مطابق با inSampleSize اندروید)
const scaleOptions = [12.5, 25, 50, 100]
const resolutionIndex = ref(3) // پیش‌فرض روی 100% (ایندکس 3)

const resolutionScale = computed(() => scaleOptions[resolutionIndex.value])

let animationFrameId = null;

const originalDimensions = computed(() => {
    if (!imageData.value) return { width: 0, height: 0 }
    return {
        width: imageData.value.width || 1920,
        height: imageData.value.height || 1080
    }
})

const targetDimensions = computed(() => {
    const scale = resolutionScale.value / 100
    return {
        width: Math.round(originalDimensions.value.width * scale),
        height: Math.round(originalDimensions.value.height * scale)
    }
})

const handleSelectImage = (event) => {
    if (event.detail.success) {
        console.log('handleSelectImage', event.detail);

        imageData.value = event.detail
        resetState()
    }
}

const handleSavedImage = (event) => {
    Swal.fire({
        title: 'عکس در گالری ذخیره شد',
        icon: 'success',
        confirmButtonColor: '#06b6d4',
        background: '#0f172a',
        color: '#fff'
    })
}

const handleCompressFinished = (event) => {
    if (event.detail.success) {
        compressedData.value = event.detail
        finishCompressionAnimation(event.detail.file_size)
    }
}

onMounted(() => {
    window.addEventListener('onSelectImage', handleSelectImage)
    window.addEventListener('onSavedImage', handleSavedImage)
    window.addEventListener('onCompressFinished', handleCompressFinished)
})

onUnmounted(() => {
    window.removeEventListener('onSelectImage', handleSelectImage)
    window.removeEventListener('onSavedImage', handleSavedImage)
    window.removeEventListener('onCompressFinished', handleCompressFinished)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
})

const resetState = () => {
    status.value = 'idle'
    compressedData.value = null
    displaySize.value = imageData.value?.size || 0
    progressPercent.value = 0
    resolutionIndex.value = 3 // تغییر به ایندکس 100%
    quality.value = 80
    format.value = 'jpg'
    showSettings.value = false
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
}

const pickImage = () => {
    if (window.AndroidMedia) window.AndroidMedia.pickImage()
}

const compressImage = () => {
    if (!imageData.value) return;

    status.value = 'compressing'
    displaySize.value = imageData.value.size

    let startTime = performance.now();
    const startSize = imageData.value.size;
    const estimatedTargetSize = startSize * 0.3;

    const animateFakeProgress = (time) => {
        if (status.value !== 'compressing') return;

        let elapsed = time - startTime;
        let duration = 3500;
        let p = Math.min(elapsed / duration, 1);
        let easeOut = 1 - Math.pow(1 - p, 3);

        displaySize.value = startSize - ((startSize - estimatedTargetSize) * easeOut);
        progressPercent.value = easeOut * 70;

        animationFrameId = requestAnimationFrame(animateFakeProgress);
    }

    animationFrameId = requestAnimationFrame(animateFakeProgress);
    // ارسال تنظیمات به اندروید
    const params = {
        quality: quality.value,
        maxWidth: resolutionScale.value < 100 ? targetDimensions.value.width : null,
        maxHeight: resolutionScale.value < 100 ? targetDimensions.value.height : null,
        format: format.value
    }

    console.log('compressCurrentImage:', params);
    // return;

    if (window.AndroidTools) {
        window.AndroidTools.compressCurrentImage(
            params.quality,
            params.maxWidth,
            params.maxHeight,
            params.format
        )
    }
}

const finishCompressionAnimation = (finalSize) => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)

    let startTime = performance.now();
    let currentDisplaySize = displaySize.value;
    let currentProgress = progressPercent.value;

    let originalSize = imageData.value.size;
    let savedRatio = ((originalSize - finalSize) / originalSize) * 100;
    let finalProgress = Math.max(15, savedRatio);

    const animateFinal = (time) => {
        let elapsed = time - startTime;
        let duration = 1200;
        let p = Math.min(elapsed / duration, 1);
        let easeOut = 1 - Math.pow(1 - p, 4);

        displaySize.value = currentDisplaySize - ((currentDisplaySize - finalSize) * easeOut);
        progressPercent.value = currentProgress + ((finalProgress - currentProgress) * easeOut);

        if (p < 1) {
            animationFrameId = requestAnimationFrame(animateFinal);
        } else {
            displaySize.value = finalSize;
            status.value = 'finished'
        }
    }

    animationFrameId = requestAnimationFrame(animateFinal);
}

const saveToGallery = () => {
    if (window.AndroidTools) window.AndroidTools.saveCurrentCompressedImageToGallery()
}

const shareImage = () => {
    if (window.AndroidTools && window.AndroidTools.shareImage) {
        window.AndroidTools.shareImage()
    } else {
        Swal.fire({ title: 'در حال توسعه...', icon: 'info', background: '#0f172a', color: '#fff' })
    }
}

const formatSize = (bytes) => {
    if (!bytes || bytes < 0) return '0 B'
    if (bytes < 1024) return Math.round(bytes) + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const circleCircumference = 2 * Math.PI * 70;
const strokeDashoffset = computed(() => {
    return circleCircumference - (progressPercent.value / 100) * circleCircumference;
})
</script>

<template>
    <div class="min-h-screen bg-slate-950 text-gray-100 font-sans relative overflow-hidden">
        <div
            class="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none">
        </div>
        <div
            class="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none">
        </div>

        <div class="relative z-10 min-h-screen flex flex-col">

            <div class="p-6 pt-12">
                <h1
                    class="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    فشرده‌ساز تصاویر
                </h1>
            </div>

            <div class="flex-1 flex items-center justify-center p-6">
                <div class="w-full max-w-md">
                    <transition name="fade" mode="out-in">
                        <div v-if="!imageData" class="text-center space-y-6">
                            <div
                                class="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center">
                                <svg class="w-16 h-16 text-slate-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                                    </path>
                                </svg>
                            </div>
                            <button @click="pickImage"
                                class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95">
                                انتخاب تصویر
                            </button>
                        </div>

                        <div v-else-if="status === 'idle'" class="space-y-6">
                            <div class="relative  w-fit h-fit mx-auto">
                                <!-- دکمه تنظیمات -->
                                <button @click="showSettings = !showSettings"
                                    class="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-sm border border-slate-700 hover:border-cyan-500/50 rounded-xl p-3 transition-all hover:scale-105 active:scale-95 shadow-lg">
                                    <svg class="w-6 h-6 text-slate-300 hover:text-cyan-400 transition-colors"
                                        :class="{ 'rotate-90': showSettings }" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4">
                                        </path>
                                    </svg>
                                </button>

                                <!-- پنل تنظیمات -->
                                <transition name="slide-down">
                                    <div dir="rtl" v-if="showSettings"
                                        class="absolute top-20 left-4 right-4 z-20 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl">

                                        <!-- فرمت -->
                                        <div class="mb-5">
                                            <label class="text-sm text-slate-400 mb-2 block">فرمت خروجی</label>
                                            <div class="grid grid-cols-3 gap-2">
                                                <button v-for="fmt in ['webp', 'png', 'jpg']" :key="fmt"
                                                    @click="format = fmt"
                                                    class="py-2.5 rounded-xl font-medium transition-all" :class="format === fmt
                                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'">
                                                    {{ fmt.toUpperCase() }}
                                                </button>
                                            </div>
                                        </div>

                                        <!-- کیفیت -->
                                        <div class="mb-5">
                                            <div class="flex justify-between items-center mb-2">
                                                <label class="text-sm text-slate-400">کیفیت</label>
                                                <span class="text-cyan-400 font-bold">{{ quality }}%</span>
                                            </div>
                                            <input type="range" v-model.number="quality" min="10" max="100" step="5"
                                                class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer slider" />
                                        </div>

                                        <!-- رزولوشن -->
                                        <!-- <div>
                                            <div class="flex justify-between items-center mb-2">
                                                <label class="text-sm text-slate-400">رزولوشن</label>
                                                <span dir="ltr" class="text-cyan-400 font-mono text-sm">
                                                    {{ targetDimensions.width }}×{{ targetDimensions.height }}
                                                </span>
                                            </div>
                                            <input type="range" v-model.number="resolutionScale" min="25" max="100"
                                                step="5"
                                                class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer slider" />
                                            <div class="flex justify-between text-xs text-slate-500 mt-1">
                                                <span>25%</span>
                                                <span>{{ resolutionScale }}%</span>
                                                <span>100%</span>
                                            </div>
                                        </div> -->
                                        <div>
                                            <div class="flex justify-between items-center mb-2">
                                                <label class="text-sm text-slate-400">رزولوشن (استاندارد)</label>
                                                <span dir="ltr" class="text-cyan-400 font-mono text-sm">
                                                    {{ targetDimensions.width }}×{{ targetDimensions.height }}
                                                </span>
                                            </div>

                                            <input type="range" v-model.number="resolutionIndex" min="0"
                                                :max="scaleOptions.length - 1" step="1"
                                                class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer slider" />

                                            <div class="flex justify-between text-xs text-slate-500 mt-1">
                                                <span v-for="scale in scaleOptions" :key="scale"
                                                    :class="{ 'text-cyan-400 font-bold': resolutionScale === scale }">
                                                    {{ scale }}%
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </transition>

                                <!-- تصویر -->
                                <div
                                    class="relative rounded-3xl overflow-hidden bg-slate-900/50 border border-slate-800 shadow-2xl">
                                    <img :src="imageData.url" alt="Selected"
                                        class="w-full h-auto max-h-[55vh] object-contain" />
                                    <div
                                        class="bg-gradient-to-t from-slate-900/90 via-slate-900/70 to-transparent p-4 pt-12 absolute bottom-0 w-full z-10">
                                        <div class="flex justify-between items-center text-sm">
                                            <span class="text-slate-400 truncate max-w-[60%]" dir="ltr">{{
                                                imageData.name }}</span>
                                            <span class="text-cyan-400 font-mono font-bold">{{
                                                formatSize(imageData.size) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex gap-3">
                                <button @click="pickImage"
                                    class="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-semibold transition-all hover:scale-[1.02] active:scale-95 border border-slate-700">
                                    تغییر تصویر
                                </button>
                                <button @click="compressImage"
                                    class="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95">
                                    فشرده‌سازی
                                </button>
                            </div>
                        </div>

                        <div v-else class="relative">
                            <div
                                class="absolute inset-0 flex items-center justify-center opacity-10 blur-xl scale-75 pointer-events-none">
                                <img :src="imageData.url" alt="Background" class="max-h-[60vh] object-contain" />
                            </div>

                            <div class="relative flex flex-col items-center justify-center min-h-[70vh] space-y-8">
                                <div class="relative">
                                    <svg class="transform -rotate-90 w-48 h-48" viewBox="0 0 160 160">
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" stroke-width="10"
                                            fill="transparent" class="text-slate-800" />
                                        <g class="">
                                            <circle cx="80" cy="80" r="70" stroke="url(#gradient)" stroke-width="10"
                                                fill="transparent" class="transition-all duration-300 ease-out"
                                                stroke-linecap="round" :stroke-dasharray="circleCircumference"
                                                :stroke-dashoffset="strokeDashoffset" />
                                        </g>
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
                                                <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                                        <div class="text-center space-y-2">
                                            <div class="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                                                dir="ltr">
                                                {{ formatSize(displaySize) }}
                                            </div>
                                            <div class="text-slate-500 text-sm font-medium">
                                                {{ status === 'finished' ? 'حجم نهایی' : 'در حال پردازش...' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <transition name="scale">
                                    <div v-if="status === 'finished'" class="text-center space-y-6">
                                        <div
                                            class="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-6 py-3 rounded-full">
                                            <svg class="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clip-rule="evenodd"></path>
                                            </svg>
                                            <span class="text-cyan-400 font-bold">
                                                {{ ((1 - (compressedData?.file_size / imageData.size)) * 100).toFixed(0)
                                                }}% کاهش حجم
                                            </span>
                                        </div>

                                        <div class="flex gap-3 w-full max-w-sm mx-auto items-end">
                                            <button @click="saveToGallery"
                                                class="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-semibold transition-all hover:scale-[1.02] active:scale-95 border border-slate-700 flex items-center justify-center gap-2">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4">
                                                    </path>
                                                </svg>ذخیره در گالری
                                            </button>
                                        </div>

                                        <div class="grid grid-cols-1 gap-4 w-full">
                                            <!-- <button @click="shareImage"
                                                class="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z">
                                                    </path>
                                                </svg>
                                                اشتراک گزاری
                                            </button> -->

                                            <button @click="pickImage"
                                                class="flex-1 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors bg-gray-500/5 border-2 rounded-xl p-4">
                                                انتخاب تصویر جدید
                                            </button>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scale-enter-active {
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.scale-enter-from {
    opacity: 0;
    transform: scale(0.8);
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}

.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}

.slider::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, #06b6d4, #3b82f6);
    cursor: pointer;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
    transition: all 0.2s;
}

.slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 15px rgba(6, 182, 212, 0.8);
}

.slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, #06b6d4, #3b82f6);
    cursor: pointer;
    border: none;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}
</style>
