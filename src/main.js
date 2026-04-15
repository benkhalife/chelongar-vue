import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { onPaymentError, onPaymentSuccess } from './data/Payment'


const app = createApp(App)

app.use(router)

const main =  app.mount('#app')


window.onPaymentSuccess = onPaymentSuccess
window.onPaymentError = onPaymentError


// import { registerSW } from 'virtual:pwa-register'


// main.update_sw = registerSW({
//     immediate: false,
//   onNeedRefresh() {
//     console.log('onNeedRefresh.')
//     main.update_box = true;
//   },
//   onOfflineReady() {
//     console.log('onOfflineReady')
//   },
// })
