var key = "ac74bca302ee441e90b0b98a1190e465"
var weatherApi = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=" + key;
var geoCoding = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=" + key;

var displayWeather = function (data, loc) {
  var city = (data.name + ', ' + loc);
  var icon = (data.weather[0].icon);
  var temp = (data.main.temp);
  var feelsLike = (data.main.feels_like);
  var humidity = (data.main.humidity);
  var wind = (data.wind.speed);
  var description = (data.weather[0].description);
  // description = description.substr(0,1).toUpperCase()+description.substr(1);



  // var timeOffset = (data.timezone);

  var weatherCard = $('<div>').addClass('card');
  var weatherDiv = $('<div>').addClass('row');
  var weatherInfo = $('<div>').addClass('col');
  var weatherCity = $('<h5>').addClass('card-title p-2');
  var weatherImg = $('<img>').addClass('col card-img-top border-end');
  var weatherDescription = $('<p>').addClass('card-text p-3');
  var weatherList = $('<ul>').addClass('list-group list-group-flush');
  var weatherHumidity = $('<li>').addClass('list-group-item');
  var weatherWind = $('<li>').addClass('list-group-item');

  weatherCity.text(city);
  weatherImg.attr('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png');
  weatherDescription.text('Currently: ' + temp + '\u00B0 with ' + description + '. (feels like ' + feelsLike + '\u00B0)');
  weatherHumidity.text('Humidity: ' + humidity + '%');
  weatherWind.text('Wind Speed: ' + wind + 'mph');

  weatherList
    .append(weatherHumidity)
    .append(weatherWind);

  weatherInfo
    .append(weatherCity)
    .append(weatherDescription)
    .append(weatherList);

  weatherDiv
    .append(weatherImg)
    .append(weatherInfo);

  weatherCard
    .append(weatherDiv);

  $('#weather-card').append(weatherCard);
}

var displayForecast = function (data) {
  console.log(data);
  var forecastDiv = $('<div>').addClass('row');
  var timeZone = data.city.timezone;
  console.log(timeZone)
  for (let i = 0; i < data.list.length - 34; i++) {
    var time = (data.list[i].dt);
    console.log(time)
    var icon = (data.list[i].weather[0].icon);

    var forecastTime = $('<h5>').addClass('card-title p-2');
    var forecastCard = $('<div>').addClass('card col');
    var forecastImg = $('<img>').addClass('col card-img-top');
    
    forecastTime.text(time + timeZone);
    forecastImg.attr('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png');

    forecastCard
    .append(forecastTime)
    .append(forecastImg);
    forecastDiv.append(forecastCard);
  }
  
  $('#forecast-card').append(forecastDiv);
}

var getWeather = function (data) {
  var lat = (data[0].lat);
  var lon = (data[0].lon);
  var loc = (data[0].state);
  var weather = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=imperial";
  fetch(weather)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayWeather(data, loc);
    })
    .catch(function (error) {
      console.log(error);
    })
}
var getForecast = function (data) {
  var lat = (data[0].lat);
  var lon = (data[0].lon);
  var forecast = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=imperial";
  fetch(forecast)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayForecast(data);
    })
    .catch(function (error) {
      console.log(error);
    })
}
var getCoordinates = function (q) {
  var locationUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + q + "&appid=" + key;
  fetch(locationUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getWeather(data);
      getForecast(data);
    })
    .catch(function (error) {
      console.log(error);
    })
}

// Search Button
$(document).on('click', '.btn-primary', function (event) {
  event.preventDefault();
  var q = $("#searchInput").val();
  getCoordinates(q);
});

getCoordinates("charlotte");