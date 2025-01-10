// Get geolocation from browser:
let coordinates;
let map, marker;

const getCoordinates = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      //   console.log(position.coords);
      coordinates = [latitude, longitude];
      resolve(coordinates);
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
  let currentZoom = map.getZoom();
  coordinates = [lat, lng];
  map.flyTo(coordinates, currentZoom < 11 ? "11" : currentZoom);
  map.removeLayer(marker);
  marker = new L.marker(coordinates).addTo(map);
  getSunriseSunset(coordinates);
};

// Get hours of sunrise and sunset in chosen location from https://sunrisesunset.io/api/
const getSunriseSunset = function (coordinates) {
  fetch(
    `https://api.sunrisesunset.io/json?lat=${coordinates[0]}&lng=${coordinates[1]}`
  )
    .then((res) => res.json())
    .then((data) => {
      let { sunrise, sunset } = data.results;
      console.log(`sunrise: ${sunrise}; sunset: ${sunset}`);
      document.getElementById("sunrise").textContent = `Sunrise: ${sunrise}`;
      document.getElementById("sunset").textContent = `Sunset: ${sunset}`;
    });
};

// Initialization
getCoordinates().then((coordinates) => {
  console.log(`Coordinates from browser: ${coordinates}`);
  displayMap(coordinates);
  getSunriseSunset(coordinates);
});
