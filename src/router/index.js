import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/image-export',
      name: 'image-export',
      component: () => import('./../views/ImageExport.vue')
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('./../views/PrivacyView.vue')
    },
    {
      path: '/hidden-gallery/home',
      name: 'hg-home',
      component: () => import('./../views/HiddenGalleryPage.vue')
    },
    {
      path: '/hidden-gallery/settings',
      name: 'hg-settings',
      component: () => import('./../views/HiddenGallerySettingsView.vue')
    },
    {
      path: '/hidden-gallery/login',
      name: 'hg-login',
      component: () => import('./../views/HiddenGalleryLoginView.vue')
    },
    {

      path: '/sponsore',
      name: 'sponsore',
      component: () => import('./../views/Sponsors.vue')
    },
    {

      path: '/pro',
      name: 'pro',
      component: () => import('./../views/Pro.vue')
    },

    {
      path: '/app',
      name: 'app',
      component: () => import('../views/App.vue')
    },
    {
      path: '/compress/image',
      name: 'compress-image',
      component: () => import('../views/CompressImageView.vue')
    },
    {
      path: '/compress/video',
      name: 'compress-video',
      component: () => import('../views/CompressVideoView.vue')
    },
    {
      path: '/scanner',
      name: 'scanner',
      component: () => import('../views/ScannerView.vue')
    },
    {
      path: '/scanner/action-progress',
      name: 'scanner-action-progress',
      component: () => import('../views/ProgressCompressView.vue')
    },
    {
      path: '/permission',
      name: 'permission',
      component: () => import('../views/PermissionHerlperView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    },
    {
    path: '/about',
    component: ()=>import('@/views/about/AboutLayout.vue'),
    // مسیر پیش‌فرض روی 'درباره ما' تنظیم می‌شود
    redirect: '/about/info', 
    name:'about',
    children: [
      {
        path: 'info',
        name: 'AboutInfo',
        component: ()=>import('@/views/about/AboutInfo.vue'),
      },
      {
        path: 'guide',
        name: 'HowToUse',
        component: ()=>import('@/views/about/HowToUse.vue'),
      },
      {
        path: 'privacy',
        name: 'PrivacyPolicy',
        component: ()=>import('@/views/about/PrivacyPolicy.vue')
      }
    ]
  }
    
  ],
  // این بخش را اضافه کنید:
  scrollBehavior(to, from, savedPosition) {
    // اگر کاربر دکمه Back یا Forward مرورگر را زد، به همان جای قبلی برگردد
    if (savedPosition) {
      return savedPosition
    }
    // در غیر این صورت (رفتن به یک صفحه جدید)، همیشه برو به بالای صفحه
    else {
      return { top: 0 }
    }
  }
})

export default router
