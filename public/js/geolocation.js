// Get geolocation from browser:
export const getCoordinatesBrowser = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      resolve([latitude, longitude]);
    }),
      (err) => {
        console.log(`Couldn't get your location`);
        reject(err.message);
      };
  });
};

