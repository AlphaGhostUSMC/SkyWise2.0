if (navigator.geolocation) {
  // Request the user's location
  navigator.geolocation.getCurrentPosition(function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getWeatherData(longitude, latitude);

    console.log("Longitude: " + longitude);
    console.log("Latitude: " + latitude);

  }, function (error) {
    console.log("Error fetching location: " + error.message);
  });
} else {
  console.log("Geolocation is not supported by this browser.");
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

function displayWeather(data) {
  const { name, main, weather } = data;
  const cityName = document.querySelector(".weather-widget-city");
  const cityTemp = document.querySelector(".weather-widget-temp-main");
  const cityTempDesc = document.querySelector(".temp-description");
  const cityWeatherIcon = document.querySelector(".weather-widget-icon-main");
  const cityWeatherDescription = weather[0].description;

  cityName.textContent = name + ", " + data.sys.country;
  cityTemp.textContent = main.temp + " ℃";
  cityTempDesc.textContent = weather[0].description;
  cityWeatherIcon.src = weatherIcon[cityWeatherDescription];
}
