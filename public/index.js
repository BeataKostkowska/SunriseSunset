import { getCoordinatesBrowser } from "./js/geolocation.js";
import { displayMap, moveToPlace, showPopup, marker } from "./js/map.js";
import { getCoordinatesInput, getSunriseSunset } from "./js/api.js";
import { setTodaysDate } from "./js/date.js";

// HTML elements:
const btnMyLocation = document.querySelector(".btn-my-location");
const btnSearch = document.querySelector(".btn-search");
const inputCity = document.querySelector(".city-input");

// variables
const startZoom = 11;
let browserCoordinates;

// Initialization
setTodaysDate();
getCoordinatesBrowser().then(async (browserCoords) => {
  console.log(`Coordinates from browser: ${browserCoords}`);
  browserCoordinates = browserCoords;
  displayMap(browserCoordinates);

  const [sunrise, sunset] = await getSunriseSunset(browserCoordinates);
  showPopup(sunrise, sunset);
});

// EVENT LISTENERS:

// Go to my location
btnMyLocation.addEventListener("click", async () => {
  moveToPlace(browserCoordinates, startZoom);
  const [sunrise, sunset] = await getSunriseSunset(browserCoordinates);
  showPopup(sunrise, sunset);
});

// Go to searched city
const searchCity = async function () {
  const coordinates = await getCoordinatesInput(inputCity.value);
  if (coordinates) {
    moveToPlace(coordinates, startZoom);

    const [sunrise, sunset] = await getSunriseSunset(coordinates);
    showPopup(sunrise, sunset);
  } else {
    console.log("No coordinates for searched city");
  }
  inputCity.value = "";
};
// 1. option with search button
btnSearch.addEventListener("click", searchCity);
// 2. option with enter
inputCity.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") searchCity();
});
