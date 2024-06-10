const CACHE_NAME = "demo/v7";

const CACHE_FILES = [
    "./index.html",
    "./style.css",
    "./photo.png",
    "./script.js",
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            cache.addAll(CACHE_FILES);
        })
    );
});

self.addEventListener("activate", (e) => {
    // Clean up useless cache
    e.waitUntil(
        caches.keys().then((keyList) => {
            // keyList = ["demo/v1", "demo/v2"]
            // when we delete, this will return us promises and this promise.all() handle all the promises, when all the promises completed it will return success
            return Promise.all(
                keyList.map((key) => {
                    if (key != CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// fetch event will triger every time their is file requested from the server bcz this 
self.addEventListener("fetch", (e) => {
    // Offline exprience
    // Whenever a file is requested,
    // This is a very bad way => 1. check the cache, and return from cache 2. If not available, fetch from the network
    // 1. fetch from network, update my cache 2. cache as a fallback/backup

    e.respondWith(
        fetch(e.request) // requesting from the server 
            // when i am online
            .then((res) => { // taking response from the server
                // update my cache
                const cloneData = res.clone(); // cloning the response
                caches.open(CACHE_NAME).then((cache) => { // updating the cache
                    cache.put(e.request, cloneData);
                });
                console.log("returning from network");
                return res;
            })
            // when i am offline this catch block will run
            .catch(() => {
                console.log("returning from cache");
                return caches.match(e.request).then((file) => file);
            })
    );
});