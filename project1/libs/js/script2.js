if (location.href !== "http://localhost/portfolio/project1/") {
  if (location.href === "http://www.apglynn.co.uk/project1/") {
    location.assign("https://www.apglynn.co.uk/project1/");
  }
}

$(window).on("load", function () {
  //preload handler
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("fast", function () {
        $(this).remove();
      });
  }
});

//----------------------SET UP MAP

const map = L.map("map", {
  center: [50.8476, 4.3572],
  zoom: 4,
});

//alternative tiles for when maptiler not available due to free account
const streetTiles = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 2,
    maxZoom: 15,
  }
).addTo(map);

// MAPTILER TILES
// import map tiles
// const streetTiles = L.tileLayer(
//   "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=I6Fjse9RiOJDIsWoxSx2",
//   {
//     attribution:
//       '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
//     minZoom: 2,
//     maxZoom: 15,
//   }
// ).addTo(map);

// const topographicTiles = L.tileLayer(
//   "https://api.maptiler.com/maps/topographique/{z}/{x}/{y}.png?key=I6Fjse9RiOJDIsWoxSx2",
//   {
//     attribution:
//       '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
//     minZoom: 3,
//     maxZoom: 18,
//   }
// ).addTo(map);

// const satelliteTiles = L.tileLayer(
//   "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=I6Fjse9RiOJDIsWoxSx2",
//   {
//     attribution:
//       '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
//     minZoom: 2,
//     maxZoom: 15,
//   }
// ).addTo(map);

let progressBarWidth = 0;

//----------------------------MAP ICONS

let cityIcon = L.icon({
  iconUrl: "libs/css/images/bigcity.png",
  iconSize: [38, 45],
});

let capitalCityIcon = L.icon({
  iconUrl: "libs/css/images/capitalcity.png",
  iconSize: [50, 60],
});

let earthquakeIcon = L.icon({
  iconUrl: "libs/css/images/earthquake.png",
  iconSize: [38, 45],
});

let volcanoIcon = L.icon({
  iconUrl: "libs/css/images/volcano.png",
  iconSize: [38, 45],
});

//---------------------MAP LAYERS

const featureGroup1 = L.featureGroup().addTo(map);

const citiesMCG = L.markerClusterGroup();
const earthquakesMCG = L.markerClusterGroup();
const volcanoesMCG = L.markerClusterGroup();
const capitalMCG = L.markerClusterGroup();

citiesMCG.addTo(featureGroup1);
earthquakesMCG.addTo(featureGroup1);
volcanoesMCG.addTo(featureGroup1);
capitalMCG.addTo(featureGroup1);

const baseLayers = {
  // Satellite: satelliteTiles,
  // Topographic: topographicTiles,
  Street: streetTiles,
};

const overlays = {
  earthquakes: earthquakesMCG,
  volcanoes: volcanoesMCG,
  cities: citiesMCG,
  capital: capitalMCG,
};

//-------------------MAP CONTROLS/BUTTONS

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);

const generalInfoButton = L.easyButton({
  states: [
    {
      icon: "<span class='fas fa-info' ></span>",
      onClick: function () {
        $("#infoModal").modal("show");
      },
      id: "general-info-easybutton",
    },
  ],
}).addTo(map);

const citiesButton = L.easyButton({
  states: [
    {
      icon: "<span class='fa-solid fa-city'></span>",
      onClick: function () {
        $("#citiesModal").modal("show");
      },
      id: "cities-easybutton",
    },
  ],
}).addTo(map);

const wikiButton = L.easyButton({
  states: [
    {
      icon: "<span class='fab fa-wikipedia-w' ></span>",
      onClick: function () {
        $("#wikiModal").modal("show");
      },
      id: "wiki-easybutton",
    },
  ],
}).addTo(map);

const newsButton = L.easyButton({
  states: [
    {
      icon: "<span class='fas fa-newspaper' ></span>",
      onClick: function () {
        $("#newsModal").modal("show");
      },
      id: "news-easybutton",
    },
  ],
}).addTo(map);

const weatherButton = L.easyButton({
  states: [
    {
      icon: "<span class='fa-solid fa-cloud-sun'></span>",
      onClick: function () {
        $("#newsModal").modal("show");
      },
      id: "weather-easybutton",
    },
  ],
}).addTo(map);

const recenterButton = L.easyButton({
  states: [
    {
      icon: "<span class='fa-solid fa-location-crosshairs' ></span>",
      onClick: function () {
        ll.recenter();
      },
      id: "recenter-easybutton",
    },
  ],
}).addTo(map);

