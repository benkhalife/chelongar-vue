<script setup>
import Keyboard from '../components/Keyboard.vue';
import { toPng } from 'html-to-image';
</script>

<script>
export default {
  data() {
    return {
      text: '',
      test_persian: '',
      show_keyboard: true,
      show_persian_text: true,
      zoom: 1.5,
      isSaving: false,
      keyboardHeight:0,
    }
  },
  mounted(){
    this.initHeight()
  },
  methods: {
    initHeight(){
      this.keyboardHeight = this.$refs.keyboard.offsetHeight;
    },
    goToExport() {
      window.localStorage.setItem('export_text', this.text);
      window.localStorage.setItem('export_persian', this.test_persian);
      this.$router.push({ name: 'image-export' });
    },
    async downloadImage() {
      this.isSaving = true;
      try {
        const node = this.$refs.textDisplay;
        const dataUrl = await toPng(node, {
          backgroundColor: '#1f2937', // رنگ پس‌زمینه دلخواه
          pixelRatio: 2, // کیفیت بالاتر
        });

        const fileName = 'khate-mikhi-' + Date.now();

        // اگر داخل WebView اندروید هستیم
        if (window.AndroidTools) {
          window.AndroidTools.saveBase64Image(dataUrl, fileName);
        } else {
          // fallback برای مرورگر
          const link = document.createElement('a');
          link.download = fileName + '.png';
          link.href = dataUrl;
          link.click();
        }
      } catch (err) {
        console.error('خطا در ذخیره تصویر:', err);
      } finally {
        this.isSaving = false;
      }
    },

    changeTextEvent(words) { this.text = words; },
    changeTextPersianEvent(word) { this.test_persian = word; },
    showkeyboard(show) {
      this.initHeight()
      this.$nextTick(()=>{
        this.show_keyboard = show;
      })
    },
    copy() {
      var input = document.createElement('input');
      input.setAttribute('value', this.text);
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      AndroidTools.showToast('متن کپی شد', true)
      return result;
    },
    getKeyboardStyle() {
      if (this.show_keyboard == false) {
        return 'margin-bottom:-' + (this.keyboardHeight - 90) + 'px';
      }
      return '';
    }
  }
}
</script>

<template>
  <main class="p-2 pt-10">

    <div class="flex flex-wrap gap-2 justify-between">
      <button @click="copy()"
        class="bg-blue-500/50 text-white hover:bg-blue-700 duration-200 backdrop-blur-sm px-6 py-2 rounded-xl">
        کپی
      </button>

      <button @click="goToExport()" :disabled="isSaving || !text"
        class="bg-green-500/50 text-white hover:bg-green-700 duration-200 backdrop-blur-sm px-6 py-2 rounded-xl disabled:opacity-40">
        {{ isSaving ? '...' : 'ذخیره تصویر' }}
      </button>

      <div class="flex items-center gap-2">
        <button @click="show_persian_text = !show_persian_text"
          class="text-white duration-200 backdrop-blur-sm px-4 py-2 rounded-xl"
          :class="{ 'bg-green-600/50 hover:bg-green-700': show_persian_text, 'bg-gray-600/50 hover:bg-gray-700': !show_persian_text }">
          FA
        </button>
        <button @click="zoom = zoom - 0.1"
          class="bg-gray-600/50 text-white hover:bg-blue-700 duration-200 backdrop-blur-sm px-2 py-2 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
          </svg>
        </button>
        <button @click="zoom = zoom + 0.1"
          class="bg-gray-600/50 text-white hover:bg-blue-700 duration-200 backdrop-blur-sm px-2 py-2 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- این ref رو اضافه کردیم -->
    <div ref="textDisplay" class="font-bold shadow p-2 backdrop-blur-sm rounded-lg w-full break-words mt-4"
      style="white-space: pre-line;">
      <div class="shadow bg-gray-500/50 rounded-lg p-3">
        <div v-show="show_persian_text" dir="rtl" class="text-xl" v-html="test_persian"></div>
        <div class="duration-100" :style="'font-size:' + zoom + 'rem'" v-html="text"></div>
      </div>
    </div>

    <div class="fixed left-0 duration-200 w-full bottom-0" :style="getKeyboardStyle()">
      <div ref="keyboard" class="rounded-lg">
        <Keyboard @show-status="showkeyboard($event)" @change-textpersian="changeTextPersianEvent($event)"
          @change-text="changeTextEvent($event)" />
      </div>
    </div>

  </main>
</template>
