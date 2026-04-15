<script setup>
import { ref } from 'vue';
import IconCreaditCard from '../components/icons/IconCreaditCard.vue';

const showMore = ref(false)
const showPaymentLinks = ref(false);
</script>

<template>
    <div class="bg-gray-800/80 backdrop-blur-sm p-4 container mx-auto mt-4 rounded-xl">
        <div class="text-white font-bold text-lg flex flex-col gap-5" dir="rtl">
            <p>سلام دوست عزیز</p>

            <p>این برنامه رایگان است و همیشه هم رایگان خواهد مانده به این دلیل که میخواهیم همه به سادگی و بدون هزینه
                بتوانند به برنامه دسترسی داشته باشند</p>
            <p>درواقع ما نیازی به هیچ حمایتی برای مراقبت و بروزرسانی این برنامه نداریم اما اگر شما از علاقه مندانی هستید
                که

                میخواهید در حمایت و بهبود این برنامه شراکت داشته باشید می‌توانید مبلغی را به عنوان حمایت از این
                برنامه
                واریز کنید
            </p>

            <div v-if="showMore" class="bg-white/20 p-2 rounded flex flex-col gap-5">


                <p>امیدوارم حالت خوب باشه. هدف این برنامه ارائه ی یک تجربه خوب و باکیفیت برای ایرانی ها است و ما همیشه
                    معتقد
                    هستیم که ایرانی ها لایق بهترین ها هستند</p>

                <p>با توجه به این که مشاهده کردیم متاسفانه در زمینه خط میخی اکثر برنامه هایی که وجود داشت بسیار بی کیفیت
                    بود
                    و معمولا هم دارای مشکلاتی بودن تصمیم گرفتیم که دست به کار بشیم و
                    بعد از دو ماه تحقیق کار ساخت برنامه را شروع کردیم</p>

                <p>امیدواریم این برنامه بتواند تاثیر مثبتی در ماندگاری و ترویج قسمتی از فرهنگ باستانی ما باشد و بتواند
                    به علاقه مندان به خط میخی کمک کند.</p>
            </div>


        </div>

        <div v-if="showPaymentLinks == false" class="flex gap-4 justify-center mt-8 pb-8">
            <button class="bg-white rounded-xl p-4" @click="showMore = !showMore"> ! اطلاعات بیشتر</button>

            <button @click="showPaymentLinks = false" class="bg-white rounded-xl p-4 flex gap-2 text-green-700"
                href="https://zarinp.al/667477">پرداخت و حمایت مالی (به زودی)
                <IconCreaditCard class="w-6 "></IconCreaditCard>
            </button>
        </div>

        <transition>
            <div v-show="showPaymentLinks" class="flex flex-col gap-4 mt-4">
                <a class="bg-white text-right rounded-xl p-4 flex gap-2 text-green-700"
                    href="https://pay.nitrocode.ir/link/754785">
                    <div class="flex-1">پرداخت 50,000 تومان </div>
                    <IconCreaditCard class="w-6 "></IconCreaditCard>
                </a>
                <a class="bg-white text-right rounded-xl p-4 flex gap-2 text-green-700"
                    href="https://pay.nitrocode.ir/link/754793">
                    <div class="flex-1">پرداخت 100,000 تومان </div>
                    <IconCreaditCard class="w-6 "></IconCreaditCard>
                </a>
                <a class="bg-white text-right rounded-xl p-4 flex gap-2 text-green-700"
                    href="https://pay.nitrocode.ir/link/754794">
                    <div class="flex-1">پرداخت 250,000 تومان </div>
                    <IconCreaditCard class="w-6 "></IconCreaditCard>
                </a>
                <div>
                    <button @click="showPaymentLinks = false"
                        class="bg-white/20 rounded-xl p-4 hover:bg-white/50 duration-200">بازگشت</button>
                </div>

            </div>
        </transition>

        <div dir="rtl">
            <div class="text-white font-bold">
                حامی های برنامه‌ی خط میخی:
            </div>

            <div class="pr-4 mt-4 text-yellow-200 flex-col flex gap-2">

                <div class="flex gap-2 rounded-xl bg-gray-100/10 items-center overflow-hidden pl-1">
                    <div class="py-2 bg-gray-800/20 px-2">🥈</div>
                    <div class="flex-1 font-bold">علی آریایی</div>
                    <div class="text-xs flex flex-col justify-center text-center">(100,000) <span style="font-size: 10px;">تومان</span></div>
                    <div class="text-sm">1404/11/26</div>
                </div>

                <div class="flex gap-2 rounded-xl bg-gray-100/10 items-center overflow-hidden pl-1">
                    <div class="py-2 bg-gray-800/20 px-2">🥉</div>
                    <div class="flex-1">محمدمهدی کاظمی</div>
                    <div class="text-xs flex flex-col justify-center text-center">(50,000) <span style="font-size: 10px;">تومان</span></div>
                    <div class="text-sm">1404/11/21</div>
                </div>

                <div class="flex gap-2 rounded-xl bg-gray-100/10 items-center overflow-hidden pl-1">
                    <div class="py-2 bg-gray-800/20 px-2">🥉</div>
                    <div class="flex-1">مجید بهرامی</div>
                    <div class="text-xs flex flex-col justify-center text-center">(50,000) <span style="font-size: 10px;">تومان</span></div>
                    <div class="text-xs">1404/10/13</div>
                </div>

                <div class="flex gap-2 rounded-xl bg-gray-100/10 items-center overflow-hidden pl-1">
                    <div class="py-2 bg-gray-800/20 px-2">🥉</div>
                    <div class="flex-1">کارن سورن</div>
                    <div class="text-xs flex flex-col justify-center text-center">(50,000) <span style="font-size: 10px;">تومان</span></div>
                    <div class="text-xs">1404/10/05</div>
                </div>

                <div class="flex gap-2 rounded-xl bg-gray-100/10 items-center overflow-hidden pl-1">
                    <div class="py-2 bg-gray-800/20 px-2">🥈</div>
                    <div class="flex-1 font-bold">سید محمد</div>
                    <div class="text-xs flex flex-col justify-center text-center">(100,000) <span style="font-size: 10px;">تومان</span></div>
                    <div class="text-xs">1404/08/18</div>
                </div>

                <div class="flex gap-2 rounded-xl bg-gray-100/10 items-center overflow-hidden pl-1">
                    <div class="py-2 bg-gray-800/20 px-2">🥉</div>
                    <div class="flex-1">عل حسین</div>
                    <div class="text-xs flex flex-col justify-center text-center">(50,000) <span style="font-size: 10px;">تومان</span></div>
                    <div class="text-xs">1404/02/15</div>
                </div>

                <div class="flex gap-2 rounded-xl bg-gray-100/10 items-center overflow-hidden pl-1">
                    <div class="py-2 bg-gray-800/20 px-2">🥈</div>
                    <div class="flex-1 font-bold">محمد شکیبافرد</div>
                    <div class="text-xs flex flex-col justify-center text-center">(100,000) <span style="font-size: 10px;">تومان</span></div>
                    <div class="text-xs">1404/01/18</div>
                </div>


            </div>
        </div>
    </div>
</template>