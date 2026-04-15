async function install(){
    if ('serviceWorker' in navigator) {
        try {
          registration = await navigator.serviceWorker.register('/sw.js');
    
          if (registration.installing) {
            console.log('Service worker installing');
          }
          else if (registration.waiting) {
            console.log('Service worker is installed')
          }
          else if (registration.active) {
            console.log('Service worker is active')
          }
    
    
        } catch (error) {
          console.error(`Registration failed with ${error}`);
        }
      }
      else {
        console.log('service worker not support :(')
      }
}

// install()