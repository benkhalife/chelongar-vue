
self.addEventListener('message', function (event) {
    var ob = event.data;
    if (ob && ob.action == 'new-cahce') {
      newCache(ob);
    }
  })
  
  var version_number = 1;
  
  
  var cache_name = 'files_v' + version_number;
  var files = [
  ];
  
  
  async function newCache(ob) {
    const cache = await caches.open(cache_name);
    fetch(ob.url)
      .then(request => {
        cache.put(ob.url, request.clone())
          .then(() => {
            console.log('sw ', ob.url, ' cache');
          })
      })
  }
  
  const addResourcesToCache = async (resources) => {
    const cache = await caches.open(cache_name);
    await cache.addAll(resources);
  }
  
  self.addEventListener('install', (event) => {
    console.info('install service worker version : ' + version_number);
    event.waitUntil(addResourcesToCache(files));
  
    setTimeout(() => {
      self.skipWaiting();
    }, 2000);
  
  });
  
  
  
  
  /**
   * fetch from cache or network
   */
  self.addEventListener('fetch', (event) => {
    event.respondWith(loadCaches(event.request));
  });
  
  /**
   *  cache loader control
   * @param  request 
   * @returns response
   */
  const loadCaches = async (request) => {
  
  
    const find_file = await caches.match(request);
  
    // if the request matched the cache
    if (find_file) {
      return find_file;
    }
  
  
    const responseFromNetwork = await fetch(request);
  
    console.log(request.url)
    if(request.url.indexOf('enamad.ir')<0){    
      if (!responseFromNetwork.ok && request.destination=='image') {
        return await fetch('/files/images/static/academy-poster.jpeg');
      }
    
      putInCache(request, responseFromNetwork.clone());
    }
      
    return responseFromNetwork;
  }
  
  const putInCache = async (request, response) => {
    if (['style', 'script', 'manifest', 'image'].indexOf(request.destination) > -1 && response.status == 200 && request.method == 'GET') {
      const cache = await caches.open(cache_name);
      await cache.put(request, response);
    }
  }
  
  
  
  
  self.addEventListener('activate', (event) => {
    console.log('service worker activate');
    event.waitUntil(deleteOldCaches());
  });
  
  const deleteCache = async key => {
    await caches.delete(key)
  }
  
  const deleteOldCaches = async () => {
    const cacheKeepList = [cache_name];
    const keyList = await caches.keys()
    const cachesToDelete = keyList.filter(key => !cacheKeepList.includes(key))
    await Promise.all(cachesToDelete.map(deleteCache));
  }
  