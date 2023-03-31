// 5 quotes worden ingeladen
export function lijstje(data){
    // Haalt de id op uit de HTML (dit is de ul)
    const section = document.querySelector('#quoten')
    
    // Loopt zich voor 10x
    for (let i = 0; i < 10; i++) {
        // Geeft een random getal in de array
        var counter = Math.floor(Math.random() * data.length - 1);
        
        // De tekst en naam worden opgeslagen in een constante
        const quote = data[counter].text
        const naam = data[counter].author
    
        // Creert een li element en zet de variabele quote en naam in de h2 en p
        const li = document.createElement('li');
        li.innerHTML = `
            <h2>${quote}</h2>
            <p>~${naam}</p>
        `;

        // Voegt de li toe aan de section
        section.appendChild(li);
    }
}