//---------------------NAV BAR BUTTONS/SELECT--------------

$("#select").change(function () {
  locationData($("#select").val());
});

//click on flag to refresh selected country data
$(".nav-flag-div").on("click", function () {
  locationData($("#select").val());
});

//launch "about" modal
$("#globe-icon").on("click", function () {
  $("#aboutModal").modal("show");
});

$("#logo").on("click", function () {
  $("#aboutModal").modal("show");
});

//--------------------------Progress Modal error buttons-------------------------//

$("#try-again").on("click", function () {
  locationData($("#select").val());
});

$("#choose-another").on("click", function () {
  $("#progressModal").modal("hide");
});

$("#select-progress").change(function () {
  setSelected($("#select-progress").val());
  locationData($("#select-progress").val());
  $("#select-progress-div").addClass("display-none");
});

//--------------DECLARE NEW MODAL-------------------------

const progressModal = new bootstrap.Modal(
  document.getElementById("progressModal"),
  {
    keyboard: false,
  }
);

// ---------------------DATA NODE AND LINKED LIST-------//
// Node that contains country data for linked list
//DataNode - formerly CountryDataNode
class DataNode {
  constructor() {
    this.data = {};
    this.next = null;
    this.previous = null;
  }
  printData() {
    console.log(ll.current.data);
  }

  clearData() {
    this.data = {};
  }
}

//---------------------------------LINKED LIST/DATA NODE------

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }

  newDataNode(countryCodeISO2, lat, lng) {
    //if nodes exist, loop through to find a match
    if (this.head) {
      let current = this.head;
      while (current) {
        if (current.data.countryCodeISO2 === countryCodeISO2) {
          // create new node
          let node = new DataNode(countryCodeISO2, lat, lng);
          //swap out the new node
          //first by taking it's
          //*******could be an async problem here********
          node.next = current.next;
          node.previous = current.previous;
          this.current = node;
          return;
        }
      }
    } else {
      let node = new DataNode();
      this.current = node;
      getData(null, lat, lng);
    }
    // let node = new DataNode(countryCodeISO2);
  }

  printData() {
    console.log(this.current);
  }
}

const ll = new LinkedList();
populateSelect();

//-----------------------------REQUEST USER LOCATION

(function requestLocation() {
  const request = prompt("can you give permission yes/no");
  if (request === "yes") {
    var options = {
      // enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    //on consent given
    function success(pos) {
      var crd = pos.coords;
      ll.newDataNode(null, crd.latitude, crd.longitude);
    }

    //consent declined
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
  } else {
    alert("ok, select a country");
  }
})();

//------------GET DATA FUNCTION

function getData(countryCodeISO2 = null, lat = null, lng = null) {
  if (ll.current) ll.current.clearData();
  if (!countryCodeISO2) {
    opencageCall(lat, lng).then(() => APIcalls());
    return;
  }
  APIcalls();
  // addToHTML()
}

//------------------------API CALLS-----------------------//

function APIcalls() {
  Promise.all([getGeoJSONData(), geonamesCountryInfoCall()])
    .then(() => restCountriesCall())
    .then(() => opencageCall())
    .then(() =>
      Promise.all([
        apiVolcanoesCall(),
        // openExchangeRatesCall(), /* 1k starting from 6th of the mont*/
        geonamesCitiesCall(),
        geonamesEarthquakesCall(),
        geonamesWikiCall(),
        // openweather 1M calls per month
        // apiOpenWeatherCurrentCall(),
        // apiOpenWeatherForecastCall(),
        apiUnsplashCall(),
        getDateTime(),
      ])
    )
    .then(() => console.log(ll.current.data));
}

async function opencageCall(lat, lon) {
  if (ll.current.data.countryCodeISO2) return;
  if (!lat || !lon) {
    console.log("there was no lat/lon");
    // errorRetrievingData("error-country-details", infoStore);
    return;
  }
  return $.ajax({
    url: "libs/php/api-opencage.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: lat,
      lon: lon,
    },
    success: function (result) {
      progressBar(8);
      if (result.data.results.length === 0) {
        // errorRetrievingData("error-country-details");
        return;
      }
      ll.current.data.countryCodeISO2 =
        result.data.results[0].components["ISO_3166-1_alpha-2"];
      //time
      ll.current.data.offset_string =
        result.data.results[0].annotations.timezone.offset_string;
      ll.current.data.offset_sec =
        result.data.results[0].annotations.timezone.offset_sec;
      ll.current.data.unix = Date.now();
      ll.current.data.localTime = currentDayTime(ll.current.data.offset_sec);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // fatalError();
      progressBar(8);
    },
  });
}

