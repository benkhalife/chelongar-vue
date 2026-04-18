// directives/longpress.js
export default {
  mounted(el, binding) {
    let pressTimer = null

    const start = (e) => {
      pressTimer = setTimeout(() => {
        binding.value(e)
      }, 600)
    }

    const cancel = () => {
      clearTimeout(pressTimer)
      pressTimer = null
    }

    // ذخیره توابع روی element برای دسترسی در unmounted
    el._longPressStart = start
    el._longPressCancel = cancel

    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)
    el.addEventListener('mouseup', cancel)
    el.addEventListener('mouseleave', cancel)
    el.addEventListener('touchend', cancel)
  },

  unmounted(el) {
    // حذف همه event listener ها
    el.removeEventListener('mousedown', el._longPressStart)
    el.removeEventListener('touchstart', el._longPressStart)
    el.removeEventListener('mouseup', el._longPressCancel)
    el.removeEventListener('mouseleave', el._longPressCancel)
    el.removeEventListener('touchend', el._longPressCancel)

    // پاکسازی reference ها
    delete el._longPressStart
    delete el._longPressCancel
  }
}
