<template>
  <div style="background-color: rgb(208 211 215);" class="min-h-screen text-slate-800 overflow-hidden relative"
    dir="rtl">
    <!-- Background blobs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <div class="absolute -top-32 -right-32 w-96 h-96 bg-teal-100 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 -left-40 w-80 h-80 bg-cyan-100 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 flex flex-col min-h-screen px-5 pt-12 pb-24">

      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 overflow-hidden rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
            <img src="@/assets/images/Chelongar-icon-512.png" alt="چلونگر" class="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">گالری مخفی</h1>
            <p class="text-xs text-slate-500 font-medium mt-0.5">فایل‌های امن شما</p>
          </div>
        </div>

        <!-- Settings button -->
        <button @click="onSettingsClick"
          class="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-teal-600 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>

      <!-- Stats Card -->
      <div
        class="mb-6 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5 relative overflow-hidden">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-teal-50 rounded-full opacity-50 pointer-events-none"></div>
        <div class="flex items-center justify-between relative z-10">
          <div class="flex flex-col gap-1">
            <span class="text-xs text-slate-500 font-medium">همه فایل‌ها</span>
            <span class="text-2xl font-black text-slate-800">{{ totalCount }}</span>
          </div>
          <div class="w-px h-10 bg-slate-100"></div>
          <div class="flex flex-col gap-1 items-center">
            <span class="text-xs text-slate-500 font-medium">عکس</span>
            <span class="text-xl font-bold text-teal-600">{{ imageCount }}</span>
          </div>
          <div class="w-px h-10 bg-slate-100"></div>
          <div class="flex flex-col gap-1 items-center">
            <span class="text-xs text-slate-500 font-medium">ویدیو</span>
            <span class="text-xl font-bold text-teal-600">{{ videoCount }}</span>
          </div>
          <div class="w-px h-10 bg-slate-100"></div>
          <div class="flex flex-col gap-1 items-center">
            <span class="text-xs text-slate-500 font-medium">سایر</span>
            <span class="text-xl font-bold text-teal-600">{{ otherCount }}</span>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        <button v-for="tab in filterTabs" :key="tab.value" @click="activeFilter = tab.value" :class="[
          'px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all',
          activeFilter === tab.value
            ? 'bg-teal-600 text-white shadow-sm'
            : 'bg-white text-slate-500 border border-slate-100'
        ]">
          {{ tab.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex-1 flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-3">
          <div class="w-10 h-10 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin"></div>
          <span class="text-sm text-slate-500">در حال بارگذاری...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredFiles.length === 0" class="flex-1 flex flex-col items-center justify-center gap-4 py-16">
        <div class="w-20 h-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
          <svg class="w-9 h-9 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <div class="text-center">
          <p class="text-slate-700 font-bold text-base">فایلی موجود نیست</p>
          <p class="text-slate-400 text-sm mt-1">برای افزودن فایل، دکمه + را لمس کنید</p>
        </div>
      </div>

      <!-- File Grid -->
      <div v-else class="grid grid-cols-3 gap-2">
        <div v-for="file in filteredFiles" :key="file.id" @click="openFile(file)"
          class="relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm cursor-pointer active:scale-95 transition-transform">
          <!-- Image -->
          <img v-if="file.mimeType.startsWith('image/') && file.url" :src="file.url" :alt="file.originalName"
            class="w-full h-full object-cover" />
          <!-- Image placeholder (loading) -->
          <div v-else-if="file.mimeType.startsWith('image/') && !file.thumbnail"
            class="w-full h-full flex items-center justify-center bg-slate-100">
            <div class="w-6 h-6 rounded-full border-2 border-teal-200 border-t-teal-500 animate-spin"></div>
          </div>

          <!-- Video -->
          <div v-else-if="file.mimeType.startsWith('video/')"
            class="w-full h-full flex items-center justify-center bg-slate-800">
            <!-- <img v-if="file.url" :src="file.url"  class="w-full h-full object-cover absolute inset-0" /> -->
            <img v-if="file.thumbUrl" :src="file.thumbUrl" class="w-full h-full object-cover absolute inset-0" />


            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                <svg class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Other -->
          <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-50 p-2">
            <svg class="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span class="text-xs text-slate-500 font-medium text-center line-clamp-2">{{ file.originalName }}</span>
          </div>

          <!-- Type Badge -->
          <div class="absolute bottom-1.5 right-1.5">
            <span class="text-xs font-bold px-1.5 py-0.5 rounded-lg" :class="getTypeBadgeClass(file.mimeType)">
              {{ getTypeLabel(file.mimeType) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add File FAB -->
    <div class="fixed bottom-14 left-1/2 -translate-x-1/2 z-20">
      <button @click="pickFile" :disabled="isPickerLoading"
        class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all disabled:opacity-60">
        <svg v-if="!isPickerLoading" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <div v-else class="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
        افزودن به گالری
      </button>
    </div>

    <!-- <Footer></Footer> -->


    <!-- File Action Bottom Sheet -->
    <Transition name="sheet">
      <div v-if="selectedFile" class="fixed inset-0 z-30 flex flex-col justify-end">
        <div class="absolute inset-0 bg-black/40" @click="selectedFile = null"></div>
        <div class="relative bg-white rounded-t-3xl p-5 z-10">
          <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-5"></div>

          <div class="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
            <div
              class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img v-if="selectedFile.url" :src="selectedFile.url" class="w-full h-full object-cover" />
              <svg v-else class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-slate-800 text-sm truncate">{{ selectedFile.originalName }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ formatSize(selectedFile.sizeBytes) }} · {{
                formatDate(selectedFile.addedAt) }}</p>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <button @click="viewFile(selectedFile)"
              class="flex items-center gap-3 w-full p-3.5 rounded-2xl bg-teal-50 active:scale-95 transition-all">
              <svg class="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="font-semibold text-teal-700 text-sm">مشاهده فایل</span>
            </button>

            <button @click="restoreFile(selectedFile)"
              class="flex items-center gap-3 w-full p-3.5 rounded-2xl bg-slate-50 active:scale-95 transition-all">
              <svg class="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              <span class="font-semibold text-slate-600 text-sm">بازگرداندن به گالری</span>
            </button>

            <button @click="confirmDelete(selectedFile)"
              class="flex items-center gap-3 w-full p-3.5 rounded-2xl bg-red-50 active:scale-95 transition-all">
              <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <span class="font-semibold text-red-600 text-sm">حذف دائمی</span>
            </button>
          </div>
          <Footer></Footer>
        </div>

      </div>
    </Transition>

    <!-- Media Viewer (fullscreen) -->
    <Transition name="fade">
      <div v-if="viewerFile" class="fixed inset-0 z-40 bg-black flex items-center justify-center">
        <!-- Close -->
        <button @click="viewerFile = null"
          class="absolute top-10 right-5 w-10 h-10 rounded-full bg-white/40 flex items-center justify-center text-white z-10">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Loading spinner in viewer -->
        <div v-if="isViewerLoading" class="flex flex-col items-center gap-3">
          <div class="w-10 h-10 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
          <span class="text-white/60 text-sm">در حال بارگذاری...</span>
        </div>

        <img v-else-if="viewerFile.mimeType.startsWith('image/') && viewerFile.url" :src="viewerFile.url"
          class="max-w-full max-h-full object-contain" :alt="viewerFile.originalName" />

        <video v-else-if="viewerFile.mimeType.startsWith('video/') && viewerFile.url" :src="viewerFile.url" controls
          autoplay class="max-w-full max-h-full"></video>

        <div v-else-if="!isViewerLoading" class="text-white text-center p-8">
          <svg class="w-16 h-16 mx-auto mb-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p class="font-bold text-lg">{{ viewerFile.originalName }}</p>
          <p class="text-white/50 text-sm mt-1">این نوع فایل قابل پیش‌نمایش نیست</p>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirm Dialog -->
    <Transition name="fade">
      <div v-if="fileToDelete" class="fixed inset-0 z-50 flex items-center justify-center px-8">
        <div class="absolute inset-0 bg-black/50" @click="fileToDelete = null"></div>
        <div class="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
          <div class="text-center mb-5">
            <div class="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
              <svg class="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 class="font-black text-slate-800 text-lg">حذف دائمی</h3>
            <p class="text-slate-500 text-sm mt-1">این فایل برای همیشه حذف می‌شود و قابل بازیابی نیست.</p>
          </div>
          <div class="flex gap-2">
            <button @click="fileToDelete = null"
              class="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm active:scale-95 transition-all">
              انصراف
            </button>
            <button @click="executeDelete"
              class="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm active:scale-95 transition-all">
              حذف
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show"
        class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold text-white whitespace-nowrap"
        :class="toast.type === 'success' ? 'bg-teal-600' : 'bg-red-500'">
        {{ toast.message }}
      </div>
    </Transition>
  </div>


</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Footer from '../components/Footer.vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2';

// ─── State ───────────────────────────────────────────────────────────────────

const router = useRouter();
const files = ref([])
const isLoading = ref(false)
const isPickerLoading = ref(false)
const isViewerLoading = ref(false)
const activeFilter = ref('all')
const selectedFile = ref(null)
const viewerFile = ref(null)
const fileToDelete = ref(null)
const isPro = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null

// ─── Filter Tabs ─────────────────────────────────────────────────────────────

const filterTabs = [
  { value: 'all', label: 'همه' },
  { value: 'image', label: 'عکس' },
  { value: 'video', label: 'ویدیو' },
  { value: 'other', label: 'سایر' },
]

// ─── Computed ────────────────────────────────────────────────────────────────

const totalCount = computed(() => files.value.length)
const imageCount = computed(() => files.value.filter(f => f.mimeType.startsWith('image/')).length)
const videoCount = computed(() => files.value.filter(f => f.mimeType.startsWith('video/')).length)
const otherCount = computed(() => files.value.filter(f => !f.mimeType.startsWith('image/') && !f.mimeType.startsWith('video/')).length)

const filteredFiles = computed(() => {
  switch (activeFilter.value) {
    case 'image': return files.value.filter(f => f.mimeType.startsWith('image/'))
    case 'video': return files.value.filter(f => f.mimeType.startsWith('video/'))
    case 'other': return files.value.filter(f => !f.mimeType.startsWith('image/') && !f.mimeType.startsWith('video/'))
    default: return files.value
  }
})

// ─── Lifecycle ───────────────────────────────────────────────────────────────

onMounted(() => {
  try { isPro.value = AndroidPrefs.getBoolean('is_pro', false) } catch { isPro.value = false }

  window.onGalleryFileList = handleFileList
  window.onFileHidden = handleFileHidden
  window.onFileRestored = handleFileRestored
  window.onFileDeleted = handleFileDeleted
  loadFiles()
})

onUnmounted(() => {
  delete window.onGalleryFileList
  delete window.onFileHidden
  delete window.onFileRestored
  delete window.onFileDeleted
  if (toastTimer) clearTimeout(toastTimer)
})

// ─── Core Methods ─────────────────────────────────────────────────────────────

function loadFiles() {
  isLoading.value = true
  if (window.HiddenGallery) {
    window.HiddenGallery.listFiles('onGalleryFileList')
  } else {
    setTimeout(() => {
      handleFileList(JSON.stringify({ success: true, data: [] }))
    }, 500)
  }
}

function handleFileList(jsonStr) {
  isLoading.value = false
  const result = JSON.parse(jsonStr)
  console.log('handleFileList:result:', result);

  if (result.success) {
    // استفاده مستقیم از سرور NanoHTTPD (لوکال هاست 8080)
    files.value = result.data.map(f => ({
      ...f,
      // آدرس استریم فایل از سرور لوکال شما
      url: `http://localhost:8080/vault/${f.folder}/${f.id}`,
      // آدرس کاور ویدیو از سرور لوکال شما
      thumbUrl: `http://localhost:8080/thumb/${f.folder}/${f.id}`
    }))

    console.log('handleFileList:files.value:', files.value);

  } else {
    showToast('خطا در بارگذاری: ' + result.error, 'error')
  }
}



// ─── User Actions ─────────────────────────────────────────────────────────────

async function pickFile() {

  console.log('isPro:', isPro, 'total');

  if (!isPro.value && totalCount.value >= 15) {
    const btn = await Swal.fire({
      title: 'محدودیت نسخه رایگان',
      text: 'دوست عزیز برای استفاده نامحدود از گالری مخفی لطفا برنامه را به نسخه حرفه‌ای ارتقا دهید',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'لغو',
      confirmButtonText: 'مشاهده صفحه ارتقا'
    })

    if (btn.isConfirmed) {
      router.push({ 'name': 'pro' })
    }

    return;
  }


  if (isPickerLoading.value) return
  isPickerLoading.value = true
  if (window.HiddenGallery) {

    window.HiddenGallery.openPicker('image/*,video/*', 'onFileHidden')
  } else {
    setTimeout(() => { isPickerLoading.value = false }, 1000)
  }
}

function handleFileHidden(jsonStr) {
  isPickerLoading.value = false
  const result = JSON.parse(jsonStr)
  if (result.success) {
    showToast('فایل با موفقیت مخفی شد', 'success')
    loadFiles()
  } else {
    showToast(result.error || 'خطا در افزودن فایل', 'error')
  }
}

function openFile(file) {
  selectedFile.value = file
}

function viewFile(file) {
  selectedFile.value = null
  // 💡 تغییر اصلی: دیگر نیازی به فراخوانی جاوا اسکریپت اینترفیس و دریافت Base64 نیست
  viewerFile.value = { ...file }
}

function restoreFile(file) {
  selectedFile.value = null
  window.HiddenGallery?.restoreFile(file.id, 'onFileRestored')
}

function handleFileRestored(jsonStr) {
  const result = JSON.parse(jsonStr)
  if (result.success) {
    showToast('فایل به گالری بازگردانده شد ✓', 'success')
    loadFiles()
  } else {
    showToast('خطا در بازگرداندن: ' + result.error, 'error')
  }
}

function confirmDelete(file) {
  selectedFile.value = null
  fileToDelete.value = file
}

function executeDelete() {
  if (!fileToDelete.value) return
  const id = fileToDelete.value.id
  fileToDelete.value = null
  window.HiddenGallery?.deleteFile(id, 'onFileDeleted')
}

function handleFileDeleted(jsonStr) {
  const result = JSON.parse(jsonStr)
  if (result.success) {
    showToast('فایل حذف شد', 'success')
    loadFiles()
  } else {
    showToast('خطا در حذف: ' + result.error, 'error')
  }
}

function onSettingsClick() {
  router.push({ name: 'hg-settings' })
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTypeBadgeClass(mimeType) {
  if (mimeType.startsWith('image/')) return 'bg-teal-600/80 text-white'
  if (mimeType.startsWith('video/')) return 'bg-slate-700/80 text-white'
  return 'bg-white/80 text-slate-600'
}

function getTypeLabel(mimeType) {
  if (mimeType.startsWith('image/')) return 'عکس'
  if (mimeType.startsWith('video/')) return 'ویدیو'
  const ext = mimeType.split('/')[1]?.toUpperCase()
  return ext ? ext.substring(0, 4) : 'فایل'
}

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB'
  return (bytes / 1073741824).toFixed(1) + ' GB'
}

function formatDate(timestamp) {
  if (!timestamp) return '—'
  return new Date(timestamp).toLocaleDateString('fa-IR', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.sheet-enter-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-leave-active {
  transition: transform 0.25s ease-in;
}

.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
}
</style>
