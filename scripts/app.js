import express from 'express';
import fetch from 'node-fetch';

const hostname = '127.0.0.1';
const port = 3000;

const app = express();

let index = 0;

const response = await fetch('https://type.fit/api/quotes/');
const data = await response.json();

function filterData(data) {
  const filtered = data.filter(quote => quote.text.length < 100);
  let counter = Math.floor(Math.random() * filtered.length);
  return filtered[counter];
}

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use( express.static( "public" ) );

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/', async function(req, res) {
  res.render('index', {data});
});

app.get('/1', async function(req, res) {
  index++;
  const quote = data[index % data.length];
  res.render('next', {data, quote});
});

app.get('/random', async function(req, res) {
  const result = filterData(data)
  res.render('random', {result});
});