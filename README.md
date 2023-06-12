# Progressive-web-apps-2223
The course Progressive Web Apps is about learning to build server side rendered applications. Progressive Web Apps is part of the half year minor programme about Web Design and Development in Amsterdam. Bachelor Communication and Multimedia Design, Amsterdam University of Applied Science.

For Progressive web apps I made a web app that shows quotes. When you land on the website, you will see the first quote in the array. There are also 10 other quotes on the side. It also contains buttons to navigate to other quotes. I have a next button where you go to the next quote in the array and a button that gives a random quote, but the random button is still in progress.

Live demo: https://pwa.dragonsake.repl.co/

***

# Table of content

* [Installation](#installation)
   + [Clone repository](#clone-repository)
   + [Install packages](#install-packages)
   + [Start server](#start-server)
   + [Localhost](#localhost)
* [Activity diagram](#activity-diagram)
* [Server side rendering](#server-side-rendering)
* [Manifest](#manifest)
* [Service worker](#service-worker)
* [Minify](#minify)
* [Checklist](#checklist)
* [License](#license)

***

## Installation

### Clone repository

You can install this project on your computer by cloning this repository. You can use GitHub desktop or the terminal to run this following command.

```
git clone https://https://github.com/DragonSake/progressive-web-apps-2223.git
```

### Install packages

After that we have to install we packages. You can do this by running the following commands.

```
npm install
```


```
npm install express
```

### Start server

Now you can start the server on your local dev environment with the following command.

```
npm run dev
```

### Localhost

The server shall start on

```
http://localhost:3000/
```

***

### Activity diagram

To make the web app easier to understand, I used an activity diagram. These are like flowcharts with pictures and lines that shows the steps. 

When a client is using this in his/her web browser, it's doing a GET request to retrieve information from a server. When it gets rejected, you will see an offline page. If it's accepted, you will see the page in it's ideal state. If you click on next quote, it goes to the next quote. When you suddenly have no internet anymore, it will check if the page is cached or not.

If it's cached, you will see the page. If it's not cached, you will see a 404 page not found and the 10 quotes on the right will not show.

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

### Sources

* https://nodejs.org/en/docs/guides/getting-started-guide
* https://expressjs.com/en/starter/installing.html
* https://www.npmjs.com/package/node-fetch
* https://dev.to/yogesnsamy/how-to-add-custom-css-javascript-files-to-an-expressjs-app-48cp
* https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application
* https://stackoverflow.com/questions/18629327/adding-css-file-to-ejs
* https://stackoverflow.com/questions/15350025/express-js-single-routing-handler-for-multiple-routes-in-a-single-line
* https://web.dev/learn/pwa/service-workers/
* https://www.youtube.com/watch?v=6s697AJdlB8
* https://stackoverflow.com/questions/8216918/can-i-use-conditional-statements-with-ejs-templates-in-jmvc
* https://app-manifest.firebaseapp.com/
* https://www.simicart.com/manifest-generator.html/
* https://manifest-gen.netlify.app/
* https://www.w3schools.com/howto/howto_html_favicon.asp#:~:text=A%20favicon%20is%20a%20small,like%20https%3A%2F%2Ffavicon.cc.
* https://developer.chrome.com/docs/workbox/caching-strategies-overview/
* https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers#lifecycle_of_a_service_worker
* https://stackoverflow.com/questions/64483524/service-worker-not-returning-custom-offline-page-it-is-instead-returning-the-def
* https://gulpjs.com/docs/en/getting-started/quick-start/

***

### License

MIT License
