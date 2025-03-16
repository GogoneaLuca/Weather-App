document.addEventListener("DOMContentLoaded", async (_eveniment) => {

    async function preiaImagineFundalInitiala() {
        const raspuns = await fetch(`https://api.pexels.com/v1/search?query=weather`, {
            method: 'GET',
            headers: {
                'Authorization': 'HH8PrmKTpsqRWqMr7S1s9NlEaHYpNx2X06v7zpTjUdN8oan3CPmu0G36'
            }
        });
        const date = await raspuns.json();
        return date.photos[0].src.original;
    }

    const imagineFundalInitiala = await preiaImagineFundalInitiala();
    document.body.style.backgroundImage = `url(${imagineFundalInitiala})`;

    const input = document.createElement("input");
    input.setAttribute("id", "city-input");
    input.setAttribute("placeholder", "Introduceți numele orașului...");
    document.getElementById("root").appendChild(input);

    const sugestii = document.createElement("div");
    sugestii.setAttribute("id", "suggestions");
    document.getElementById("root").appendChild(sugestii);

    const cardMeteo = document.createElement("div");
    cardMeteo.setAttribute("id", "weather-card");
    cardMeteo.style.display = "none";
    document.getElementById("root").appendChild(cardMeteo);

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    spinner.style.display = "none";
    cardMeteo.appendChild(spinner);

    const containerFavorite = document.createElement("div");
    containerFavorite.setAttribute("id", "favorites-container");
    document.getElementById("root").appendChild(containerFavorite);

    async function preiaOrase(cautare) {
        const raspuns = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${cautare}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '90795627fdmsh1a0bef2e0e38ebdp16812cjsn5537c2bd23ae',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });
        const date = await raspuns.json();
        return date.data.map(orase => orase.city);
    }

    async function preiaMeteo(orase) {
        const raspuns = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${orase}&appid=f27dfd2d00481db71bc440f5980bbc20&units=metric`);
        const date = await raspuns.json();
        return date;
    }

    async function preiaPrognoza(orase) {
        const raspuns = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${orase}&appid=f27dfd2d00481db71bc440f5980bbc20&units=metric`);
        const date = await raspuns.json();
        return date;
    }

    async function preiaImagineOras(orase, vreme) {
        const raspuns = await fetch(`https://api.pexels.com/v1/search?query=${orase} ${vreme}`, {
            method: 'GET',
            headers: {
                'Authorization': 'HH8PrmKTpsqRWqMr7S1s9NlEaHYpNx2X06v7zpTjUdN8oan3CPmu0G36'
            }
        });
        const date = await raspuns.json();
        return date.photos[0].src.original;
    }

    function afiseazaMeteo(date) {
        cardMeteo.innerHTML = `
            <h2>Vremea în ${date.name}</h2>
            <p>Temperatura: ${date.main.temp} °C</p>
            <p>Cer: ${date.weather[0].description}</p>
            <p>Umiditate: ${date.main.humidity}%</p>
            <button id="favorite-btn">❤️ Adaugă la favorite</button>
        `;
        cardMeteo.style.display = "block";

        document.getElementById("favorite-btn").addEventListener("click", () => {
            adaugaOrasFavorit(date.name);
        });
    }

    function afiseazaPrognoza(date) {
        const containerPrognoza = document.createElement("div");
        containerPrognoza.setAttribute("id", "forecast-container");
        containerPrognoza.innerHTML = "<h3>Prognoza pe 5 zile</h3>";

        date.list.forEach((prognoza, index) => {
            if (index % 8 === 0) {
                const elementPrognoza = document.createElement("div");
                elementPrognoza.innerHTML = `
                    <p>${new Date(prognoza.dt_txt).toLocaleDateString()}</p>
                    <p>Temperatura: ${prognoza.main.temp} °C</p>
                    <p>Cer: ${prognoza.weather[0].description}</p>
                `;
                containerPrognoza.appendChild(elementPrognoza);
            }
        });

        cardMeteo.appendChild(containerPrognoza);
    }

    function seteazaImagineFundal(imagineUrl) {
        document.body.style.backgroundImage = `url(${imagineUrl})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.color = "white";
    }

    function adaugaOrasFavorit(orase) {
        let favorite = JSON.parse(localStorage.getItem("favorites")) || [];
        if (!favorite.includes(orase)) {
            favorite.push(orase);
            localStorage.setItem("favorites", JSON.stringify(favorite));
            afiseazaFavorite();
        }
    }

    function afiseazaFavorite() {
        containerFavorite.innerHTML = "<h3>Orașe favorite</h3>";
        let favorite = JSON.parse(localStorage.getItem("favorites")) || [];
        favorite.forEach(orase => {
            const elementFavorit = document.createElement("div");
            elementFavorit.textContent = orase;
            elementFavorit.addEventListener("click", async () => {
                input.value = orase;
                sugestii.innerHTML = "";
                cardMeteo.style.display = "none";
                spinner.style.display = "block";
                const dateMeteo = await preiaMeteo(orase);
                afiseazaMeteo(dateMeteo);
                const datePrognoza = await preiaPrognoza(orase);
                afiseazaPrognoza(datePrognoza);
                const imagineUrl = await preiaImagineOras(orase, dateMeteo.weather[0].description);
                seteazaImagineFundal(imagineUrl);
                spinner.style.display = "none";
            });
            containerFavorite.appendChild(elementFavorit);
        });
    }

    afiseazaFavorite();

    input.addEventListener("input", async (eveniment) => {
        const cautare = eveniment.target.value;
        sugestii.innerHTML = "";

        if (cautare.length >= 3) {
            const orase = await preiaOrase(cautare);
            orase.forEach(orase => {
                const elementSugestie = document.createElement("div");
                elementSugestie.textContent = orase;
                elementSugestie.addEventListener("click", async () => {
                    input.value = orase;
                    sugestii.innerHTML = "";
                    cardMeteo.style.display = "none";
                    spinner.style.display = "block";
                    const dateMeteo = await preiaMeteo(orase);
                    afiseazaMeteo(dateMeteo);
                    const datePrognoza = await preiaPrognoza(orase);
                    afiseazaPrognoza(datePrognoza);
                    const imagineUrl = await preiaImagineOras(orase, dateMeteo.weather[0].description);
                    seteazaImagineFundal(imagineUrl);
                    spinner.style.display = "none";
                });
                sugestii.appendChild(elementSugestie);
            });
        } else if (cautare.length === 0) {
            afiseazaFavorite();
        }
    });
});