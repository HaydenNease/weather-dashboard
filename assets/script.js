var key = "ac74bca302ee441e90b0b98a1190e465"
var weatherApi = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=" + key;
var geoCoding = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=" + key;

var storageRem = function (lat, lon) {
  var getSearches = localStorage.getItem("cities") || '[]';
  searchItems = JSON.parse(getSearches);
  var index = searchItems.indexOf(lat + " " + lon);
  if (index > -1) {
    searchItems.splice(index, 1);
    localStorage.setItem("cities", JSON.stringify(searchItems));
  }
  console.log(savedSearches);
}

var storageCheck = function (searchItems, newCity) {
  var noMatch = 0
  Object.values(searchItems).forEach(val => {
    if (val === newCity) {
      return;
    } else {
      return noMatch++;
    }
  })
  if (noMatch >= searchItems.length) {
    searchItems.push(newCity);
    localStorage.setItem("cities", JSON.stringify(searchItems));
  }
};

var storageAdd = function (lat, lon) {
  var getSearches = localStorage.getItem("cities") || '[]';
  var searchItems = JSON.parse(getSearches);
  var newCity = (lat + " " + lon);
  if (searchItems.length > 0) {
    storageCheck(searchItems, newCity);
  } else {
    searchItems.push(newCity);
    localStorage.setItem("cities", JSON.stringify(searchItems));
  }
}

var displayWeather = function (data, loc) {
  $('#weather-card').empty();
  var city = (data.name + ', ' + loc);
  var icon = (data.weather[0].icon);
  var temp = (data.main.temp);
  var feelsLike = (data.main.feels_like);
  var humidity = (data.main.humidity);
  var wind = (data.wind.speed);
  var description = (data.weather[0].description);

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
  $('#forecast-card').empty();
  var forecastDiv = $('<div>').addClass('row');
  for (let i = 0; i < data.list.length - 34; i++) {
    var unix = (data.list[i].dt);
    var icon = (data.list[i].weather[0].icon);

    var forecastTime = $('<h5>').addClass('card-title p-2');
    var forecastCard = $('<div>').addClass('card col p-2');
    var forecastImg = $('<img>').addClass('col card-img-top');

    var time = new Date((unix) * 1000)
    forecastTime.text(time.toLocaleString());
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
      storageAdd(lat, lon);
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

var displaySearch = function (data) {
  var city = (data.name);
  var temp = (data.main.temp);  
  var searchCity = $('<button>').addClass('btn btn-primary border');
  var searchTemp = $('<span>').addClass('badge text-bg-secondary');
  searchCity.attr('id', city)
  searchCity.text(city);
  searchTemp.text(temp);

  searchCity.append(searchTemp);

  $('#search-list').append(searchCity);
}

var fetchSearch = function () {
  var getSearches = localStorage.getItem("cities") || '[]';
  var searchItems = JSON.parse(getSearches);
  Object.values(searchItems).forEach(val => {
    var latlon = val.split(" ");
    var lat = latlon[0];
    var lon = latlon[1];
    var weather = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=imperial";
    fetch(weather)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displaySearch(data);
      })
      .catch(function (error) {
        console.log(error);
      })



    // var data = {
    //   0: {
    //     lat: latlon[0],
    //     lon: latlon[1]
    //   }
    // };

  })
}

fetchSearch();

// Search Button
$(document).on('click', '.btn-primary', function (event) {
  event.preventDefault();
  if ($(this).attr('id')) {
    var q = $(this).attr('id');
  } else {
    var q = $("#searchInput").val();
  }
  getCoordinates(q);
});

// getCoordinates("london");