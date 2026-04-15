<script>
import { toPng } from 'html-to-image';

import defpng from '@/assets/images/pback.jpg'

const BACKGROUNDS = [
    { id: 'transparent', label: 'بدون لایه', style: 'bg-transparent', pro: false },
    { id: 'stone', label: 'سنگ', style: 'bg-stone-800/30', pro: false },
    { id: 'dark', label: 'تاریک', style: 'bg-gray-900/70', pro: true },
    { id: 'amber', label: 'کهربا', style: 'bg-amber-900/50', pro: true },
    { id: 'night', label: 'شب', style: 'bg-slate-900/90', pro: true },
    { id: 'day', label: 'روز', style: 'bg-white/90', pro: true },
    { id: 'forest', label: 'جنگل', style: 'bg-emerald-900/50', pro: true },
];


const TEXT_COLORS = [
    { id: 'white', label: 'سفید', value: '#ffffff', pro: false },
    { id: 'black', label: 'تیره', value: '#1a1a1a', pro: false },
    { id: 'gold', label: 'طلایی', value: '#f59e0b', pro: true },
    { id: 'clay', label: 'خاکی', value: '#d6b896', pro: true },
    { id: 'silver', label: 'نقره‌ای', value: '#cbd5e1', pro: true },
    { id: 'red', label: 'قرمز', value: '#ef4444', pro: true },
    { id: 'rose', label: 'گلبهی', value: '#fb7185', pro: true },
    { id: 'orange', label: 'نارنجی', value: '#f97316', pro: true },
    { id: 'yellow', label: 'زرد', value: '#fde047', pro: true },
    { id: 'lime', label: 'لیمویی', value: '#a3e635', pro: true },
    { id: 'green', label: 'سبز', value: '#4ade80', pro: true },
    { id: 'teal', label: 'فیروزه', value: '#2dd4bf', pro: true },
    { id: 'sky', label: 'آسمانی', value: '#38bdf8', pro: true },
    { id: 'blue', label: 'آبی', value: '#60a5fa', pro: true },
    { id: 'indigo', label: 'نیلی', value: '#818cf8', pro: true },
    { id: 'purple', label: 'بنفش', value: '#c084fc', pro: true },
    { id: 'pink', label: 'صورتی', value: '#f472b6', pro: true },
    { id: 'cream', label: 'کرم', value: '#fef3c7', pro: true },
    { id: 'sand', label: 'شنی', value: '#e7d5b3', pro: true },
    { id: 'copper', label: 'مسی', value: '#cb7c4a', pro: true },
];


// نسبت‌های ابعاد کادر
const CANVAS_RATIOS = [
    { id: '4/3', label: '۴:۳', value: 4 / 3, pro: false },
    { id: '1/1', label: '۱:۱', value: 1, pro: true },
    { id: '16/9', label: '۱۶:۹', value: 16 / 9, pro: true },
    { id: '9/16', label: '۹:۱۶', value: 9 / 16, pro: true },
    { id: '3/4', label: '۳:۴', value: 3 / 4, pro: true },
];

