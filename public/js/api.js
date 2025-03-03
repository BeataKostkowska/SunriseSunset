import { setTodaysDate } from "./date.js";

// Search for city coordinates in geocode API:
export const getCoordinatesInput = async function (city) {
  const response = await fetch(
    `https://suntime-kostkowska.onrender.com/${city}`
  );
  const data = await response.json();
  const { latt: latitude, longt: longitude } = data;
  console.log(latitude, longitude);
  return [latitude, longitude];
};

// Get hours of sunrise and sunset in chosen location from https://sunrisesunset.io/api/
const todaysDate = setTodaysDate();
export const getSunriseSunset = async function (
  coordinates,
  date = todaysDate
) {
  const response = await fetch(
    `https://api.sunrisesunset.io/json?lat=${coordinates[0]}&lng=${coordinates[1]}&date=${date}`
  );
  const data = await response.json();
  const { sunrise, sunset } = data.results;
  return [sunrise, sunset];
};
