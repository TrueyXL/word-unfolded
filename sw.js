// Offline support: app shell cache-first, Bible text network-first with cache fallback.
const V="wu-v1";
const SHELL=["./","index.html","style.css","app.js","firebase-config.js","manifest.json","icon.svg","data/books.js","data/glossary.js","data/prophets.js","data/summaries-prophets.js","data/summaries-nt.js","data/exams-prophets.js","data/exams-nt.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=="wu-text").map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET")return;
  if(u.hostname==="bible-api.com"){
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cl=r.clone();caches.open("wu-text").then(c=>c.put(e.request,cl))}return r}).catch(()=>caches.match(e.request)));
    return;
  }
  if(u.origin===location.origin){
    // network-first for the shell so updates show up, cache as fallback
    e.respondWith(fetch(e.request).then(r=>{const cl=r.clone();caches.open(V).then(c=>c.put(e.request,cl));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
  }
});