async function getGeoJSONData() {
  let countryCodeISO2 = ll.current.data.countryCodeISO2;
  if (!countryCodeISO2) {
    console.log("country code not defined");
    // fatalError();
    return;
  }
  return $.ajax({
    url: "libs/php/countryBorders-geoJSON.php",
    type: "GET",
    dataType: "json",
    data: { countryCode: countryCodeISO2 },
    success: function (result) {
      progressBar(7);
      if (!result) {
        errorRetrievingData("error-geoJSON", infoStore);
        return;
      }
      ll.current.data.geoJSON = result;
      ll.current.data.geojsonCountryOutline = L.geoJSON(result, {
        style: function (feature) {
          return { color: "rgba(15, 188, 249, 0.548)" };
        },
      });
      ll.current.data.boundingBox =
        ll.current.data.geojsonCountryOutline.getBounds();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR, textStatus, errorThrown);
      // fatalError();
      progressBar(7);
    },
  });
}

function geonamesCountryInfoCall() {
  let countryCodeISO2 = ll.current.data.countryCodeISO2;
  if (!countryCodeISO2) console.log("ISO2 not defined");

  return $.ajax({
    url: "libs/php/api-geonames-countryInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCodeISO2: countryCodeISO2,
    },
    success: function (result) {
      progressBar(7);
      if (result.data.length !== 1) {
        errorRetrievingData("error-country-details", infoStore);
        return;
      }
      ll.current.data.countryName = result.data[0].countryName;
      ll.current.data.capital = result.data[0].capital;
      ll.current.data.population = result.data[0].population;
      ll.current.data.currencyISO3Code = result.data[0].currencyCode;
      ll.current.data.countryCodeISO3 = result.data[0].isoAlpha3;
      ll.current.data.continent = result.data[0].continentName;
      ll.current.data.geonameId = result.data[0].geonameId;
      //
      ll.current.data.north = result.data[0].north;
      ll.current.data.south = result.data[0].south;
      ll.current.data.east = result.data[0].east;
      ll.current.data.west = result.data[0].west;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      progressBar(7);
      // fatalError();
    },
  });
}

function restCountriesCall() {
  const countryCodeISO3 = ll.current.data.countryCodeISO3;
  if (!countryCodeISO3) {
    errorRetrievingData("error-country-details", infoStore);
    progressBar(7);
    return;
  }
  return $.ajax({
    url: "libs/php/api-restcountries.php",
    type: "POST",
    dataType: "json",
    data: { countryCodeISO3: countryCodeISO3 },
    success: function (result) {
      progressBar(7);
      if (result.data.status === 400) {
        errorRetrievingData("error-country-details", infoStore);
        return;
      }
      ll.current.data.languages = result.data.languages[0].name;
      ll.current.data.latitude = result.data.latlng[0];
      ll.current.data.longitude = result.data.latlng[1];
      ll.current.data.area = result.data.area;
      ll.current.data.flag = result.data.flags.png;
      ll.current.data.currencyName = result.data.currencies[0].name;
      ll.current.data.currencySymbol = result.data.currencies[0].symbol;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      progressBar(7);
      fatalError();
    },
  });
}

function apiVolcanoesCall() {
  const countryName = ll.current.data.countryName;
  if (!countryName) {
    errorRetrievingData("error-volcanoes", infoStore);
    progressBar(8);
    return;
  }
  return $.ajax({
    url: "libs/php/api-volcanoes.php",
    type: "POST",
    dataType: "json",
    data: {
      countryname: countryName,
    },
    success: function (result) {
      progressBar(8);
      ll.current.data.volcanoes = result.data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      progressBar(8);
      fatalError();
    },
  });
}

function openExchangeRatesCall() {
  const currencyISO3Code = ll.current.data.currencyISO3Code;
  if (!currencyISO3Code) {
    errorRetrievingData("error-country-details", infoStore);
  }
  return $.ajax({
    url: "libs/php/api-openexchangerates.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      progressBar(7);
      if (!result.data) {
        errorRetrievingData("error-country-details", infoStore);
        return;
      }
      ll.current.data.exchangeRate = result.data[currencyISO3Code];
    },
    error: function (jqXHR, textStatus, errorThrown) {
      progressBar(7);
      fatalError();
    },
  });
}

