import { getSunriseSunset } from "./api.js";
import { marker, showPopup } from "./map.js";

const dateInput = document.getElementById("date");

export const setTodaysDate = function () {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  const dateValue = `${year}-${month}-${day}`;
  console.log(dateValue);

  dateInput.setAttribute("value", dateValue);
};

// const dateInput = document.getElementById("date");

dateInput.addEventListener("change", async (e) => {
  dateInput.setAttribute("value", e.target.value);

  const coords = [marker.getLatLng().lat, marker.getLatLng().lng];

  const [newSunrise, newSunset] = await getSunriseSunset(coords);

  showPopup(newSunrise, newSunset);
});
