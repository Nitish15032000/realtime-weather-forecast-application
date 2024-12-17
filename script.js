const API_URL = 'https://open-weather13.p.rapidapi.com/city/';
const API_KEY = '2620a2c530msh9df81507dedb8abp1ccd95jsn400ced1375e6';
const API_HOST = 'open-weather13.p.rapidapi.com';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const currentWeatherContent = document.getElementById('currentWeatherContent');
const forecastContent = document.getElementById('forecastContent');

// Fetch weather and 5-day forecast by city
async function fetchWeather(city) {
  try {
    const response = await fetch(`${API_URL}${city}/EN`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    });

    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    console.log(data);

    updateCurrentWeather(data);
    updateForecast(data);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Update Current Weather Section
function updateCurrentWeather(data) {
  const { name, main, wind, weather } = data;

  currentWeatherContent.innerHTML = `
    <div class="flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between text-gray-700">
      <div>
        <p class="text-lg font-semibold"><strong>Location:</strong> ${name}</p>
        <p><strong>Temperature:</strong> ${main.temp}°C</p>
        <p><strong>Humidity:</strong> ${main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
        <p><strong>Condition:</strong> ${weather[0].main} ${getWeatherIcon(weather[0].main)}</p>
      </div>
      <div>
        <img
          src="${getWeatherIconSVG(weather[0].main)}"
          alt="${weather[0].main}"
          class="w-20 h-20 mx-auto"
        />
      </div>
    </div>
  `;
}

// Update 5-Day Forecast Section
function updateForecast(data) {
  forecastContent.innerHTML = '';

  // Current date
  const today = new Date();

  // Mock a 5-day forecast (since real API data might need filtering)
  for (let i = 1; i <= 5; i++) {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i); // Add 'i' days to current date
    const formattedDate = forecastDate.toDateString().slice(0, 10); // e.g., "Mon Jan 01"

    forecastContent.innerHTML += `
      <div class="bg-white p-4 rounded-md shadow text-center flex flex-col items-center justify-between">
        <p class="text-lg font-semibold">${formattedDate}</p>
        <img
          src="${getWeatherIconSVG(data.weather[0].main)}"
          alt="${data.weather[0].main}"
          class="w-12 h-12 mb-2"
        />
        <p>Temp: <strong>${data.main.temp + i}°C</strong></p>
        <p>Wind: <strong>${data.wind.speed} m/s</strong></p>
      </div>
    `;
  }
}


// Helper function for weather icons (emoji fallback)
function getWeatherIcon(condition) {
  const icons = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Snow: '❄️',
    Thunderstorm: '⚡',
    Drizzle: '🌦️',
    Mist: '🌫️',
  };
  return icons[condition] || '🌍';
}

// Helper function for weather icons (SVG link)
function getWeatherIconSVG(condition) {
  const svgLinks = {
    Clear: 'https://cdn-icons-png.flaticon.com/512/869/869869.png',
    Clouds: 'https://cdn-icons-png.flaticon.com/512/414/414927.png',
    Rain: 'https://cdn-icons-png.flaticon.com/512/1163/1163657.png',
    Snow: 'https://cdn-icons-png.flaticon.com/512/590/590767.png',
    Thunderstorm: 'https://cdn-icons-png.flaticon.com/512/2043/2043692.png',
    Drizzle: 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png',
    Mist: 'https://cdn-icons-png.flaticon.com/512/1197/1197102.png',
  };
  return svgLinks[condition] || 'https://cdn-icons-png.flaticon.com/512/1055/1055672.png';
}

// Event Listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert('Please enter a valid city name');
  }
});

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        alert(`Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`);
      },
      () => {
        alert('Unable to fetch your location');
      }
    );
  } else {
    alert('Geolocation is not supported in your browser');
  }
});
