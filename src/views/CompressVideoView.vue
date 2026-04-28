<script setup>
import Swal from 'sweetalert2';
import { ref, computed, onMounted, onUnmounted } from 'vue'

const videoData = ref(null)
const compressedData = ref(null)
const status = ref('idle')
const displaySize = ref(0)
const progressPercent = ref(0)
const autoReduceResolution = ref(false)

let animationFrameId = null;

const handleSelectVideo = (event) => {
    if (event.detail.success) {
        videoData.value = event.detail
        resetState()
    }
}

const handleSavedVideo = (event) => {
    Swal.fire({
        title: 'ویدیو در گالری ذخیره شد',
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
    else{
        resetState()
        Swal.fire({
            text:'متاسفانه هنگام فشرده سازی مشکلی روی داده است دوباره تلاش کنید و یا یک ویدیو دیگر را امتحان کنید',
            icon:'warning',
            showCancelButton:true,
            cancelButtonText:'بستن'
        })

    }
}

onMounted(() => {
    window.addEventListener('onSelectVideo', handleSelectVideo)
    window.addEventListener('onSavedVideo', handleSavedVideo)
    window.addEventListener('onCompressFinished', handleCompressFinished)
})

onUnmounted(() => {
    if (window.AndroidTools) window.AndroidTools.unmounted()
    window.removeEventListener('onSelectVideo', handleSelectVideo)
    window.removeEventListener('onSavedVideo', handleSavedVideo)
    window.removeEventListener('onCompressFinished', handleCompressFinished)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
})

const resetState = () => {
    status.value = 'idle'
    compressedData.value = null
    displaySize.value = videoData.value?.size || 0
    progressPercent.value = 0
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
}

const pickVideo = () => {
    if (window.AndroidMedia) window.AndroidMedia.pickVideo()
}

// تابع جدید برای تخمین زمان فشرده‌سازی (بر حسب میلی‌ثانیه)
const estimateCompressionTime = (video) => {
    const { duration, resolution, size } = video;
    let width = 1920, height = 1080;

    if (resolution && resolution.includes('x')) {
        const parts = resolution.split('x').map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            width = parts[0];
            height = parts[1];
        }
    }

    const totalPixels = width * height;
    const base1080pPixels = 1920 * 1080;
    const pixelRatio = totalPixels / base1080pPixels;

    const sizeInMB = size / (1024 * 1024);
    const sizeFactor = Math.min(sizeInMB / 100, 0.5);

    let estimateMs = duration * pixelRatio * 1.5 * (1 + sizeFactor);

    // ضریب بدبینانه: 1.5 برابر تخمین قبلی
    estimateMs *= 1.5;

    return Math.max(3000, Math.min(estimateMs, 270000)); // حداکثر 4.5 دقیقه
}

const compressVideo = () => {
    if (!videoData.value) return;

    status.value = 'compressing'
    displaySize.value = videoData.value.size
    progressPercent.value = 0

    const estimatedTimeMs = estimateCompressionTime(videoData.value);
    const startTime = performance.now();
    const startSize = videoData.value.size;

    const animateFakeProgress = (time) => {
        if (status.value !== 'compressing') return;

        let elapsed = time - startTime;

        if (elapsed <= estimatedTimeMs) {
            // فاز اول: حرکت تا 15% در طول زمان تخمینی
            let p = elapsed / estimatedTimeMs;
            let easeOut = 1 - Math.pow(1 - p, 2);
            progressPercent.value = easeOut * 15;
        } else {
            // فاز دوم: از 15% به 25% با سرعت کاهنده
            let currentProgress = progressPercent.value;
            let targetProgress = 25;
            let remainingProgress = targetProgress - currentProgress;
            
            // هرچه به 25 نزدیک‌تر می‌شویم، سرعت کمتر می‌شود
            // با استفاده از ضریب کاهنده که با نزدیک شدن به هدف کوچک‌تر می‌شود
            let distanceFromTarget = targetProgress - currentProgress;
            let slowdownFactor = Math.pow(distanceFromTarget / 10, 1.5); // هرچه فاصله کمتر، ضریب کوچک‌تر
            let increment = remainingProgress * 0.0005 * Math.max(slowdownFactor, 0.1);
            
            progressPercent.value += increment;
            progressPercent.value = Math.min(progressPercent.value, 24.9); // هرگز به 25 نمی‌رسد
        }

        // کاهش تدریجی حجم نمایشی
        let reductionFactor = progressPercent.value / 100;
        displaySize.value = startSize - (startSize * reductionFactor * 0.6);

        animationFrameId = requestAnimationFrame(animateFakeProgress);
    }

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(animateFakeProgress);

    if (window.AndroidTools) window.AndroidTools.compressCurrentVideo(autoReduceResolution.value)
}

const finishCompressionAnimation = (finalSize) => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)

    let startTime = performance.now();
    let currentDisplaySize = displaySize.value;
    let currentProgress = progressPercent.value;

    let originalSize = videoData.value.size;

    // محاسبه درصد واقعی کاهش حجم برای رساندن پروگرس بار به آن نقطه
    let savedRatio = ((originalSize - finalSize) / originalSize) * 100;
    // حداقل روی 15 درصد قرار میدهیم تا اگر حجم کم نشد، ظاهر بدی نداشته باشد
    let finalProgressTarget = Math.max(15, savedRatio);

    const animateFinal = (time) => {
        let elapsed = time - startTime;
        let duration = 2000; // دقیقا 2 ثانیه طبق درخواست شما
        let p = Math.min(elapsed / duration, 1);
        let easeOut = 1 - Math.pow(1 - p, 3); // حرکت نرم و جذاب

        displaySize.value = currentDisplaySize - ((currentDisplaySize - finalSize) * easeOut);

        // حرکت پروگرس بار از جایگاه فعلی (مثلا 32%) به جایگاه واقعی (مثلا 65%)
        progressPercent.value = currentProgress + ((finalProgressTarget - currentProgress) * easeOut);

        if (p < 1) {
            animationFrameId = requestAnimationFrame(animateFinal);
        } else {
            displaySize.value = finalSize;
            progressPercent.value = finalProgressTarget;
            status.value = 'finished';
        }
    }

    animationFrameId = requestAnimationFrame(animateFinal);
}

