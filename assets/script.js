var key = "ac74bca302ee441e90b0b98a1190e465"
var weatherApi = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=" + key;
var geoCoding = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=" + key;

q = "charlotte"

var getWeather = function (data) {
  var lat = (data[0].lat);
  var lon = (data[0].lon);
  var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=imperial";
  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (error) {
      console.log(error);
    })
}
var getCoordinates = function () {
  var locationUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + q + "&appid=" + key;
  fetch(locationUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getWeather(data);
    })
    .catch(function (error) {
      console.log(error);
    })
}

getCoordinates();