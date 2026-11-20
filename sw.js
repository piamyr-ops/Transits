/* Transits offline app shell: automatic, no user configuration. */
const CACHE='transits-offline-v7-tutorial-button-20261120';
const SHELL=['./index.html'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('transits-offline-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]));
});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.mode!=='navigate'||u.origin!==self.location.origin||e.request.method!=='GET')return;
 e.respondWith(fetch(e.request).then(resp=>{
   if(resp.ok){const copy=resp.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put('./index.html',copy)).catch(()=>{}));}
   return resp;
 }).catch(async()=>{const cache=await caches.open(CACHE);return (await cache.match('./index.html'))||Response.error()}));
});
