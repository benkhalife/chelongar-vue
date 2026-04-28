<template>
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            <!-- Icon -->
            <div class="flex justify-center mb-6">
                <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4">
                        </path>
                    </svg>
                </div>
            </div>

            <!-- Title -->
            <h1 class="text-2xl font-bold text-center text-gray-800 mb-4">
                دسترسی به حافظه
            </h1>

            <!-- Description -->
            <div class="text-gray-600 mb-8 leading-relaxed text-right" dir="rtl">
                <!-- <p class="mb-4">
                    برای کاهش خودکار حجم عکس‌ها و مدیریت حافظه گوشی، این برنامه نیاز به داشتن اجازه دسترسی به فایل‌های
                    شما دارد.
                </p> -->
                <p class="mb-4">
                    این برنامه برای مدیریت و کارکرد صحیح بخش گالری مخفی نیاز دارد تا شما اجازه دسترسی به فایل‌ها را به آن بدهید
                </p>
                <p class="text-sm mb-4">
                    با کلیک روی دکمه زیر، صفحه تنظیمات باز می‌شود. لطفاً دسترسی را فعال کنید.
                </p>
                <p class="text-sm font-medium">
                    {{ permissionMessage }}
                </p>
            </div>

            <!-- Button -->
            <button @click="requestPermission"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl">
                اجازه دسترسی
            </button>

            <!-- Info -->
            <p class="text-xs text-gray-400 text-center mt-6" dir="rtl">
                اطلاعات شما محفوظ و امن خواهد بود
            </p>

            <div class="text-center mt-4">
                <router-link class="text-sm text-center link text-blue-300" :to="{ name: 'PrivacyPolicy' }">
                    مشاهده شرایط و حریم خصوصی
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StoragePermissionPage',
    data() {
        return {
            androidVersion: 0
        }
    },
    mounted() {
        if (window.AndroidMediaPermission) {
            this.androidVersion = window.AndroidMediaPermission.getAndroidVersion();
        }
        window.addEventListener('android-resume', this.checkPermission);
    },

    beforeUnmount() {
        window.removeEventListener('android-resume', this.checkPermission);
    },
    computed: {
        permissionMessage() {
            if (this.androidVersion >= 30) {
                return 'صفحه تنظیمات باز می‌شود. گزینه "اجازه دسترسی به تمام فایل‌ها" (Allow access to all files) را فعال کنید.';
            } else {
                return 'پنجره درخواست مجوز نمایش داده می‌شود. روی "اجازه دادن" (Allow All the time) کلیک کنید.';
            }
        }
    },
    methods: {
        requestPermission() {
            if (window.AndroidMediaPermission) {
                window.AndroidMediaPermission.requestStoragePermission();
            }
        },
        checkPermission() {
            console.log('checkPermission');

            if (window.AndroidMediaPermission) {
                const hasPermission = window.AndroidMediaPermission.hasStoragePermission();
                console.log('checkPermission:', hasPermission);

                if (hasPermission) {
                    this.$router.replace({ name: this.$route.params.afterPermission  });
                }
            }
        }
    }
}
</script>
