const apikey = "65e01c52441f4d11f392da5ac1a0ac5c";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".rightTop input");
const searchBtn = document.querySelector(".rightTop button");

async function checkWeather(city) {
  if (!city || city.trim() === "") { alert("Please enter a city name."); return; }

  let response, data;
  try {
    response = await fetch(apiUrl + encodeURIComponent(city) + `&appid=${apikey}`);
    data = await response.json();
  } catch (err) {
    console.error("Network error", err);
    return;
  }

  if (!response.ok) {
    const msg = (data && data.message) ? data.message : `Error ${response.status}`;
    alert("API error: " + msg);
    return;
  }

  const elCity = document.querySelector(".city");
  if (elCity && data.name) elCity.textContent = data.name;

  const elTemp = document.querySelector(".temp");
  if (elTemp && data.main && typeof data.main.temp !== "undefined") elTemp.textContent = Math.round(data.main.temp) + "°C";

  const elHum = document.querySelector(".humidity");
  if (elHum && data.main && typeof data.main.humidity !== "undefined") elHum.textContent = data.main.humidity + "%";

  const elWind = document.querySelector(".wind");
  if (elWind && data.wind && typeof data.wind.speed !== "undefined") {
    const kmh = data.wind.speed * 3.6;
    elWind.textContent = (Math.round(kmh * 10) / 10) + " Km/h";
  }

  if (data.weather && data.weather[0]) {
    const code = data.weather[0].icon;
    const topIcon = document.querySelector(".weather-icon");
    if (topIcon) {
      topIcon.src = `https://openweathermap.org/img/wn/${code}@4x.png`;
      topIcon.alt = data.weather[0].description || data.weather[0].main;
    }
  }

  const third = document.querySelectorAll(".infoCard")[2];
  if (third && data.weather && data.weather[0]) {
    const mainEl = third.querySelector(".weather-main");
    const descEl = third.querySelector(".weather-desc");
    if (mainEl) mainEl.textContent = data.weather[0].main || "";
    if (descEl) descEl.textContent = data.weather[0].description || "";
  }

  document.querySelector(".Bottom").classList.remove("Hidden");


}

searchBtn.addEventListener("click", () => checkWeather(searchBox.value));
searchBox.addEventListener("keyup", e => { if (e.key === "Enter") checkWeather(searchBox.value); });


