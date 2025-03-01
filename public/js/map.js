import { getSunriseSunset } from "./api.js";
import { setTodaysDate } from "./date.js";

let map;
export let marker;
const startZoom = 11;

// Display map:
export const displayMap = function (coordinates) {
  map = L.map("map").setView(coordinates, 11);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  marker = L.marker(coordinates).addTo(map);
  map.addLayer(marker);

  map.on("click", getCoordinatesClick);

  return map, marker;
};

// Get geolocation for clicked place on the map
const getCoordinatesClick = async function (e) {
  const { lat, lng } = e.latlng;

  let currentZoom = map.getZoom();
  let zoom = currentZoom < startZoom ? `${startZoom}` : currentZoom;

  moveToPlace([lat, lng], zoom);

  const [sunrise, sunset] = await getSunriseSunset([lat, lng]);
  showPopup(sunrise, sunset);
};

export const moveToPlace = function (coordinates, zoom) {
  map.flyTo(coordinates, zoom);
  marker.setLatLng(coordinates);
  // map.removeLayer(marker);
  // marker = new L.marker(coordinates).addTo(map);
};

// Show sunrise&sunset in PopUp
export const showPopup = function (sunrise, sunset) {
  marker
    .bindPopup(
      `
      <p>Sunrise: ${sunrise}</p>
      <p>Sunset: ${sunset}</p>
      <input type="date" id="date" value="${setTodaysDate()}"/>
  `
    )
    .on("popupopen", async () => {
      const dateInput = document.getElementById("date");

      const updatePopupInformation = async (e) => {
        const coords = [marker.getLatLng().lat, marker.getLatLng().lng];
        console.log(`marker coords: ${coords}`);

        const newDate = e.target.value;
        dateInput.setAttribute("value", newDate);

        const [newSunrise, newSunset] = await getSunriseSunset(coords, newDate);

        marker.getPopup().setContent(`
          <p>Sunrise: ${newSunrise}</p>
          <p>Sunset: ${newSunset}</p>
          <input type="date" id="date" value="${newDate}"/>
        `);

        const newDateInput = document.getElementById("date");
        newDateInput.addEventListener("change", updatePopupInformation);
      };

      dateInput.addEventListener("change", updatePopupInformation);
    })
    .openPopup();
};
