# Progressive-web-apps-2223
The course Progressive Web Apps is about learning to build server side rendered applications. Progressive Web Apps is part of the half year minor programme about Web Design and Development in Amsterdam. Bachelor Communication and Multimedia Design, Amsterdam University of Applied Science.

***

# Table of content

* [Installation](#installation)
* [Activity diagram](#activity-diagram)
* [Server side rendering](#server-side-rendering)
* [Manifest](#manifest)
* [Service worker](#service-worker)
* [Minify](#minify)
* [Checklist](#checklist)
* [License](#license)

***

# Inhoudsopgave

  * [Installatie](#installatie)
    + [Clone repository](#clone-repository)
    + [Install packages](#install-packages)
    + [Server starten](#server-starten)
    + [Localhost](#localhost)
  * [API](#api)
    + [Welke API heb ik hiervoor gebruikt?](#welke-api-heb-ik-hiervoor-gebruikt-)
    + [Fetch](#fetch)
  * [Features](#features)
    + [Join and leave](#join-and-leave)
    + [Messages](#messages)
    + [History](#history)
    + [Check guess](#check-guess)
    + [Guessed right champion](#guessed-right-champion)
    + [New champion](#new-champion)
    + [Easter egg](#easter-egg)
  * [API data model](#api-data-model)
  * [Data flow diagram](#data-flow-diagram)
  * [MoSCoW](#moscow)
  * [Bronnen](#bronnen)
  * [License](#license)

### Installation

Clone the repository. 

Install node and express.

Use npm run build.

```
git clone https://https://github.com/DragonSake/progressive-web-apps-2223.git
```

***

### Activity diagram

![AD](https://user-images.githubusercontent.com/40611000/230353669-0726e5f6-dc12-4b64-9ae8-aaea39690bff.jpg)

***

### Server side rendering

```JS
import express from 'express';
import fetch from 'node-fetch';

const hostname = '127.0.0.1';
const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use( express.static( "public" ) );

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/', async function(req, res) {
  res.render('index', {data});
});

app.get('/next', async function(req, res) {
  index++;
  console.log(index);
  const quote = data[index % data.length];
  res.render('next', {data, quote});
});

app.get('/random', async function(req, res) {
  const result = filterData(data);
  res.render('random', {data, result});
});

app.get('/previous', async function(req, res) {
  const result = filterData(data);
  res.render('previous', {data, result});
});

app.get('/offline', async function(req, res) {
  res.render('offline');
});
```

***

### Manifest

A manifest provides information to a web browser or a web app about the application's metadata. It is used to define the web's appearance when it is downloaded as a standalone app.

```JSON
{
  "name": "Single Page App",
  "short_name": "SPA",
  "start_url": "/",
  "display" : "standalone",
  "theme_color" : "#ffed00",
  "background_color" : "#ffffff",

  "icons": [
  {
    "src": "/images/icon-192x192.png",
    "type": "image/png",
    "sizes": "192x192"
  },
  {
    "src": "/images/icon-256x256.png",
    "type": "image/png",
    "sizes": "256x256"
  },
  {
    "src": "/images/icon-384x384.png",
    "type": "image/png",
    "sizes": "384x384"
  }
  ,
  {
    "src": "/images/icon-512x512.png",
    "type": "image/png",
    "sizes": "512x512"
  }
]
}
```

***

### Service worker

If you enter my website for the first time. It saves the data in the cache. So the next time if you load my website with no wifi, you can still see the first quote. If your internet stopped working and you try to load a page where you haven't been before, you will see the offline page. In order to do that, I used this code:

```JS
const CACHE_NAME = 'cash';

self.addEventListener('install', function(event) { 
    console.log('Service worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
                '/',
                '/images/bg.png',
                '/images/icon-192x192.png',
                '/images/q.png',
                '/manifest.json',
                '/style/style.css',
                '/scripts/main.js',
                '/offline'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('Service worker activating...');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('cash-') && cacheName !== CACHE_NAME;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Fetching...");
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        const fetchPromise = fetch(event.request)
        .then((fetchedResponse) => {
          const cacheCopy = fetchedResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
          return fetchedResponse;
        });
        return cachedResponse || fetchPromise;
      } else {
        return fetch(event.request)
          .then((fetchedResponse) => {
            const cacheCopy = fetchedResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
            return fetchedResponse;
          })
          .catch(() => {
            return caches.match("/offline");
          });
      }
    })
  );
});


```

***

### Minify

Reasons to minify
* It reduces the file size. (It removes unnessesary characters from the code. Such as white space.)
* It improves website speed.

```JS
import gulp from 'gulp';
import concat from 'gulp-concat';
import minify from 'gulp-minify';
import cleanCss from 'gulp-clean-css';
import minifyejs from 'gulp-minify-ejs';

gulp.task('pack-js', function () {    
    return gulp.src(['public/scripts/*.js'])
        .pipe(concat('main.js'))
        .pipe(minify({
            ext:{
                min:'.js'
            },
            noSource: true
        }))
        .pipe(gulp.dest('public/build/js'));
});
 
gulp.task('pack-css', function () {    
    return gulp.src(['public/style/*.css'])
        .pipe(concat('style.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('public/build/css'));
});
gulp.task('default', gulp.series('pack-js', 'pack-css'));
```

Before

![before](https://user-images.githubusercontent.com/40611000/230232485-d9f953e6-352e-477b-90d6-c013a32dcffb.PNG)

After

![after](https://user-images.githubusercontent.com/40611000/230342722-d6168931-82df-40c8-8808-3e6c9c4c175b.PNG)

***

### Checklist

- [x] Activity diagram
- [x] Server side
- [x] Filter quotes
- [x] Fix author null
- [x] Manifest
- [x] Downloadable
- [x] Minify using gulp
- [ ] Buttons (all of them working)

***

### License

MIT
