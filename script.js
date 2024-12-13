const apiKey = '617ade664175b8b001be44212f6f853c';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city');
const weatherInfo = document.getElementById('weather-info');
const extendedForecast = document.getElementById('extended-forecast');
const forecastContainer = document.getElementById('forecast-container');
const locationBtn = document.getElementById('location-btn');

// Function to fetch weather data by city name
const fetchWeatherByCity = async (city) => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  if (data.cod === '404') {
    alert('City not found!');
  } else {
    displayWeather(data);
  }
};

// Function to fetch weather data by geolocation
const fetchWeatherByCoords = async (latitude, longitude) => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  displayWeather(data);
};

// Display weather data
const displayWeather = (data) => {
  const { name, weather, main, wind } = data;
  document.getElementById('city-name').textContent = name;
  document.getElementById('temp').textContent = `${main.temp}°C`;
  document.getElementById('condition').textContent = weather[0].description;
  document.getElementById('humidity').children[0].textContent = main.humidity;
  document.getElementById('wind-speed').children[0].textContent = wind.speed;
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

  weatherInfo.classList.remove('hidden');
  getExtendedForecast(name);
};

// Function to fetch extended forecast (5-day forecast)
const getExtendedForecast = async (city) => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  forecastContainer.innerHTML = '';

  data.list.slice(0, 5).forEach((forecast) => {
    const forecastDiv = document.createElement('div');
    forecastDiv.classList.add('text-center');
    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    forecastDiv.innerHTML = `
      <p>${date}</p>
      <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" class="w-12 h-12 mx-auto" />
      <p>${forecast.main.temp}°C</p>
      <p>Wind: ${forecast.wind.speed} m/s</p>
    `;
    forecastContainer.appendChild(forecastDiv);
  });

  extendedForecast.classList.remove('hidden');
};

// Handle search button click
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
  } else {
    alert('Please enter a city name!');
  }
});

// Handle geolocation button click
locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      await fetchWeatherByCoords(latitude, longitude);
    }, () => {
      alert('Geolocation failed!');
    });
  } else {
    alert('Geolocation is not supported by this browser!');
  }
});
