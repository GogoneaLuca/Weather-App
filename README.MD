# Real-Time Weather & Forecast Web App 

A dynamic, asynchronous JavaScript web application that allows users to track real-time weather conditions, search for global cities, and persist their favorite locations.

##  Project Overview
This project was built to demonstrate proficiency in Frontend development, specifically handling asynchronous data streams, integrating multiple external REST APIs, and performing DOM manipulation without relying on heavy frameworks like React.

##  Tech Stack & Features
* **Core Technologies:** HTML5, CSS3, Vanilla JavaScript (ES6+).
* **API Integrations:** * *OpenWeatherMap API:* Fetches real-time meteorological data and 5-day forecasts.
  * *GeoDB Cities API:* Provides dynamic auto-complete suggestions for global city search.
  * *Pexels API:* Dynamically fetches background imagery matching the searched city and current weather conditions.
* **Key Features:**
  * **Asynchronous Data Handling:** Utilizes modern `async/await` syntax and `fetch` with error handling (`try/catch`).
  * **Data Persistence:** Uses the browser's `localStorage` to save and retrieve the user's favorite cities across sessions.
  * **Dynamic DOM Manipulation:** UI components are created and destroyed dynamically based on API responses, ensuring a smooth, reload-free User Experience (SPA behavior).

##  Note on Security
For security reasons and to prevent credential leakage, API keys are not committed to this repository. To run this project locally, clone the repo and insert your own keys in the designated `const` variables inside `scripts/index.js`.
