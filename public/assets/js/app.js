const searchInput = document.querySelector("#location-search-input");

const searchForm = document.querySelector(".get-weather");
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const date = new Date();
  date.setTime(date.getTime() + 3600 * 10000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = "searchInput" + "=" + searchInput.value + ";" + expires + ";path=/";
  getCoordinates();
});

// Read the cookie when the page is loaded
const cookieValue = document.cookie
  .split('; ')
  .find(row => row.startsWith('searchInput='))
  .split('=')[1];
if (cookieValue) {
  searchInput.value = cookieValue;
  getCoordinates();
}

async function getCoordinates() {
  try {
    const url = `${endpointCoordinates}?q=${searchInput.value}&limit=1&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    getLongLati(data);
  } catch (error) {
    console.error(error);
  }
}

function getLongLati(data) {
  const longitude = data[0].lon;
  const latitude = data[0].lat;
  getWeatherData(longitude, latitude);
  getForecastData(longitude, latitude);
  getSunriseSunset(longitude, latitude);
}

async function getWeatherData(longitude, latitude) {
  try {
    const url = `${endpointWeather}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error(error);
  }
}

async function getForecastData(longitude, latitude) {
  try {
    const url = `${endpointForecast}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    displayForecast(data);
    nextDayIndex(data);
  } catch (error) {
    console.error(error);
  }
}

function getNext5Days() {
  let currentDate = new Date();
  let next5Days = [];

  for (let i = 1; i <= 4; i++) {
    let nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + i);
    let formattedDate = nextDate.toISOString().split('T')[0];
    next5Days.push(formattedDate);
  }

  return next5Days;
}

// Example usage:
let date = getNext5Days();
console.log(date);

async function getSunriseSunset(longitude, latitude) {
  try {
    const sunriseSunsetDays = getNext5Days();
    for (let i = 0; i < 4; i++) {
      const url = `${endpointSunsetSunrise}lat=${latitude}&lng=${longitude}&date=${sunriseSunsetDays[i]}`;
      const response = await fetch(url);
      const data = await response.json();
      displaySunriseSunset(data, i);
    }
  } catch (error) {
    console.error(error);
  }
}

function displayWeather(data) {

  // Main Weather card Section
  const { name, main, weather } = data;
  const cityMain = document.querySelector(".city-name-main");
  const tempMain = document.querySelector(".temp-main");
  const descriptionMain = document.querySelector(".temp-description");
  const currentWeatherIcon = document.querySelector(".weather-icon-main");
  const weatherDescription = weather[0].description;

  cityMain.textContent = name + ", " + data.sys.country;
  tempMain.textContent = main.temp + " ℃";
  descriptionMain.textContent = weather[0].description;
  currentWeatherIcon.src = weatherIcon[weatherDescription];

  // Humidity, Pressure and Visibility
  const humidityMain = document.querySelector(".humidity-main");
  const visibilityMain = document.querySelector(".visibility-distance-text");
  const atmPressureMain = document.querySelector(".atm-pressure-text");

  humidityMain.textContent = main.humidity + "%";
  visibilityMain.textContent = data.visibility / 1000 + " km";
  atmPressureMain.textContent = main.pressure + " hPa";

  // Wind Speed, Direction and Gust
  const windSpeed = document.querySelector(".wind-main");
  const windDirection = document.querySelector(".wind-direction-degree-text");
  const windGustSpeed = document.querySelector(".gust-speed-text");

  windSpeed.textContent = data.wind.speed + " m/s";
  windDirection.textContent = data.wind.deg + "°";
  windGustSpeed.textContent = data.wind.gust + " m/s";

  function wind_direction(deg) {
    const dirs = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    return dirs[Math.round((deg % 360) / 22.5)];
  }

  const deg = data.wind.deg;
  const direction = wind_direction(deg);
  console.log("Wind direction: " + direction);

  const windDirectionIcon = document.querySelector(".wind-direction-icon");
  windDirectionIcon.src = directionIcon[direction];
}

// Get Weekday Names and Index of next day
function getDate() {
  const today = new Date();
  today.setHours(today.getHours() + 5); // Add 5 hours
  today.setMinutes(today.getMinutes() + 30); // Add 30 minutes
  const date = today.toISOString().split("T")[0];
  return date;
}


console.log(getDate());

function nextDayIndex(data) {
  const date = getDate();
  console.log("Current date is: " + date);
  const { list } = data;
  let listIndex = 0;
  let today = list[listIndex].dt_txt.slice(0, 10);
  console.log("Forecast date is: " + today);
  while (date === today) {
    listIndex++;
    console.log("Index is: " + listIndex);
    if (date !== today) {
      break;
    }
    today = list[listIndex].dt_txt.slice(0, 10);
  }
  console.log("Next day index is: " + listIndex);
  const forecastIndex = listIndex;
  return forecastIndex;
}

function getWeekdayNames() {
  const date = new Date();
  const options = { timeZone: "Asia/Kolkata", weekday: "long" };
  const weekdayNames = [];
  for (let i = 0; i < 5; i++) {
    weekdayNames.push(date.toLocaleDateString("en-US", options));
    date.setDate(date.getDate() + 1);
  }
  return weekdayNames;
}

let weekdayNames = getWeekdayNames();
console.log(weekdayNames);


// Forecast Section



function displayForecast(data) {
  const day1 = document.querySelector(".day1-text");
  const day2 = document.querySelector(".day2-text");
  const day3 = document.querySelector(".day3-text");
  const day4 = document.querySelector(".day4-text");

  day1.textContent = weekdayNames[1];
  day2.textContent = weekdayNames[2];
  day3.textContent = weekdayNames[3];
  day4.textContent = weekdayNames[4];

  const { list } = data;
  let indexVal = nextDayIndex(data);

  const setForecast = (index, day, hour) => {
    const timeSelector = `.forecast-day${day}-hour${hour}`;
    const iconSelector = `.day${day}-hour${hour}-image-main`;
    const tempSelector = `.forecast-day${day}-hour${hour}-temp`;
    const descSelector = `.forecast-day${day}-hour${hour}-desc`;
    const minTempSelector = `.min-temp-${day}${hour}`;
    const maxTempSelector = `.max-temp-${day}${hour}`;

    const forecastTime = document.querySelector(timeSelector);
    const forecastIcon = document.querySelector(iconSelector);
    const description = list[index].weather[0].description;
    const forecastTemp = document.querySelector(tempSelector);
    const forecastDesc = document.querySelector(descSelector);
    const minTemp = document.querySelector(minTempSelector);
    const maxTemp = document.querySelector(maxTempSelector);

    console.log("Forecast Date: " + list[index].dt_txt);
    forecastTime.textContent = list[index].dt_txt.slice(11, 16);
    forecastIcon.src = weatherIcon[description];
    forecastTemp.textContent = list[index].main.temp + " ℃";
    forecastDesc.textContent = list[index].weather[0].description;
    minTemp.textContent = list[index].main.temp_min + " ℃";
    maxTemp.textContent = list[index].main.temp_max + " ℃";
  };

  const setForecasts = (day) => {
    const offset = (day - 1) * 8;

    setForecast(indexVal + offset + 2, day, '1');
    setForecast(indexVal + offset + 3, day, '2');
    setForecast(indexVal + offset + 4, day, '3');
    setForecast(indexVal + offset + 5, day, '4');
    setForecast(indexVal + offset + 6, day, '5');
  };

  setForecasts(1);
  setForecasts(2);
  setForecasts(3);
  setForecasts(4);

}


function displaySunriseSunset(data, index) {
  const sunriseTime = document.querySelector(`.sunrise-text${index + 1}`);
  const sunsetTime = document.querySelector(`.sunset-text${index + 1}`);
  sunriseTime.textContent = data.results.sunrise;
  sunsetTime.textContent = data.results.sunset;
}