const saveToGallery = () => {
    if (window.AndroidTools) window.AndroidTools.saveCurrentCompressedVideoToGallery()
}

const shareVideo = () => {
    if (window.AndroidTools && window.AndroidTools.shareVideo) {
        window.AndroidTools.shareVideo()
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
    // جلوگیری از مقادیر غیرمجاز
    const safeProgress = Math.min(Math.max(progressPercent.value, 0), 100);
    return circleCircumference - (safeProgress / 100) * circleCircumference;
})
</script>


<template>
    <div class="min-h-screen bg-slate-950 text-gray-100 relative overflow-hidden">
        <div
            class="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none">
        </div>
        <div
            class="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none">
        </div>

        <div class="relative z-10 min-h-screen flex flex-col">

            <div class=" pt-12">
                <h1
                    class="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    فشرده‌ساز ویدیو
                </h1>
            </div>

            <div class="flex-1 flex items-center pt-4 justify-center px-6">
                <div class="w-full max-w-md">
                    <transition name="fade" mode="out-in">
                        <div v-if="!videoData" class="text-center space-y-6">
                            <div
                                class="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center">
                                <svg class="w-16 h-16 text-slate-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
                                    </path>
                                </svg>
                            </div>
                            <button @click="pickVideo"
                                class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95">
                                انتخاب ویدیو
                            </button>
                        </div>

                        <div v-else-if="status === 'idle'" class="space-y-6">
                            <!-- بخش جدید: چک‌باکس (Toggle) کاهش رزولوشن -->
                            <label dir="rtl"
                                class="flex items-center justify-between p-4 rounded-3xl bg-slate-900/80 border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors shadow-sm mt-2">
                                <div class="flex flex-col pl-4">
                                    <span class="text-[15px] font-bold text-slate-100">کاهش رزولوشن خودکار</span>
                                    <span class="text-[11px] text-slate-400 mt-1">بهینه‌سازی ابعاد ویدیو برای پخش در
                                        موبایل</span>
                                </div>

                                <!-- دکمه سوییچ راست‌چین (RTL) -->
                                <div class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="autoReduceResolution" class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-700 rounded-full peer 
                                        peer-checked:after:-translate-x-5 peer-checked:after:border-white 
                                        after:content-[''] after:absolute after:top-[2px] after:right-[2px] 
                                        after:bg-white after:border-gray-300 after:border after:rounded-full 
                                        after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500">
                                    </div>
                                </div>
                            </label>
                            <!-- پایان بخش جدید -->

                            <div
                                class="relative rounded-3xl overflow-hidden bg-slate-900/50 border border-slate-800 shadow-2xl">
                                <video :src="videoData.url" controls preload="metadata" playsinline
                                    crossorigin="anonymous"
                                    class="w-full h-auto max-h-[50vh] object-contain bg-black"></video>
                                <div
                                    class="absolute top-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent p-4 pt-4">
                                    <div class="flex justify-between items-center text-sm">
                                        <span class="text-slate-400 truncate max-w-[60%]" dir="ltr">{{ videoData.name
                                        }}</span>
                                        <span class="text-cyan-400 font-mono font-bold">{{ formatSize(videoData.size)
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-3">
                                <button @click="pickVideo"
                                    class="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-semibold transition-all hover:scale-[1.02] active:scale-95 border border-slate-700">
                                    تغییر ویدیو
                                </button>
                                <button @click="compressVideo"
                                    class="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95">
                                    فشرده‌سازی
                                </button>
                            </div>
                        </div>

                        <div v-else class="relative">

                            <div class="relative flex flex-col items-center justify-center min-h-[70vh] space-y-8">

                                <div class="relative">
                                    <svg class="transform -rotate-90 w-56 h-56" viewBox="0 0 160 160">
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
                                                {{ ((1 - (compressedData?.file_size / videoData.size)) * 100).toFixed(0)
                                                }}% کاهش حجم
                                            </span>
                                        </div>

                                        <div class="flex gap-3 w-full max-w-sm mx-auto items-end">
                                            <div class="w-full">
                                                <div class="flex gap-2 items-center w-full mt-2">
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
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-1 gap-4 w-full">
                                            <!-- <button @click="shareVideo"
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

                                            <button @click="pickVideo"
                                                class="flex-1 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors bg-gray-500/5 border-2 rounded-xl p-4">
                                                انتخاب ویدیو جدید
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
</style>
