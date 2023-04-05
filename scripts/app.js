// Import modules
import express from 'express';
import fetch from 'node-fetch';

// set hostname and port
const hostname = '127.0.0.1';
const port = 3000;

// create express app
const app = express();

// create index variable
let index = 0;

// fetch data from API
const response = await fetch('https://type.fit/api/quotes/');
const data = await response.json();

// filter data (filters the quotes with more than 100 characters)
function filterData(data) {
  const filtered = data.filter(quote => quote.text.length < 100);
  let counter = Math.floor(Math.random() * filtered.length);
  return filtered[counter];
}

// set view engine and views
app.set('view engine', 'ejs');
app.set('views', 'views');

// set static files from public folder
app.use( express.static( "public" ) );

// start server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// routes
// GET request for index page
app.get('/', async function(req, res) {
  res.render('index', {data});
});

// GET request for next quote
app.get('/next', async function(req, res) {
  // next quote in the data array
  index++;
  const quote = data[index % data.length];
  res.render('next', {data, quote});
});

// GET request for random quote
app.get('/random', async function(req, res) {
  // random quote from the data array
  const result = filterData(data);
  res.render('random', {data, result});
});

// GET request previous quote not made yet
app.get('/previous', async function(req, res) {
  const result = filterData(data);
  res.render('previous', {data, result});
});

// GET request for offline page
app.get('/offline', async function(req, res) {
  res.render('offline');
});