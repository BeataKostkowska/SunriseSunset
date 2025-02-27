// Search for city coordinates in geocode API:
export const getCoordinatesInput = async function (city) {
  const response = await fetch(`http://localhost:3000/${city}`);
  const data = await response.json();
  const { latt: latitude, longt: longitude } = data;
  console.log(latitude, longitude);
  return [latitude, longitude];
};

// Get hours of sunrise and sunset in chosen location from https://sunrisesunset.io/api/
export const getSunriseSunset = async function (coordinates) {
  const response = await fetch(
    `https://api.sunrisesunset.io/json?lat=${coordinates[0]}&lng=${coordinates[1]}`
  );
  const data = await response.json();
  const { sunrise, sunset } = data.results;
  return [sunrise, sunset];
};
