<template>
    <div class="space-y-6 text-gray-700 leading-relaxed pb-10">

        <section>
            <!-- <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">معرفی چلونگر</h2> -->
            <p class="text-justify">
                چلونگر یک اپلیکیشن کاربردی برای فشرده‌سازی عکس‌ها و ویدیو‌ها است. با استفاده از چلونگر می‌توانید بدون
                کاهش کیفیت تصویر عکس های خود را فشرده کنید همین طور می‌توانید رزولوشن و فرمت ذخیره سازی عکس را مدیریت
                کنید
            </p>

            <p class="text-justify">چلونگر می‌تواند ویدیوهای شما را با کیفیت مناسب کم حجم کند این قابلیت مخصوصا در
                شرایطی که اختلال‌هایی که در شبکه اینترنت وجود دارد ممکن است به شما کمک کند تا ویدیو‌های خود را سریع‌تر و
                راحت‌تر با دیگران به اشتراک بگذارید
            </p>
        </section>

        <section class="bg-indigo-50 p-5 flex flex-col gap-2 rounded-xl border border-indigo-100">
            <h3 class="text-lg font-bold text-indigo-800">امکانات اصلی:</h3>
            <div>
                <p>کاهش حجم عکس بدون افت کیفیت <strong> رایگان</strong>.</p>
            </div>

            <div>
                <p>قابلیت تغییر رزولوشن و فرمت عکس <strong> رایگان</strong>.</p>
            </div>

            <div>
                <p>قابلیت کاهش حجم ویدیو باکیفت بالا <strong> رایگان</strong>.</p>
            </div>

            <div v-if="showHiddenGalleryBigButton">
                <p>گالری مخفی برای عکس‌ها و ویدیو‌های حساس شما</p>
            </div>
        </section>

        <section>
            <router-link v-if="!isPro" :to="{ name: 'pro' }">
                <button
                    class="border-blue-500 p-4 w-full bg-blue-50 shadow-md shadow-blue-200 hover:bg-blue-200 duration-200 border-2 rounded-xl">مشاهده
                    صفحه نسخه حرفه‌ای</button>
            </router-link>
            <div v-else class="border-2 rounded-xl p-4 text-center font-bold border-yellow-500 text-yellow-600">
                شما از نسخه حرفه‌ای استفاده می‌کنید 👑
            </div>
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

            <div class="text-center">

                <p class="text-[10px] text-slate-500">نسخه {{ getVersion() }}</p>
                <p class="text-[10px] text-slate-500 mt-1 font-mono">Client Build: {{ getUiVersion }}-{{
                    showMarketName.toUpperCase() }}</p>
            </div>

        </section>


    </div>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue'

const getVersion = () => {
    if (AndroidTools?.getVersionName()) {

        return AndroidTools.getVersionName();
    }
    else {
        return '0'
    }
}

const isPro = ref(AndroidPrefs.getBoolean('is_pro', false))
const hideGalleryButton = ref(AndroidPrefs.getString('gallery_hide_button', '0') === 'true')
const hasPin = ref(AndroidPrefs.getString('gallery_pin', '').length === 4)

const showHiddenGalleryBigButton = computed(() => {

  if (hasPin.value == false || (hasPin.value && hideGalleryButton.value == false)) {
    return true;
  }
  return false;
})


const getUiVersion = import.meta.env.VITE_BUILD_UI_VERSION
const showMarketName = ref('')

const checkBuildMarketType = async () => {
    try {
        const androidType = AndroidTools.getMarketBuildName().toLowerCase()
        const clientType = import.meta.env.VITE_MARKET.toLowerCase()

        if (androidType === clientType) {
            showMarketName.value = androidType;
        }
        else {
            toast.error('مارکت های کلاینت و اپلیکیشن به درستی مقدار دهی نشده اند')
            showMarketName.value = '****'

        }
    } catch (error) {
        showMarketName.value = 'E****'
    }

}
onMounted(() => {
    checkBuildMarketType()
})

</script>