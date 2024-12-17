const API_URL = "https://open-weather13.p.rapidapi.com/city/";
const API_KEY = "2620a2c530msh9df81507dedb8abp1ccd95jsn400ced1375e6";
const API_HOST = "open-weather13.p.rapidapi.com";

// Select DOM elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const currentWeatherSection = document.getElementById("currWeather");
const forecastSection = document.getElementById("forecastWeather");

// Fetch current weather and 5-day forecast
async function fetchWeatherForecast(city) {
  try {
    // Fetch weather data for the city
    const url = `${API_URL}${city}/EN`; // Assumes 'EN' as the language
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    });

    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    console.log(data); // Check the API response structure
    updateCurrentWeather(data);
    updateForecast(data);
  } catch (error) {
    alert(error.message);
  }
}

// Update the current weather section
function updateCurrentWeather(data) {
  const { name, main, wind, weather } = data;

  const date = new Date().toISOString().split("T")[0];
  currentWeatherSection.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">${name} (${date})</h2>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div>
        <p class="text-lg">Temperature: <strong>${main.temp}°C</strong></p>
        <p>Wind: <strong>${wind.speed} m/s</strong></p>
        <p>Humidity: <strong>${main.humidity}%</strong></p>
      </div>
      <div class="text-4xl mt-4 md:mt-0">
        <span>${getWeatherIcon(weather[0].main)}</span>
      </div>
    </div>
  `;
}

// Update the 5-day forecast section
function updateForecast(data) {
  const forecasts = data.forecast || [];
  forecastSection.innerHTML = "";

  forecasts.forEach((forecast) => {
    const { date, temp_min, temp_max, humidity, wind_speed, weather } =
      forecast;

    forecastSection.innerHTML += `
      <div class="bg-gray-100 p-4 rounded-md text-center shadow">
        <p class="font-semibold">${date}</p>
        <div class="text-3xl my-2">${getWeatherIcon(weather)}</div>
        <p>Min Temp: <strong>${temp_min}°C</strong></p>
        <p>Max Temp: <strong>${temp_max}°C</strong></p>
        <p>Wind: <strong>${wind_speed} m/s</strong></p>
        <p>Humidity: <strong>${humidity}%</strong></p>
      </div>
    `;
  });
}

// Helper function to get weather icons
function getWeatherIcon(condition) {
  const icons = {
    Clear: "☀",
    Clouds: "☁",
    Rain: "☔",
    Snow: "❄",
    Thunderstorm: "⚡",
    Drizzle: "🌦",
    Mist: "🌫",
  };
  return icons[condition] || "🌈";
}

// Event listeners for search button
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherForecast(city);
  } else {
    alert("Please enter a valid city name.");
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherForecastByLocation(latitude, longitude);
      },
      () => {
        alert("Unable to retrieve your location.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});
