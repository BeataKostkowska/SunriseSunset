// HTML elements:
const btnMyLocation = document.querySelector(".btn-my-location");
const inputCity = document.querySelector(".city-input");

// Get geolocation from browser:
let browserCoordinates;
let coordinates;
let map, marker;
const startZoom = 11;

const getCoordinates = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      //   console.log(position.coords);
      browserCoordinates = [latitude, longitude];
      resolve(browserCoordinates);
    }),
      (err) => {
        console.log(`Couldn't get your location`);
        reject(err.message);
      };
  });
};

// Display map:
const displayMap = function (coordinates) {
  map = L.map("map").setView(coordinates, 11);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  marker = L.marker(coordinates).addTo(map);
  map.addLayer(marker);

  map.on("click", getCoordinatesClick);
};

// Get geolocation for clicked place on the map
const getCoordinatesClick = function (e) {
  const { lat, lng } = e.latlng;
  coordinates = [lat, lng];

  let currentZoom = map.getZoom();
  let zoom = currentZoom < startZoom ? `${startZoom}` : currentZoom;

  moveToPlace(coordinates, zoom);
  getSunriseSunset(coordinates);
};

const moveToPlace = function (coordinates, zoom) {
  map.flyTo(coordinates, zoom);
  map.removeLayer(marker);
  marker = new L.marker(coordinates).addTo(map);
};

// Get hours of sunrise and sunset in chosen location from https://sunrisesunset.io/api/
const getSunriseSunset = function (coordinates) {
  fetch(
    `https://api.sunrisesunset.io/json?lat=${coordinates[0]}&lng=${coordinates[1]}`
  )
    .then((res) => res.json())
    .then((data) => {
      let { sunrise, sunset } = data.results;
      // console.log(`sunrise: ${sunrise}; sunset: ${sunset}`);
      // document.getElementById("sunrise").textContent = `Sunrise: ${sunrise}`;
      // document.getElementById("sunset").textContent = `Sunset: ${sunset}`;
      showPopup(sunrise, sunset);
    });
};

// Show sunrise&sunset in PopUp
const showPopup = function (sunrise, sunset) {
  marker.bindPopup(`Sunrise: ${sunrise}<br>Sunset: ${sunset}`).openPopup();
};

// Initialization
getCoordinates().then((browserCoordinates) => {
  console.log(`Coordinates from browser: ${browserCoordinates}`);
  // browserCoordinates = coordinates;
  displayMap(browserCoordinates);
  getSunriseSunset(browserCoordinates);
});

// Go to my location
btnMyLocation.addEventListener("click", () => {
  moveToPlace(browserCoordinates, startZoom);
  getSunriseSunset(browserCoordinates);
});

// Search for city coordinates in geocode API:
const getCoordinatesInput = async function (city) {
  const response = await fetch(`http://localhost:3000/${city}`);
  const data = await response.json();
  const { latt: latitude, longt: longitude } = data;
  console.log(latitude, longitude);
  return [latitude, longitude];
};

inputCity.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const coordinates = await getCoordinatesInput(inputCity.value);
    if (coordinates) {
      moveToPlace(coordinates, startZoom);
      getSunriseSunset(coordinates);
    } else {
      console.log("No coordinates for searched city");
    }
    inputCity.value = "";
  }
});
