import Swal from "sweetalert2";


export function BuyPackage(sku, payload) {
    console.log('BuyPackage', sku);
    
    if (window.AndroidPayment) {
        console.log('BuyPackage:AndroidPayment:true');
        window.AndroidPayment.startPayment(sku, payload);
    }
}

export async function onPaymentError(message = '') {
    console.log('onPaymentError');

    if (message.length < 5) {
        message = 'ممکن است فعال بودن VPN شما باعث مشکل در ارتباط با پرداخت شود لطفا VPN خود را خاموش کرده و دوباره تلاش کنید'
    }

    Swal.fire({
        title: 'مشکلی روی داده است',
        text: message
    })
}


export async function onPaymentSuccess(sku, orderId, payload) {

    Swal.fire({
        title: 'خرید با موفقیت انجام شد',
        text:'اکنون می‌توانید از امکانات نسخه حرفه‌ای استفاده کنید',
        icon: 'success',
    })
}