<script setup>
import Swal from 'sweetalert2';
import { RouterView, useRoute, useRouter } from 'vue-router'
import { Toaster } from 'vue-sonner';


// در setup()
const router = useRouter()
const route = useRoute()

window.handleAndroidBackPress = async () => {
  // 1. اگر در صفحه اصلی یا صفحه ورود هستید، از برنامه خارج شوید
  if (route.name === 'home') {
    if (window.AndroidTools) {


      const response = await Swal.fire({
        title: 'می‌خواهید از برنامه خارج شوید؟',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'خروج از برنامه',
        cancelButtonText: 'بازگشت به برنامه',
      })

      if (response.isConfirmed) {
        window.AndroidTools.exitApp()
      }
    }
  }
  // 2. در غیر این صورت به صفحه قبل در Vue برگردید
  else {
    router.back()
    // یا router.go(-1)
  }
}
</script>

<style>
html,
#app {
  height: 100%;
  min-height: 100%;
}

html,
body {
  overscroll-behavior: none;
}

body {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>



<template>

  <RouterView />
  <Toaster 
    position="top-center" 
    richColors 
    :toastOptions="{ duration: 3000, style: { zIndex: 9999 }, classes: {
        title: 'dirRTL text-right w-full flex-1',
        content: 'w-full'
      } }" 
  />
  <div class="fixed bottom-0 w-full h-12 bg-gray-400/50 z-10"></div>

</template>

<style>

.dirRTL,
.swal2-input {
  direction: rtl;
}

.swal2-title {
  font-size: 20px;
}

.swal2-confirm.swal2-styled {
  color: black;
  background: #8386ff42;
}

.swal2-cancel.swal2-styled {
  color: black;
  background: #c0c0c042;
}
</style>