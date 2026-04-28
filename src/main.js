import { createApp } from 'vue'
import 'vue-sonner/style.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { onPaymentError, onPaymentSuccess } from './data/Payment'
import longpress from './directives/longpress'

const app = createApp(App)
app.directive('longpress', longpress)

app.use(router)

const main =  app.mount('#app')


window.onPaymentSuccess = onPaymentSuccess
window.onPaymentError = onPaymentError

