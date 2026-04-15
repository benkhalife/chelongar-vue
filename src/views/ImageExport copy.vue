<!-- <script setup>
</script> -->

<script>
import { toPng } from 'html-to-image';

const BACKGROUNDS = [
    { id: 'transparent', label: 'بدون لایه', style: 'bg-transparent' },
    { id: 'stone', label: 'سنگ', style: 'bg-stone-800/30' },
    { id: 'dark', label: 'تاریک', style: 'bg-gray-900/70' },
    { id: 'amber', label: 'کهربا', style: 'bg-amber-900/50' },
    { id: 'clay', label: 'گِل', style: 'bg-orange-900/50' },
    { id: 'night', label: 'شب', style: 'bg-slate-900/90' },
    { id: 'forest', label: 'جنگل', style: 'bg-emerald-900/50' },
];

const TEXT_COLORS = [
    { id: 'white', label: 'سفید', value: '#ffffff' },
    { id: 'gold', label: 'طلایی', value: '#f59e0b' },
    { id: 'clay', label: 'خاکی', value: '#d6b896' },
    { id: 'silver', label: 'نقره‌ای', value: '#cbd5e1' },
    { id: 'red', label: 'قرمز', value: '#ef4444' },
    { id: 'black', label: 'تیره', value: '#1a1a1a' },
];

export default {
    data() {
        return {
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
            isSaving: false,
            backgrounds: BACKGROUNDS,
            textColors: TEXT_COLORS,
            activeTab: 'bg', // bg | color | size | align | fx
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
        }
    },

    mounted() {
        this.text = window.localStorage.getItem('export_text') || '';
        this.persianText = window.localStorage.getItem('export_persian') || '';
    },

    methods: {
        move(dir) {
            const step = 5;
            if (dir === 'up') this.posY = Math.max(10, this.posY - step);
            if (dir === 'down') this.posY = Math.min(90, this.posY + step);
            if (dir === 'left') this.posX = Math.max(10, this.posX - step);
            if (dir === 'right') this.posX = Math.min(90, this.posX + step);
        },

        async saveImage() {

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
            <span class="text-sm font-semibold tracking-widest text-white/70 uppercase">Image Export</span>
            <div class="w-9"></div>
        </div>

        <!-- پیش‌نمایش -->
        <!-- <div ref="canvas" class="px-4 pt-5">
            <div class="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                style="aspect-ratio:4/3;">
                <div class="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
                    style="background-image: url(/img/pback.jpg)"></div>
                <div class="absolute inset-0 z-20 transition-all duration-300"
                    :class="[selectedBg.style, blur ? 'backdrop-blur-sm' : '']"></div>
                <div :style="textStyle" :class="textAlignClass" class="z-30">
                    <div v-if="showPersian && persianText" dir="rtl" class="text-xs opacity-60 mb-2 leading-relaxed"
                        :style="{ color: selectedColor.value }" v-html="persianText">
                    </div>
                    <div v-html="text" class="leading-relaxed"></div>
                </div>
            </div>
        </div> -->

        <!-- پیش‌نمایش -->
        <div ref="canvas" class="px-4 pt-5">
            <div class="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                style="aspect-ratio:4/3;">

                <!-- تصویر پس‌زمینه اصلی (بدون blur) -->
                <div class="absolute inset-0 z-[10] bg-cover bg-center bg-no-repeat"
                    style="background-image: url(/img/pback.jpg)"></div>

                <!-- تصویر پس‌زمینه با blur (فقط وقتی blur فعاله) -->
                <div v-if="blur" class="absolute inset-0 z-[11] bg-cover bg-center bg-no-repeat"
                    style="background-image: url(/img/pback.jpg); filter: blur(8px); transform: scale(1.1);"></div>

                <!-- لایه رنگی -->
                <div class="absolute inset-0 z-[12] transition-all duration-300" :class="selectedBg.style"></div>

                <!-- متن -->
                <div :style="textStyle" :class="textAlignClass" class="z-30">
                    <div v-if="showPersian && persianText" dir="rtl" class="text-xs opacity-60 mb-2 leading-relaxed"
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
            <div class="flex gap-1 bg-white/5 rounded-2xl p-1 mb-4">
                <button
                    v-for="(label, key) in { bg: 'پس‌زمینه', color: 'رنگ', size: 'سایز', align: 'چینش', fx: 'افکت' }"
                    :key="key" @click="activeTab = key" class="flex-1 py-2 rounded-xl text-xs font-medium duration-200"
                    :class="activeTab === key
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                        : 'text-white/40 hover:text-white/70'">
                    {{ label }}
                </button>
            </div>

            <!-- محتوای تب‌ها -->
            <div class="bg-white/3 rounded-2xl border border-white/5 p-4">

                <!-- پس‌زمینه -->
                <div v-if="activeTab === 'bg'" class="flex gap-2 flex-wrap">
                    <button v-for="bg in backgrounds" :key="bg.id" @click="selectedBg = bg"
                        class="px-3 py-2 rounded-xl text-xs font-medium duration-200 border" :class="[
                            bg.style,
                            selectedBg.id === bg.id
                                ? 'border-amber-400 text-white scale-105 shadow-lg'
                                : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                        ]">
                        {{ bg.label }}
                    </button>
                </div>

                <!-- رنگ متن -->
                <div v-if="activeTab === 'color'" class="flex gap-3 flex-wrap items-center">
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
                <div v-if="activeTab === 'align'" class="flex gap-2">
                    <button v-for="(label, val) in { start: 'راست ←', center: '← وسط →', end: '→ چپ' }" :key="val"
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

            </div>
        </div>

        <!-- دکمه ذخیره -->
        <div class="px-4 py-5">
            <button @click="saveImage()" :disabled="isSaving || !text"
                class="w-full py-4 rounded-2xl font-bold text-base duration-200 disabled:opacity-30 relative overflow-hidden"
                :class="isSaving ? 'bg-gray-700' : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95'">
                <span v-if="!isSaving" class="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    ذخیره در گالری
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
