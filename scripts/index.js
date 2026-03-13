document.addEventListener("DOMContentLoaded", async () => {
    // --- API CONFIGURATION 
    const PEXELS_API_KEY = "YOUR_PEXELS_API_KEY"; 
    const WEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY";
    const GEO_DB_KEY = "YOUR_RAPIDAPI_GEO_DB_KEY";

    // --- DOM ELEMENTS ---
    const root = document.getElementById("root");
    const input = document.createElement("input");
    input.setAttribute("id", "city-input");
    input.setAttribute("placeholder", "Introduceți numele orașului...");
    
    const sugestii = document.createElement("div");
    sugestii.setAttribute("id", "suggestions");
    
    const cardMeteo = document.createElement("div");
    cardMeteo.setAttribute("id", "weather-card");
    cardMeteo.style.display = "none";
    
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    spinner.style.display = "none";
    cardMeteo.appendChild(spinner);
    
    const containerFavorite = document.createElement("div");
    containerFavorite.setAttribute("id", "favorites-container");

    // Append to DOM
    root.append(input, sugestii, cardMeteo, containerFavorite);

    // --- ASYNC API FETCHING ---
    async function fetchData(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Fetch error:", error);
            return null;
        }
    }

    async function preiaMeteo(oras) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${oras}&appid=${WEATHER_API_KEY}&units=metric`;
        return await fetchData(url);
    }

    // --- UI RENDERING ---
    function afiseazaMeteo(date) {
        if (!date) return;
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

    // --- LOCAL STORAGE (FAVORITES) ---
    function adaugaOrasFavorit(oras) {
        let favorite = JSON.parse(localStorage.getItem("favorites")) || [];
        if (!favorite.includes(oras)) {
            favorite.push(oras);
            localStorage.setItem("favorites", JSON.stringify(favorite));
            afiseazaFavorite();
        }
    }

    function afiseazaFavorite() {
        containerFavorite.innerHTML = "<h3>Orașe favorite</h3>";
        let favorite = JSON.parse(localStorage.getItem("favorites")) || [];
        favorite.forEach(oras => {
            const elementFavorit = document.createElement("div");
            elementFavorit.textContent = oras;
            elementFavorit.addEventListener("click", async () => {
                input.value = oras;
                cardMeteo.style.display = "none";
                spinner.style.display = "block";
                const dateMeteo = await preiaMeteo(oras);
                afiseazaMeteo(dateMeteo);
                spinner.style.display = "none";
            });
            containerFavorite.appendChild(elementFavorit);
        });
    }

    // Init Favorites
    afiseazaFavorite();
});
