/* App-shell cache only. No Firebase/Google requests are intercepted or cached; cloud actions are explicit. */
const CACHE='lift-family-shell-v1.10.0';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('lift-family-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 const base=new URL('./',self.location.href).pathname;
 if(req.mode==='navigate'&&(url.pathname===base||url.pathname===base+'index.html')){
  event.respondWith(fetch(req).then(response=>{
   if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put('./index.html',copy)));}
   return response;
  }).catch(async()=>await caches.match('./index.html')||await caches.match('./')));
 }else{
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
 }
});
