// Importeren van functies uit een andere module
import { prevnext } from "./prevnext.js";
import { showLoading } from "./showloading.js";
import { hideLoading } from "./hideloading.js";
import { fixNullAuthor } from "./fixnullauthor.js";
import { lijstje } from "./lijstje.js";
// import { fetchData } from "./fetch.js";

// Exporteert de let naar een andere module
export let data;
export let counter = 0;

// Haalt de elementen uit de HTML en exporteert deze
export const blockquote = document.querySelector('blockquote')
export const figcaption = document.querySelector('figcaption')

// Haalt de buttons uit de HTML
const vorige = document.querySelector('button:first-of-type')
const random = document.querySelector('li:nth-of-type(2) button')
const next = document.querySelector('li:nth-of-type(3) button')

// Maakt de value gelijk aan de counter
export function setCounterToValue(value) {
    counter = value;
}

// Wacht totdat de url is gefetcht
async function fetchData (){
    const url = "https://type.fit/api/quotes/"

    // Wacht totdat de url is gefetcht
    await fetch(url)
    .then(response => {
        if (!response.ok) { // Als de status okay is
          throw new Error('404 API NOT FOUND');
        }
        return response.json();
    })

    .then(val => {
        // Voert de functie uit
        showLoading();

        // Verandert de data in de array die gefilterd is met de array die 99 of minder karakters heeft
        data = val.filter(quote => quote.text.length < 100);

        // Definieert de data met de array waarin alle null is veranderd naar onbekend
        data = fixNullAuthor(data);
        // Voert de functie uit
        prevnext(data);
        lijstje(data);
        hideLoading();
    })
        
    .catch(error => {
        // Laat de error zien in de console
        console.log(error)

        // Verandert de tekst naar 404 QUOTE NOT FOUND
        blockquote.textContent = '404 QUOTE NOT FOUND';

        // Haalt de h2 op uit de HTML
        const h2 = document.querySelector('h2')

        // Plaatst de tekst erin
        h2.textContent = 'NO OTHER QUOTES FOUND';

        // Haalt de loading state weg
        hideLoading();
        });
}      

// Wacht totdat de functie klaar is
await fetchData();

// Als er op de button word geklikt, dan voert hij de functie uit en voegt hij -1 toe aan de counter 
vorige.addEventListener("click", function() {
    counter--;
    prevnext(data);
});

// Als er op de button word geklikt, dan voert hij de functie uit en voegt hij +1 toe aan de counter 
next.addEventListener("click", function() {
    counter++;
    prevnext(data);
});

// Als er op de button word geklikt, dan voert hij de functie uit en voegt hij een randomgetal toe aan de counter 
random.addEventListener("click", function() {
    counter = Math.floor(Math.random() * 1203);
    prevnext(data);
});