export default {
    data() {
        return {
            active: true,
            text: '',
            persianText: '',
            selectedBg: BACKGROUNDS[0],
            selectedColor: TEXT_COLORS[0],
            fontSize: 2.5,
            blur: false,
            showPersian: true,
            textAlign: 'center',
            posX: 50,
            posY: 50,
            freeLimit: 10,
            isSaving: false,
            backgrounds: BACKGROUNDS,
            textColors: TEXT_COLORS,
            canvasRatios: CANVAS_RATIOS,
            activeTab: 'bg',
            limit:0,

            // تصویر پس‌زمینه سفارشی
            customBgUrl: null,       // base64 تصویر انتخابی
            bgOffsetX: 0,            // جابجایی افقی (px)
            bgOffsetY: 0,            // جابجایی عمودی (px)
            bgScale: 1,              // مقیاس تصویر

            // نسبت کادر
            selectedRatio: CANVAS_RATIOS[0],

            // وضعیت drag
            _drag: null,
        };
    },

    computed: {
        textStyle() {
            return {
                fontSize: this.fontSize + 'rem',
                color: this.selectedColor.value,
                position: 'absolute',
                left: this.posX + '%',
                top: this.posY + '%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '90%',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
            };
        },
        textAlignClass() {
            const map = { center: 'text-center', start: 'text-right', end: 'text-left' };
            return map[this.textAlign];
        },
        // استایل تصویر پس‌زمینه با transform
        bgImageStyle() {
            const url = this.customBgUrl || defpng;
            return {
                backgroundImage: `url(${url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transform: `translate(${this.bgOffsetX}px, ${this.bgOffsetY}px) scale(${this.bgScale})`,
                transformOrigin: 'center center',
                width: '100%',
                height: '100%',
            };
        },
        bgImageBlurStyle() {
            const url = this.customBgUrl || defpng;
            return {
                backgroundImage: `url(${url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transform: `translate(${this.bgOffsetX}px, ${this.bgOffsetY}px) scale(${this.bgScale * 1.1})`,
                transformOrigin: 'center center',
                filter: 'blur(8px)',
                width: '100%',
                height: '100%',
            };
        },
        canvasStyle() {
            return {
                aspectRatio: this.selectedRatio.value.toString(),
            };
        },
    },

    mounted() {
        this.text = window.localStorage.getItem('export_text') || '';
        this.persianText = window.localStorage.getItem('export_persian') || '';
        this.limit = JSON.parse(AndroidPrefs.getInt('freeLimit', this.freeLimit)).value
    },

    methods: {
        move(dir) {
            const step = 5;
            if (dir === 'up') this.posY = Math.max(10, this.posY - step);
            if (dir === 'down') this.posY = Math.min(90, this.posY + step);
            if (dir === 'left') this.posX = Math.max(10, this.posX - step);
            if (dir === 'right') this.posX = Math.min(90, this.posX + step);
        },
        isProMode() {
            try {
                return this.isProActive = JSON.parse(window.AndroidPrefs.getBoolean('is_active', false)).value;
            } catch (error) {
                return false;
            }

        },

        pickImage() {



            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'

            input.onchange = (e) => {
                console.log('onchange fired!', e.target.files)  // آیا اصلاً trigger میشه؟
                const file = e.target.files[0]
                if (!file) {
                    console.log('No file selected')
                    return
                }
                console.log('File:', file.name, file.size, file.type)

                const reader = new FileReader()
                reader.onload = (r) => {
                    this.customBgUrl = r.target.result
                }
                reader.onerror = (err) => {
                    console.error('FileReader error:', err)  // اگر خطا داشت
                }
                reader.readAsDataURL(file)
            }

            console.log('Clicking input...')
            input.click()
            console.log('Input clicked')
        },

        // بهینه‌سازی مقیاس اولیه تصویر برای پر کردن کادر
        _fitImageToCanvas(dataUrl) {
            const img = new Image();
            img.onload = () => {
                const canvasEl = this.$refs.canvas?.querySelector('.canvas-inner');
                if (!canvasEl) { this.bgScale = 1; return; }
                const cw = canvasEl.offsetWidth;
                const ch = canvasEl.offsetHeight;
                const scaleX = cw / img.naturalWidth;
                const scaleY = ch / img.naturalHeight;
                // cover: بزرگ‌ترین مقیاس تا کادر پر بشه
                this.bgScale = Math.max(scaleX, scaleY);
            };
            img.src = dataUrl;
        },

        // حذف تصویر سفارشی
        removeBg() {
            this.customBgUrl = null;
            this.bgOffsetX = 0;
            this.bgOffsetY = 0;
            this.bgScale = 1;
        },

        // شروع drag روی پس‌زمینه
        onBgDragStart(e) {
            e.preventDefault();
            const isTouch = e.type === 'touchstart';
            const point = isTouch ? e.touches[0] : e;
            this._drag = {
                startX: point.clientX,
                startY: point.clientY,
                startOffsetX: this.bgOffsetX,
                startOffsetY: this.bgOffsetY,
                startDist: isTouch && e.touches.length === 2
                    ? this._getTouchDist(e.touches)
                    : null,
                startScale: this.bgScale,
            };
        },

        onBgDragMove(e) {
            if (!this._drag) return;
            e.preventDefault();
            const isTouch = e.type === 'touchmove';
            const point = isTouch ? e.touches[0] : e;

            // pan
            const dx = point.clientX - this._drag.startX;
            const dy = point.clientY - this._drag.startY;
            this.bgOffsetX = this._drag.startOffsetX + dx;
            this.bgOffsetY = this._drag.startOffsetY + dy;

            // pinch zoom (دو انگشت)
            if (isTouch && e.touches.length === 2 && this._drag.startDist) {
                const newDist = this._getTouchDist(e.touches);
                const ratio = newDist / this._drag.startDist;
                this.bgScale = Math.max(0.3, Math.min(5, this._drag.startScale * ratio));
            }
        },

        onBgDragEnd() {
            this._drag = null;
        },

        _getTouchDist(touches) {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        },

        // تغییر مقیاس با دکمه
        zoomBg(delta) {
            this.bgScale = Math.max(0.3, Math.min(5, +(this.bgScale + delta).toFixed(2)));
        },

        async saveImage() {

            if (this.isProMode() == false) {
                this.limit = JSON.parse(AndroidPrefs.getInt('freeLimit', this.freeLimit)).value
                console.log('User use free mode ', this.limit);

                this.limit--;

                if (this.limit >= 0) {
                    AndroidPrefs?.setInt('freeLimit', this.limit)
                }

                if (this.limit <= 0) {
                    this.active = false;
                    AndroidTools?.showToast('محدودیت نسخه رایگان', true);
                    return;
                }

            }

            this.isSaving = true;
            try {
                await this.$nextTick();
                const node = this.$refs.canvas;
                const dataUrl = await toPng(node, { pixelRatio: 2 });
                const fileName = 'khate-mikhi-' + Date.now();
                if (window.AndroidTools) {
                    window.AndroidTools.saveBase64Image(dataUrl, fileName);
                } else {
                    const link = document.createElement('a');
                    link.download = fileName + '.png';
                    link.href = dataUrl;
                    link.click();
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.isSaving = false;
            }
        }
    }
};
</script>

<template>
    <main class="min-h-screen bg-[#0f0f13] text-white flex flex-col pb-8">

        <!-- هدر -->
        <div class="flex items-center justify-between px-4 pt-10 pb-4 border-b border-white/5">
            <button @click="$router.back()"
                class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
            </button>
            <span class="text-sm font-semibold tracking-widest text-white/70 uppercase text-right flex-1">ایجاد تصویر
                <span v-if="isProMode() == false">
                    (مخصوص نسخه حرفه‌ای)
                </span>
            </span>
            <div class="w-9"></div>
        </div>

        <div  v-if="isProMode() == false"  dir="rtl" class="text-xs text-center bg-gray-800/70 rounded-xl p-1">برای حذف <span
                class="text-yellow-500 font-bold">واترمارک‌ها و استفاده نا محدود</span> از نسخه حرفه ای
            استفاده کنید</div>

        <!-- پیش‌نمایش -->
        <div ref="canvas" class="px-4 pt-5">
            <div class="canvas-inner relative rounded-md overflow-hidden border border-white/10 shadow-2xl"
                :style="canvasStyle">

                <!-- لایه drag پس‌زمینه -->
                <!-- <div class="absolute inset-0 z-[5] cursor-grab active:cursor-grabbing touch-none"
                    @mousedown="onBgDragStart" @mousemove="onBgDragMove" @mouseup="onBgDragEnd"
                    @mouseleave="onBgDragEnd" @touchstart.passive="onBgDragStart" @touchmove.prevent="onBgDragMove"
                    @touchend="onBgDragEnd">
                </div> -->
                <div v-if="customBgUrl" class="absolute inset-0 z-[40] cursor-grab active:cursor-grabbing touch-none"
                    @mousedown="onBgDragStart" @mousemove="onBgDragMove" @mouseup="onBgDragEnd"
                    @mouseleave="onBgDragEnd" @touchstart.passive="onBgDragStart" @touchmove.prevent="onBgDragMove"
                    @touchend="onBgDragEnd">
                </div>

                <!-- تصویر پس‌زمینه اصلی -->
                <div class="absolute inset-0 z-[10]" :style="bgImageStyle"></div>

                <div v-if="isProMode() == false" class="absolute z-[20] text-center w-full flex">
                    <div class="p-2 bg-gray-500/40 mt-2 rounded-xl mx-auto">نسخه رایگان</div>
                </div>
                <div v-if="isProMode() == false"
                    class="text-white/70 absolute right-0 bottom-5 p-2 text-md text-right w-full flex flex-col gap-3  z-[20]">
                    <div>خط میخی با کیبورد فارسی</div>

                </div>

                <!-- تصویر پس‌زمینه با blur -->
                <div v-if="blur" class="absolute inset-0 z-[12]" :style="bgImageBlurStyle"></div>

                <!-- لایه رنگی -->
                <div class="absolute inset-0 z-[17] transition-all duration-300" :class="selectedBg.style"></div>

                <!-- متن -->
                <div :style="textStyle" :class="textAlignClass" class="z-[30] pointer-events-none">
                    <div v-if="showPersian && persianText" dir="rtl"
                        class="text-md fong-bold opacity-60 mb-2 leading-relaxed"
                        :style="{ color: selectedColor.value }" v-html="persianText">
                    </div>
                    <div v-html="text" class="leading-relaxed"></div>
                </div>
            </div>
        </div>

        <!-- کنترل جهت حرکت متن -->
        <div class="flex justify-center mt-4 px-4">
            <div class="grid grid-cols-3 gap-1.5 w-32">
                <div></div>
                <button @click="move('up')"
                    class="h-9 flex items-center justify-center rounded-xl bg-white/8 hover:bg-amber-500/30 active:bg-amber-500/50 border border-white/10 duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                        stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                </button>
                <div></div>
                <button @click="move('left')"
                    class="h-9 flex items-center justify-center rounded-xl bg-white/8 hover:bg-amber-500/30 active:bg-amber-500/50 border border-white/10 duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                        stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <button @click="posX = 50; posY = 50"
                    class="h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 duration-150 text-white/40 text-xs">
                    ●
                </button>
                <button @click="move('right')"
                    class="h-9 flex items-center justify-center rounded-xl bg-white/8 hover:bg-amber-500/30 active:bg-amber-500/50 border border-white/10 duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                        stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
                <div></div>
                <button @click="move('down')"
                    class="h-9 flex items-center justify-center rounded-xl bg-white/8 hover:bg-amber-500/30 active:bg-amber-500/50 border border-white/10 duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                        stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <div></div>
            </div>
        </div>

        <!-- تب‌های تنظیمات -->
        <div class="px-4 mt-5 flex-1">
            <!-- تب بار -->
            <div class="flex gap-1 bg-white/5 rounded-2xl p-1 mb-4 overflow-x-auto">
                <button
                    v-for="(label, key) in { bg: 'لایه', photo: 'عکس', color: 'رنگ', size: 'سایز', align: 'چینش', fx: 'افکت', canvas: 'کادر' }"
                    :key="key" @click="activeTab = key"
                    class="flex-shrink-0 flex-1 py-2 rounded-xl text-xs font-medium duration-200 min-w-[52px]" :class="activeTab === key
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                        : 'text-white/40 hover:text-white/70'">
                    {{ label }}
                </button>
            </div>

            <!-- محتوای تب‌ها -->
            <div class="bg-white/3 rounded-2xl border border-white/5 p-4">

                <!-- پس‌زمینه -->
                <div v-if="activeTab === 'bg'" class="flex gap-2 flex-wrap justify-center">
                    <button v-for="bg in backgrounds" :key="bg.id" @click="selectedBg = bg"
                        class="px-3 py-2 rounded-xl text-xs font-medium duration-200 border" :class="[
                            bg.style,
                            selectedBg.id === bg.id
                                ? 'border-amber-400 text-white scale-105 shadow-lg'
                                : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                        ]">
                        <span :class="bg.id == 'day' ? 'text-gray-800' : ''">{{ bg.label }}</span>
                    </button>
                </div>

                <!-- عکس پس‌زمینه -->
                <div v-if="activeTab === 'photo'" class="flex flex-col gap-3">
                    <!-- دکمه انتخاب / حذف -->
                    <div class="flex gap-2">
                        <button @click="pickImage"
                            class="flex-1 py-3 rounded-xl text-xs font-medium border border-white/10 hover:border-amber-400/50 text-white/60 hover:text-white duration-200 flex items-center justify-center gap-2">
                            <span class="text-base">🖼️</span>
                            {{ customBgUrl ? 'تغییر عکس' : 'انتخاب از گالری' }}
                        </button>
                        <button v-if="customBgUrl" @click="removeBg"
                            class="px-4 py-3 rounded-xl text-xs font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 duration-200">
                            حذف
                        </button>
                    </div>

                    <!-- کنترل زوم -->
                    <div v-if="customBgUrl" class="flex flex-col gap-2">
                        <div class="flex justify-between text-xs text-white/40">
                            <span>زوم</span>
                            <span class="text-amber-400 font-mono">{{ (bgScale * 100).toFixed(0) }}%</span>
                        </div>
                        <input type="range" min="0.3" max="5" step="0.05" v-model.number="bgScale"
                            class="w-full h-1.5 rounded-full accent-amber-500 cursor-pointer" />
                        <div class="flex gap-2">
                            <button @click="zoomBg(-0.1)"
                                class="flex-1 py-2 rounded-lg text-sm border border-white/10 text-white/50 hover:border-white/30 duration-200">
                                −
                            </button>
                            <button @click="bgScale = 1; bgOffsetX = 0; bgOffsetY = 0"
                                class="flex-1 py-2 rounded-lg text-xs border border-white/10 text-white/40 hover:border-white/30 duration-200">
                                ریست
                            </button>
                            <button @click="zoomBg(0.1)"
                                class="flex-1 py-2 rounded-lg text-sm border border-white/10 text-white/50 hover:border-white/30 duration-200">
                                +
                            </button>
                        </div>
                        <p class="text-xs text-white/30 text-center mt-1">برای جابجایی روی عکس بکشید</p>
                    </div>

                    <div v-if="!customBgUrl" class="text-center text-xs text-white/20 py-2">
                        عکسی انتخاب نشده — از پس‌زمینه پیش‌فرض استفاده می‌شود
                    </div>
                </div>

                <!-- رنگ متن -->
                <div v-if="activeTab === 'color'" class="flex gap-3 flex-wrap items-center justify-center">
                    <button v-for="c in textColors" :key="c.id" @click="selectedColor = c"
                        class="relative w-10 h-10 rounded-full border-2 duration-200 shadow-lg"
                        :style="{ backgroundColor: c.value }" :class="selectedColor.id === c.id
                            ? 'border-amber-400 scale-110 shadow-amber-400/30'
                            : 'border-white/10 hover:border-white/40'">
                        <span v-if="selectedColor.id === c.id"
                            class="absolute inset-0 flex items-center justify-center text-xs"
                            :style="{ color: c.id === 'black' ? '#fff' : '#000' }">✓</span>
                    </button>
                </div>

                <!-- سایز -->
                <div v-if="activeTab === 'size'" class="flex flex-col gap-3">
                    <div class="flex justify-between text-xs text-white/40">
                        <span>کوچک</span>
                        <span class="text-amber-400 font-mono">{{ fontSize.toFixed(1) }}rem</span>
                        <span>بزرگ</span>
                    </div>
                    <input type="range" min="1" max="5" step="0.1" v-model.number="fontSize"
                        class="w-full h-1.5 rounded-full accent-amber-500 cursor-pointer" />
                    <div class="flex gap-2 mt-1">
                        <button v-for="s in [1.5, 2, 2.5, 3, 4]" :key="s" @click="fontSize = s"
                            class="flex-1 py-1.5 rounded-lg text-xs duration-200 border" :class="fontSize === s
                                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                : 'border-white/10 text-white/40 hover:border-white/30'">
                            {{ s }}
                        </button>
                    </div>
                </div>

                <!-- چینش -->
                <div dir="ltr" v-if="activeTab === 'align'" class="flex gap-2">
                    <button v-for="(label, val) in { end: '← چپ', center: '← وسط →', start: 'راست →', }" :key="val"
                        @click="textAlign = val" class="flex-1 py-3 rounded-xl text-xs font-medium duration-200 border"
                        :class="textAlign === val
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'">
                        {{ label }}
                    </button>
                </div>

                <!-- افکت -->
                <div v-if="activeTab === 'fx'" class="flex gap-3">
                    <button @click="blur = !blur"
                        class="flex-1 py-3 rounded-xl text-xs font-medium duration-200 border flex flex-col items-center gap-1"
                        :class="blur
                            ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                            : 'border-white/10 text-white/40 hover:border-white/30'">
                        <span class="text-lg">🌫️</span>
                        {{ blur ? 'بلور: روشن' : 'بلور: خاموش' }}
                    </button>
                    <button @click="showPersian = !showPersian"
                        class="flex-1 py-3 rounded-xl text-xs font-medium duration-200 border flex flex-col items-center gap-1"
                        :class="showPersian
                            ? 'bg-green-500/20 border-green-400 text-green-300'
                            : 'border-white/10 text-white/40 hover:border-white/30'">
                        <span class="text-lg">🔤</span>
                        {{ showPersian ? 'فارسی: نمایش' : 'فارسی: پنهان' }}
                    </button>
                </div>

                <!-- کادر -->
                <div v-if="activeTab === 'canvas'" class="flex flex-col gap-3">
                    <p class="text-xs text-white/40 mb-1">نسبت ابعاد کادر</p>
                    <div class="flex gap-2 flex-wrap">
                        <button v-for="r in canvasRatios" :key="r.id" @click="selectedRatio = r"
                            class="flex-1 py-3 rounded-xl text-xs font-medium duration-200 border min-w-[56px] flex flex-col items-center gap-1"
                            :class="selectedRatio.id === r.id
                                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                : 'border-white/10 text-white/40 hover:border-white/30'">
                            <!-- نمایش بصری نسبت -->
                            <span class="block border border-current opacity-60" :style="{
                                width: r.value >= 1 ? '24px' : Math.round(24 * r.value) + 'px',
                                height: r.value >= 1 ? Math.round(24 / r.value) + 'px' : '24px'
                            }">
                            </span>
                            {{ r.label }}
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <!-- دکمه ذخیره -->
        <div class="px-4 py-5 flex gap-2">
            <button @click="saveImage()" :disabled="isSaving || !text || active == false"
                class="flex-1 py-4 rounded-2xl font-bold text-base duration-200 disabled:opacity-30 relative overflow-hidden"
                :class="isSaving ? 'bg-gray-700' : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95'">
                <span v-if="!isSaving" class="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    ذخیره در گالری <span  v-if="isProMode() == false" class="text-xs">({{ freeLimit }}/{{ 10- limit }})</span>
                </span>
                <span v-else class="flex items-center justify-center gap-2 text-white/70">
                    <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    در حال ذخیره...
                </span>
            </button>

            <router-link v-if="isProMode() == false" class="flex" to="/pro">
                <button class="bg-blue-600 rounded-xl px-2 text-sm hover:blue-700 block">
                    ارتقا به نسخه حرفه‌ای

                </button>
            </router-link>
        </div>

    </main>
</template>

<style scoped>
.bg-white\/3 {
    background-color: rgba(255, 255, 255, 0.03);
}

.bg-white\/8 {
    background-color: rgba(255, 255, 255, 0.08);
}
</style>
