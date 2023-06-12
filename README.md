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
    + [Express](#express)
    + [Fetch](#fetch)
    + [EJS](#ejs)
    + [Adding CSS to EJS](#adding-css-to-ejs)
    + [Different routes](#different-routes)
  * [Critical rendering path](#critical-rendering-path)
    + [Service worker](#service-worker)
    + [Manifest](#manifest)
    + [Minify](#minify)
    + [Before](#before)
    + [After](#after)
  * [Checklist](#checklist)
  * [Sources](#sources)
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

## Activity diagram

To make the web app easier to understand, I used an activity diagram. These are like flowcharts with pictures and lines that shows the steps. 

When a client is using this in his/her web browser, it's doing a GET request to retrieve information from a server. When it gets rejected, you will see an offline page. If it's accepted, you will see the page in it's ideal state. If you click on next quote, it goes to the next quote. When you suddenly have no internet anymore, it will check if the page is cached or not.

If it's cached, you will see the page. If it's not cached, you will see a 404 page not found and the 10 quotes on the right will not show.

![AD](https://user-images.githubusercontent.com/40611000/230353669-0726e5f6-dc12-4b64-9ae8-aaea39690bff.jpg)

***

## Server side rendering

### Express

To start the server I used express with the following code.

```JS
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

### Fetch

I used this code to fetch data.

```JS
import fetch from 'node-fetch';
```

### EJS

To create partials I used EJS with the following code. I used this because, it's like a template. This way I can reuse the code.

```JS
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Single Page App</title>
  <link rel="stylesheet" href="./style/style.css">
</head>

<body>
```

```JS
<footer>
    <p>© 2023 Tingting Li</p>
  </footer>
  </body>
  
  </html>
```

### Adding CSS to EJS

To tell express.js to make files in the public folder accessible to clients, I used this code. This way they can view files like HTML, CSS, images, etc. when they access the application.

```JS
app.use( express.static( "public" ) );
```


### Different routes

To create a website using node.js and express.js, I used the following code.

I set up different routes for different URLs using the app.get() function. For the main page ("/"), I rendered the "index" template and passed data to it. For the URL "/1", I rendered the "next" template and also passed data to it.
For the "/random" URL, I rendered the "random" template and passed the data to it. These templates allow me to create dynamic web pages that can show different content based on the data I give.

```JS
app.get('/', async function(req, res) {
  res.render('index', {data});
});

app.get('/1', async function(req, res) {
  res.render('next', {data});
});

app.get('/random', async function(req, res) {
  const counter = Math.floor(Math.random() * data.length);
  res.render('random', {data, counter});
});
```

***

## Critical rendering path

### Service worker

To make sure that a web application is still be accessible and function even when the user is offline or has a weak network connection, I used the caching using a service worker. By caching web app assets like HTML, CSS, JavaScript, and images, the service worker allows the web app to store and retrieve these data, enabling offline access and improved performance.

If you enter my website for the first time. It saves the data in the cache. So the next time if you load my website with no wifi, you can still see the first quote. If your internet stopped working and you try to load a page where you haven't been before, you will see the offline page. In order to do that, I used this code.

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

### Manifest

To give a web browser or web app information about an application's metadata, I used a manifest. It helps define how the web app appears when it is downloaded and used as a standalone application.

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

### Minify

To reduce file size, improve website speed, I used minify. This removes unnecessary characters like white spaces from the code. I used a tool called Gulp, which automates various tasks, including minifying and optimizing JavaScript and CSS files, resulting in smaller and faster files for the web application.

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

### Before

![before](https://user-images.githubusercontent.com/40611000/230232485-d9f953e6-352e-477b-90d6-c013a32dcffb.PNG)

### After

![after](https://user-images.githubusercontent.com/40611000/230342722-d6168931-82df-40c8-8808-3e6c9c4c175b.PNG)

***

## Checklist

- [x] Activity diagram
- [x] Server side
- [x] Filter quotes
- [x] Fix author null
- [x] Manifest
- [x] Downloadable
- [x] Minify using gulp
- [ ] Buttons (all of them working)

***

## Sources

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

## License

MIT License
