// ===============================
// ELEMENTS
// ===============================

const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

const errorMessage =
    document.getElementById("errorMessage");

const weatherContent =
    document.getElementById("weatherContent");

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const currentDate =
    document.getElementById("currentDate");

const temperature =
    document.getElementById("temperature");

const condition =
    document.getElementById("condition");

const weatherIcon =
    document.getElementById("weatherIcon");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const feelsLike =
    document.getElementById("feelsLike");

const rain =
    document.getElementById("rain");

const forecast =
    document.getElementById("forecast");


// ===============================
// DEFAULT CITY
// ===============================

const DEFAULT_CITY = "Kano";


// ===============================
// WEATHER CODE
// ===============================

function getWeatherInfo(code) {

    const weatherCodes = {

        0: {
            text: "Clear Sky",
            icon: "☀️"
        },

        1: {
            text: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            text: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            text: "Overcast",
            icon: "☁️"
        },

        45: {
            text: "Foggy",
            icon: "🌫️"
        },

        48: {
            text: "Foggy",
            icon: "🌫️"
        },

        51: {
            text: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            text: "Drizzle",
            icon: "🌦️"
        },

        55: {
            text: "Heavy Drizzle",
            icon: "🌧️"
        },

        61: {
            text: "Light Rain",
            icon: "🌦️"
        },

        63: {
            text: "Rain",
            icon: "🌧️"
        },

        65: {
            text: "Heavy Rain",
            icon: "🌧️"
        },

        71: {
            text: "Light Snow",
            icon: "🌨️"
        },

        73: {
            text: "Snow",
            icon: "🌨️"
        },

        75: {
            text: "Heavy Snow",
            icon: "❄️"
        },

        80: {
            text: "Rain Showers",
            icon: "🌦️"
        },

        81: {
            text: "Rain Showers",
            icon: "🌧️"
        },

        82: {
            text: "Heavy Rain Showers",
            icon: "⛈️"
        },

        95: {
            text: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            text: "Thunderstorm + Hail",
            icon: "⛈️"
        },

        99: {
            text: "Heavy Thunderstorm",
            icon: "⛈️"
        }

    };

    return weatherCodes[code] || {
        text: "Unknown Weather",
        icon: "🌍"
    };
}


// ===============================
// GET LOCATION
// ===============================

async function getLocation(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response =
        await fetch(url);

    if (!response.ok) {
        throw new Error("Location search failed.");
    }

    const data =
        await response.json();

    if (
        !data.results ||
        data.results.length === 0
    ) {
        throw new Error(
            "City not found. Please check the name."
        );
    }

    return data.results[0];
}


// ===============================
// GET WEATHER
// ===============================

async function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;

    const response =
        await fetch(url);

    if (!response.ok) {
        throw new Error(
            "Unable to get weather data."
        );
    }

    return await response.json();
}


// ===============================
// SHOW WEATHER
// ===============================

function displayWeather(location, data) {

    const current =
        data.current;

    const info =
        getWeatherInfo(current.weather_code);


    // Location

    cityName.textContent =
        location.name;

    countryName.textContent =
        location.country || "Unknown";


    // Date

    const date =
        new Date(current.time);

    currentDate.textContent =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "short",
                day: "numeric"
            }
        );


    // Main weather

    temperature.textContent =
        Math.round(current.temperature_2m);

    condition.textContent =
        info.text;

    weatherIcon.textContent =
        info.icon;


    // Details

    humidity.textContent =
        `${current.relative_humidity_2m}%`;

    wind.textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;

    feelsLike.textContent =
        `${Math.round(current.apparent_temperature)}°C`;

    rain.textContent =
        `${current.precipitation} mm`;


    // Forecast

    displayForecast(data.daily);


    errorMessage.textContent = "";
}


// ===============================
// FORECAST
// ===============================

function displayForecast(daily) {

    forecast.innerHTML = "";


    daily.time.forEach((date, index) => {

        const info =
            getWeatherInfo(
                daily.weather_code[index]
            );


        const day =
            new Date(date).toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        const maxTemp =
            Math.round(
                daily.temperature_2m_max[index]
            );

        const minTemp =
            Math.round(
                daily.temperature_2m_min[index]
            );


        const card =
            document.createElement("div");

        card.className =
            "forecast-card";


        card.innerHTML = `

            <div class="forecast-day">
                ${day}
            </div>

            <div class="forecast-icon">
                ${info.icon}
            </div>

            <div class="forecast-temp">
                ${maxTemp}° 
                <span>${minTemp}°</span>
            </div>

        `;


        forecast.appendChild(card);

    });

}


// ===============================
// SEARCH WEATHER
// ===============================

async function searchWeather(city) {

    const searchCity =
        city.trim();

    if (searchCity === "") {

        showError(
            "Please enter a city name."
        );

        return;
    }


    setLoading(true);


    try {

        const location =
            await getLocation(searchCity);


        const data =
            await getWeather(
                location.latitude,
                location.longitude
            );


        displayWeather(
            location,
            data
        );


        localStorage.setItem(
            "lastWeatherCity",
            location.name
        );


    } catch (error) {

        showError(
            error.message
        );

    } finally {

        setLoading(false);

    }

}


// ===============================
// ERROR
// ===============================

function showError(message) {

    errorMessage.textContent =
        message;
}


// ===============================
// LOADING
// ===============================

function setLoading(loading) {

    if (loading) {

        weatherContent.classList.add(
            "loading"
        );

        searchBtn.disabled = true;

        searchBtn.textContent =
            "Loading...";

    } else {

        weatherContent.classList.remove(
            "loading"
        );

        searchBtn.disabled = false;

        searchBtn.textContent =
            "Search";

    }

}


// ===============================
// SEARCH BUTTON
// ===============================

searchBtn.addEventListener(
    "click",
    () => {

        searchWeather(
            cityInput.value
        );

    }
);


// ===============================
// ENTER KEY
// ===============================

cityInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchWeather(
                cityInput.value
            );

        }

    }
);


// ===============================
// LOAD LAST CITY
// ===============================

const savedCity =
    localStorage.getItem(
        "lastWeatherCity"
    );

searchWeather(
    savedCity || DEFAULT_CITY
);