function geonamesCitiesCall() {
  const countryCodeISO2 = ll.current.data.countryCodeISO2;
  return $.ajax({
    url: "libs/php/api-cachedCities.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCodeISO2: countryCodeISO2,
    },
    success: function (result) {
      progressBar(8);
      // console.log(result.data);

      // if (result.data.status) {
      //   errorRetrievingData("error-cities", infoStore);
      //   return;
      // }
      ll.current.data.cities = result.data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      progressBar(8);
      // fatalError();
      console.log(jqXHR, textStatus, errorThrown);
    },
  });
}

function geonamesEarthquakesCall() {
  const boundingBox = ll.current.data.boundingBox;
  if (!boundingBox) {
    progressBar(8);
    errorRetrievingData("error-earthquakes");
    return;
  }
  return $.ajax({
    url: "libs/php/api-geonames-earthquakes.php",
    type: "POST",
    dataType: "json",
    data: {
      north: boundingBox._northEast.lat,
      south: boundingBox._southWest.lat,
      east: boundingBox._northEast.lng,
      west: boundingBox._southWest.lng,
    },
    success: function (result) {
      progressBar(8);
      if (!result.data) {
        errorRetrievingData("error-volcanoes", infoStore);
      }
      ll.current.data.earthquakes = result.data;
    },

    error: function (jqXHR, textStatus, errorThrown) {
      progressBar(8);
      fatalError();
    },
  });
}

