// Importeert uit een ander module
import {counter, blockquote, figcaption, setCounterToValue} from './js.js'

export function prevnext(data) {
    // Als de counter 1204 wordt en de lengte van de array is 1203, dan verandert de counter naar 0
    if (counter > data.length){
        setCounterToValue(0);
    }else if (counter < 0){
        // Als de counter kleiner is dan 0 (als je op de pagina komt en drukt op previous quote), dan verandert de counter naar 1202
        setCounterToValue(1202);
      }

    // De tekst en naam worden opgeslagen in een constante
    const quote = data[counter].text
    const naam = data[counter].author

    // De tekst en naam worden in de blockquote en figcaption geplaatst
    blockquote.textContent = `${quote} `;
    figcaption.textContent =  `~ ${naam} `;
}