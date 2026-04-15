<template>
    <div class="space-y-6 text-gray-700 leading-relaxed pb-10">

        <section>
            <!-- <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">معرفی چلونگر</h2> -->
            <p class="text-justify">
                چلونگر یک اپلیکیشن کاربردی برای مدیریت فضای ذخیره‌سازی دستگاه شماست. با استفاده از این برنامه می‌توانید
                به راحتی حجم فایل‌های خود را کاهش داده و فضای گوشی خود را آزاد کنید.
            </p>
        </section>

        <section class="bg-indigo-50 p-5 flex flex-col gap-2 rounded-xl border border-indigo-100">
            <h3 class="text-lg font-bold text-indigo-800">امکانات اصلی:</h3>
            <div>
                <p>انتخاب تکی عکس یا ویدیو و کاهش حجم آن به صورت <strong>کاملاً رایگان</strong>.</p>
            </div>

            <div>
                <p>کاهش حجم تمام عکس‌ها به صورت اتوماتیک و افزایش فضای هارد (رایگان تا سقف ۱ گیگابایت).</p>
            </div>
            <div>
                <p> <strong>نسخه حرفه‌ای:</strong> استفاده بدون محدودیت همراه برسی خودکار و کاهش حجم فایل‌های جدید</p>
            </div>
        </section>

        <section>
            <router-link :to="{name:'pro'}">
                <button class="border-blue-500 p-4 w-full bg-blue-50 shadow-md shadow-blue-200 hover:bg-blue-200 duration-200 border-2 rounded-xl">مشاهده صفحه نسخه حرفه‌ای</button>
            </router-link>
        </section>



        <section class="mt-6 text-center bg-gray-800 text-white p-4 rounded-xl">
            <p class="text-sm mb-2 text-gray-300">پشتیبانی (فقط از طریق پیامک):</p>
            <p class="text-xl font-bold font-mono tracking-widest dir-ltr">09038755123</p>
        </section>


                <section class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 class="text-sm text-gray-500 mb-1">توسعه یافته توسط:</h4>
                <p class="font-bold text-gray-800 text-center"> NitroCode.ir</p>
                <p class="font-bold text-gray-800 text-sm opacity-60 text-center mt-2">Benyamin Khalife</p>
            </div>
        </section>


    </div>
</template>