function geonamesWikiCall() {
  const boundingBox = ll.current.data.boundingBox;
  if (!boundingBox) {
    errorRetrievingData("error-wikipedia", infoStore);
    progressBar(8);
    return;
  }
  return $.ajax({
    url: "libs/php/api-geonames-wikipedia.php",
    type: "POST",
    dataType: "json",
    data: {
      north: boundingBox._northEast.lat,
      south: boundingBox._southWest.lat,
      east: boundingBox._northEast.lng,
      west: boundingBox._southWest.lng,
    },
    success: function (result) {
      progressBar(8);
      if (result.data.length === 1) {
        errorRetrievingData("error-wikipedia", infoStore);
        return;
      }
      ll.current.data.wikipediaArticles = JSON.parse(result.data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      progressBar(8);
      fatalError();
    },
  });
}

function apiOpenWeatherCurrentCall() {
  const latitude = ll.current.data.latitude;
  const longitude = ll.current.data.longitude;
  if (!latitude || !longitude) {
    errorRetrievingData("error-current-weather", infoStore);
    progressBar(8);
    return;
  }
  return $.ajax({
    url: "libs/php/api-openweatherCurrent.php",
    type: "POST",
    dataType: "json",
    data: {
      latitude: latitude,
      longitude: longitude,
    },
    success: function (result) {
      progressBar(8);
      if (result.data.cod) {
        errorRetrievingData("error-current-weather", infoStore);
        return;
      }
      ll.current.data.weatherDescription =
        result.data.current.weather[0].description;
      ll.current.data.weatherIcon = result.data.current.weather[0].icon;
      ll.current.data.weatherTemp = result.data.current.temp;
    },

    error: function (jqXHR, textStatus, errorThrown) {
      progressBar(8);
      fatalError();
    },
  });
}

function apiOpenWeatherForecastCall() {
  const latitude = ll.current.data.latitude;
  const longitude = ll.current.data.longitude;
  if (!latitude || !longitude) {
    errorRetrievingData("error-weather-forecast", infoStore);
    progressBar(8);
    return;
  }
  return $.ajax({
    url: "libs/php/api-openweatherForecast.php",
    type: "POST",
    dataType: "json",
    data: {
      latitude: latitude,
      longitude: longitude,
    },
    success: function (result) {
      progressBar(8);
      if (result.data.cod !== "200") {
        errorRetrievingData("error-weather-forecast", infoStore);
        return;
      }

      const forecast = result.data.list;
      ll.current.data.weather = [];
      for (let i = 0; i < 5; i++) {
        const obj = {};
        if (i === 0) {
          obj.dateTime = forecastDayAndTime(
            forecast[i].dt,
            ll.current.data.offset_sec
          );
        } else if (
          i > 0 &&
          forecastDay(forecast[i].dt, ll.current.data.offset_sec) ===
            forecastDay(forecast[i - 1].dt, ll.current.data.offset_sec)
        ) {
          obj.dateTime = forecastTime(
            forecast[i].dt,
            ll.current.data.offset_sec
          );
        } else {
          obj.dateTime = forecastDayAndTime(
            forecast[i].dt,
            ll.current.data.offset_sec
          );
        }
        obj.description = forecast[i].weather[0].description;
        obj.icon = forecast[i].weather[0].icon;
        obj.temp = forecast[i].main.temp;
        ll.current.data.weather.push(obj);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      progressBar(8);
      fatalError();
    },
  });
}

function apiUnsplashCall() {
  const countryName = ll.current.data.countryName;
  if (!countryName) {
    errorRetrievingData("country-images", infoStore);
    progressBar(8);
    return;
  }
  return $.ajax({
    url: "libs/php/api-unsplash.php",
    type: "POST",
    dataType: "json",
    data: {
      countryname: ll.current.data.countryName,
    },
    success: function (result) {
      progressBar(8);
      if (result.data.length === 0) {
        // errorRetrievingData("country-images", infoStore);
        return;
      }
      ll.current.data.countryImages = [];
      result.data.forEach((result) => {
        let obj = {};
        obj.url = result.urls.small;
        obj.description = result.description;
        obj.alt_description = result.alt_description;
        ll.current.data.countryImages.push(obj);
      });
    },

    error: function (jqXHR, textStatus, errorThrown) {
      progressBar(8);
      fatalError();
    },
  });
}

function getDateTime() {
  let date = Date();
  const printDate = date.split(" ").slice(0, 5).join(" ");
  ll.current.data.dataCapturedAt = printDate;
}

//---------------------OTHER FUNCTIONS

function progressBar(input) {
  input;
}

//----------------set select input to match that of current country

function setSelected(twoLetterCountryCode) {
  $(`#select option[value=${twoLetterCountryCode}]`).prop("selected", true);
}

//------populates select tag list of countries--------------//
function populateSelect(countryCodeISO3) {
  return $.ajax({
    url: "libs/php/countryBorders-names.php",
    type: "GET",
    dataType: "json",
    data: { countryCodeISO3: countryCodeISO3 },
    success: function (result) {
      if (result.status.name === "ok") {
        result = JSON.parse(result.data);
        result.forEach((country) => {
          $("#select").append(
            $("<option>", {
              value: [country[1]],
              text: [country[0]],
            })
          );
          $("#select-progress").append(
            $("<option>", {
              value: [country[1]],
              text: [country[0]],
            })
          );
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function currentDayTime(offset) {
  offset = offset * 1000;
  const currentTime = new Date();
  const localTime = new Date(currentTime.getTime() + offset);
  let minutes = String(localTime.getUTCMinutes());
  let hours = localTime.getUTCHours();
  let amOrPm = "";

  if (hours === 12) {
    amOrPm = "pm";
  } else if (hours === 0) {
    hours = 12;
    amOrPm = "am";
  } else if (hours >= 13) {
    hours = hours - 12;
    amOrPm = "pm";
  } else {
    amOrPm = "am";
  }

  if (minutes.length < 2) {
    minutes = "0" + minutes;
  }

  const options = {
    day: "2-digit",
    month: "short",
    weekday: "short",
    year: "numeric",
    timeZone: "UTC",
  };

  return (
    new Intl.DateTimeFormat("en-GB", options).format(localTime) +
    ", " +
    hours +
    ":" +
    minutes +
    amOrPm
  );
}

function forecastDayAndTime(timestamp, offset) {
  offset *= 1000;
  timestamp *= 1000;
  let date = new Date(timestamp + offset);
  let options = {
    weekday: "short",
    timeZone: "UTC",
  };
  let hours = date.getUTCHours();
  if (hours === 12) {
    hours = hours + "pm";
  } else if (hours === 0) {
    hours = "12am";
  } else if (hours >= 13) {
    hours = hours - 12 + "pm";
  } else {
    hours = hours + "am";
  }
  return new Intl.DateTimeFormat("en-GB", options).format(date) + ", " + hours;
}

function forecastDay(timestamp, offset) {
  offset *= 1000;
  timestamp *= 1000;
  let date = new Date(timestamp + offset);
  let options = {
    timeZone: "UTC",
    weekday: "long",
  };
  return new Intl.DateTimeFormat("en-GB", options).format(date);
}

function forecastTime(timestamp, offset) {
  offset *= 1000;
  timestamp *= 1000;
  let date = new Date(timestamp + offset);
  let hours = date.getUTCHours();
  if (hours === 12) {
    hours = hours + "pm";
  } else if (hours === 0) {
    hours = "12am";
  } else if (hours >= 13) {
    hours = hours - 12 + "pm";
  } else {
    hours = hours + "am";
  }
  return hours;
}
