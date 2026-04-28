<template>
    <div style="background-color: rgb(208 211 215);" class="min-h-screen text-slate-800 overflow-hidden relative text-justify"
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
                    <h1 class="text-2xl font-black text-slate-800 tracking-tight">راهنمای گالری مخفی</h1>
                    <p class="text-xs text-slate-500 font-medium mt-0.5">همه چیز درباره گالری مخفی</p>
                </div>
            </div>

            <!-- Q&A Items -->
            <div class="flex flex-col gap-4">

                <!-- گالری مخفی چیست؟ -->
                <div class="rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5">
                    <div class="flex items-start gap-3 mb-3">
                        <div class="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-base font-bold text-slate-800 mb-2">گالری مخفی چیست و چرا به آن نیاز داریم؟</h3>
                            <p class="text-sm text-slate-600 leading-relaxed">
                                گالری مخفی یک فضای امن و محافظت‌شده برای ذخیره عکس‌ها و ویدیوهای شخصی شماست. این فایل‌ها از گالری اصلی گوشی جدا هستند و فقط با رمز عبور قابل دسترسی‌اند. از این قابلیت برای حفظ حریم خصوصی، محافظت از خاطرات شخصی، و جلوگیری از دسترسی افراد دیگر به فایل‌های حساس استفاده می‌شود.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- رمز عبور گالری -->
                <div class="rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5">
                    <div class="flex items-start gap-3 mb-3">
                        <div class="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-base font-bold text-slate-800 mb-2">رمز عبور گالری چیست؟</h3>
                            <p class="text-sm text-slate-600 leading-relaxed mb-3">
                                برای فعال‌سازی گالری مخفی، باید یک رمز عبور ۴ رقمی تنظیم کنید. این رمز کلید ورود به فضای امن شماست و باید آن را در جایی امن نگهداری کنید. بدون این رمز، هیچ‌کس نمی‌تواند به فایل‌های شما دسترسی پیدا کند.
                            </p>
                            <div class="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                <p class="text-xs text-amber-800 font-semibold">
                                    ⚠️ رمز عبور خود را فراموش نکنید! در صورت فراموشی، دسترسی به فایل‌ها غیرممکن خواهد بود.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- رمز فریب -->
                <div class="rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-100 p-5">
                    <div class="flex items-start gap-3 mb-3">
                        <div class="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-base font-bold text-slate-800 mb-2">رمز فریب چیست؟ <span class="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">نسخه حرفه‌ای</span></h3>
                            <p class="text-sm text-slate-600 leading-relaxed mb-3">
                                رمز فریب یک رمز ۴ رقمی جداگانه است که در شرایط حساس از شما محافظت می‌کند. وقتی کسی شما را مجبور به نشان دادن گالری مخفی کند، با وارد کردن رمز فریب، یک گالری خالی یا حاوی فایل‌های غیرحساس نمایش داده می‌شود.
                            </p>
                            <div class="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-3">
                                <p class="text-xs text-purple-800 font-semibold mb-2">💡 چگونه استفاده کنیم؟</p>
                                <ul class="text-xs text-purple-700 space-y-1 mr-4">
                                    <li>• فایل‌های واقعاً مهم را با رمز اصلی ببینید</li>
                                    <li>• در گالری فریب، فایل‌های معمولی یا هیچ فایلی قرار ندهید</li>
                                    <li>• در شرایط اضطراری، رمز فریب را بدهید</li>
                                </ul>
                            </div>
                            <p class="text-xs text-slate-500 italic">
                                این ویژگی برای مواقعی طراحی شده که تحت فشار قرار دارید و مجبورید رمز را فاش کنید، اما می‌خواهید اطلاعات واقعی خود را محافظت کنید.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- قفل پس از تلاش ناموفق -->
                <div class="rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100 p-5">
                    <div class="flex items-start gap-3 mb-3">
                        <div class="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-base font-bold text-slate-800 mb-2">قفل پس از تلاش ناموفق </h3>
                            <p class="text-sm text-slate-600 leading-relaxed mb-3">
                                این قابلیت امنیتی جلوی حدس زدن رمز عبور را می‌گیرد. اگر کسی ۵ بار پشت سر هم رمز اشتباه وارد کند، گالری مخفی به مدت ۲۴ ساعت قفل می‌شود و هیچ‌کس نمی‌تواند به آن دسترسی پیدا کند.
                            </p>
                            <div class="bg-red-50 border border-red-200 rounded-xl p-3">
                                <p class="text-xs text-red-800 font-semibold">
                                    🛡️ این ویژگی از تلاش‌های مکرر برای نفوذ به گالری شما جلوگیری می‌کند و امنیت بیشتری فراهم می‌آورد.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- مخفی کردن دکمه گالری -->
                <div class="rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5">
                    <div class="flex items-start gap-3 mb-3">
                        <div class="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-base font-bold text-slate-800 mb-2">مخفی کردن دکمه گالری چیست؟</h3>
                            <p class="text-sm text-slate-600 leading-relaxed mb-3">
                                با فعال کردن این گزینه، دکمه ورود به گالری مخفی از صفحه اصلی حذف می‌شود و کسی متوجه وجود گالری مخفی نمی‌شود. این بالاترین سطح امنیت و حریم خصوصی را فراهم می‌کند.
                            </p>
                            
                            <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-3">
                                <p class="text-xs text-indigo-800 font-semibold mb-2">🔐 چگونه وارد گالری شوم؟</p>
                                <p class="text-xs text-indigo-700 mb-2">
                                    پس از مخفی کردن دکمه، برای ورود به گالری مخفی باید انگشت خود را روی دکمه خروج (بالای صفحه اصلی، سمت چپ) نگه دارید:
                                </p>
                            </div>

                            <!-- تصویر نمایشی -->
                            <div class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-1 mb-3">
                                <img :src="exitButtonImage" alt="دکمه خروج" class="w-full rounded-lg" />
                            </div>

                            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                                <ul class="text-xs text-slate-700 space-y-2">
                                    <li class="flex items-start gap-2">
                                        <span class="text-teal-600 font-bold">✓</span>
                                        <span><strong>کلیک معمولی:</strong> پیام خروج از برنامه نمایش داده می‌شود</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <span class="text-teal-600 font-bold">✓</span>
                                        <span><strong>نگه داشتن انگشت:</strong> وارد صفحه ورود به گالری مخفی می‌شوید</span>
                                    </li>
                                </ul>
                            </div>

                            <p class="text-xs text-slate-500 italic mt-3">
                                💡 این روش ورود مخفیانه باعث می‌شود حتی اگر کسی گوشی شما را در دست داشته باشد، متوجه وجود گالری مخفی نشود.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- نکات امنیتی -->
                <div class="rounded-3xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 p-5">
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-base font-bold text-teal-800 mb-2">نکات امنیتی مهم</h3>
                            <ul class="text-sm text-teal-700 space-y-2">
                                <li class="flex items-start gap-2">
                                    <span class="text-teal-600 font-bold">•</span>
                                    <span>رمز عبور خود را با کسی به اشتراک نگذارید</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-teal-600 font-bold">•</span>
                                    <span>از رمزهای ساده و قابل حدس مانند ۱۲۳۴ استفاده نکنید</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-teal-600 font-bold">•</span>
                                    <span>رمز اصلی و رمز فریب را متفاوت انتخاب کنید</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-teal-600 font-bold">•</span>
                                    <span>برای امنیت بیشتر، دکمه گالری را مخفی کنید</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script setup>
import Image from '@/assets/images/hiddenGalleryHelper_1.png'

const emit = defineEmits(['back'])

// تصویر دکمه خروج - مقداردهی توسط شما
const exitButtonImage = Image // مسیر تصویر را اینجا قرار دهید

function onBack() {
    emit('back')
}
</script>
