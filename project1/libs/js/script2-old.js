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

const imagesButton = L.easyButton({
  states: [
    {
      icon: "<span class='fa-solid fa-images' ></span>",
      onClick: function () {
        $("#imagesModal").modal("show");
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
  ll.getData($("#select").val());
  //console.log($("#select").val());
});

//click on flag to refresh selected country data
$(".nav-flag-div").on("click", function () {
  ll.getData($("#select").val());
});

//launch "about" modal
$("#globe-icon").on("click", function () {
  $("#aboutModal").modal("show");
});

$("#logo").on("click", function () {
  $("#aboutModal").modal("show");
});

//--------------------------Progress Modal -------------------------//

const progressModal = new bootstrap.Modal(
  document.getElementById("progressModal"),
  {
    keyboard: false,
  }
);

const citiesModal = new bootstrap.Modal(
  document.getElementById("citiesModal"),
  {
    keyboard: false,
  }
);

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

//---------------------------------LINKED LIST------

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }

  getData(countryCodeISO2, lat, lng) {
    //if nodes exist, loop through to find a match
    if (!this.head) {
      let node = new DataNode();
      this.current = node;
      this.head = node;
      this.tail = node;
      opencageCall(lat, lng).then(() => countryAPICalls());
      return;
    }
    let current = this.head;
    while (current) {
      if (current.data.countryCodeISO2 === countryCodeISO2) {
        let node = new DataNode(countryCodeISO2, lat, lng);
        node.next = current.next;
        node.previous = current.previous;
        this.current = node;
        this.current.data.countryCodeISO2 = countryCodeISO2;
        countryAPICalls();
        return;
      }
      current = current.next;
    }
    let node = new DataNode();
    this.tail.next = node;
    node.previous = this.tail;
    this.tail = node;
    this.current = node;
    this.current.data.countryCodeISO2 = countryCodeISO2;
    clearHTML(ll.current.data);
    countryAPICalls();
  }

  forward() {
    if (!this.current.next) return;
    //1) clear HTML
    this.current = this.current.next;
    //3) addtoHTML
    setSelected(this.current.data.countryCodeISO2);
    setNavButtons(this.current);
    //6) this.recenter
  }
  backward() {
    if (!this.current.previous) return;
    //1) clearHTML
    this.current = this.current.previous;
    //3) addtoHTML
    setSelected(this.current.data.countryCodeISO2);
    setNavButtons(this.current);
    //6) this.recenter
  }

  recenter() {
    if (
      this.current.data.countryName === "Russia" ||
      this.current.data.countryName === "United States"
    ) {
      map.fitBounds(this.current.data.geojsonCountryOutline.getBounds(), {
        padding: [3, 3],
      });
      return;
    }
    map.fitBounds(
      [
        [this.current.data.south, this.current.data.west],
        [this.current.data.north, this.current.data.east],
      ],
      {
        padding: [3, 3],
      }
    );
  }
  printData() {
    console.log(this.current);
  }
}

//--------------------- FORWARD/BACKWARD BUTTONS ----------

const backButton = document.getElementById("left-bracket");
const forwardButton = document.getElementById("right-bracket");

backButton.addEventListener("click", function () {
  ll.backward();
});

forwardButton.addEventListener("click", function () {
  ll.forward();
});

//------------------
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
      ll.getData(null, crd.latitude, crd.longitude);
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

//------------API CALLS FUNCTION

function countryAPICalls() {
  Promise.all([
    setSelected(ll.current.data.countryCodeISO2),
    getGeoJSONData(),
    geonamesCountryInfoCall(),
  ])
    .then(() => restCountriesCall())
    .then(() => opencageCall())
    .then(() =>
      Promise.all([
        // apiVolcanoesCall(),
        // openExchangeRatesCall() /* 1k starting from 6th of the mont*/,
        geonamesCitiesCall(),
        // geonamesEarthquakesCall(),
        geonamesWikiCall(),
        // openweather 1M calls per month
        apiOpenWeatherOneCall(ll.current.data),
        // apiOpenWeatherForecastCall(),
        // apiopenweatherAirPollution(ll.current.data),
        apiUnsplashCall(),
        getDateTime(),
      ])
    )
    .then(() => console.log(ll.current.data))
    .then(() => updateHTML())
    .then(() => setNavButtons())
    .catch((e) => console.log(e));
}

//------------------------API CALLS-----------------------//

async function opencageCall(lat, lon) {
  if (ll.current.data.countryCodeISO2) return;
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

async function apiOpenWeatherOneCall(data) {
  const lat = data.latitude || data.lat;
  const lng = data.longitude || data.lng;
  if (!lat || !lng) {
    errorRetrievingData("error-current-weather", infoStore);
    progressBar(8);
    return;
  }
  return $.ajax({
    url: "libs/php/api-openweatherOneCall.php",
    type: "POST",
    dataType: "json",
    data: {
      latitude: lat,
      longitude: lng,
    },
    success: function (result) {
      progressBar(8);
      if (result.data.cod) {
        errorRetrievingData("error-current-weather", infoStore);
        return;
      }
      data.weatherDescription = result.data.current.weather[0].description;
      data.weatherIcon = result.data.current.weather[0].icon;
      data.weatherTemp = result.data.current.temp;
      data.uvi = result.data.current.uvi;
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

async function apiOpenweatherAirPollution(data) {
  const lat = data.latitude || data.lat;
  const lng = data.longitude || data.lng;
  if (!lat || !lng) {
    errorRetrievingData("error-current-weather", infoStore);
    progressBar(8);
    return;
  }
  return $.ajax({
    url: "libs/php/api-openweatherAirPollution.php",
    type: "POST",
    dataType: "json",
    data: {
      latitude: lat,
      longitude: lng,
    },
    success: function (result) {
      progressBar(8);
      if (result.data.cod) {
        errorRetrievingData("error-current-weather", infoStore);
        return;
      }
      console.log(result);

      data.airPollution = [];

      for (const [key, value] of Object.entries(
        result.data.list[0].components
      )) {
        data.airPollution.push({ [key]: value });
      }
      console.log(data.airPollution);
      // data.airPollution.co = result.data.list[0].components.co;
      // data.airPollution.nh3 = result.data.list[0].components.nh3;
      // data.airPollution.no = result.data.list[0].components.no;
      // data.airPollution.no2 = result.data.list[0].components.no2;
      // data.airPollution.o3 = result.data.list[0].components.o3;
      // data.airPollution.pm1_5 = result.data.list[0].components.pm1_5;
      // data.airPollution.pm10 = result.data.list[0].components.pm10;
      // data.airPollution.so2 = result.data.list[0].components.so2;
      data.airPollution = result.data.list[0].main.aqi;
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

//----------------------UPDATE HTML-----------------

function updateHTML() {
  //GENERAL INFO TABLE
  const data = ll.current.data;
  const table = document.querySelector("#general-info-table");
  table.classList = "table table-borderless";

  addLatLngRow("Latitude/Longitude", data.latitude, data.longitude);
  addAreaRow("Land Area", data.area);
  addWeatherRow("Current Weather", data.weatherTemp, data.weatherIcon, table);
  addRow("GMT offset", data.offset_string, table);
  addLocalTimeRow("Local date and Time", data.localTime);
  data.exchangeRate && addRow("$1 USD", data.exchangeRate.toFixed(2));
  addCurrencyRow("Currency", data.currencyName, data.currencySymbol);
  addRow("Continent", data.continent, table);
  addRow("Languages", data.languages, table);
  addRow("Population", makeNumberReadable(data.population), table);
  addRow("Capital", data.capital, table);
  addRow("Country", data.countryName, table);
  dataCapturedAtText(data);

  //COUNTRY IMAGES CAROUSEL
  addCarouselImages(data);

  addCities(data);
}

function clearHTML(data) {
  console.log("clear HTML");
  const generalInfoTableData = document.querySelector(
    "#general-info-table tbody"
  );
  generalInfoTableData.remove();
  const countryImagesCarousel = document.querySelector(".carousel-inner");
  countryImagesCarousel.remove();
  const citiesListUl = document.querySelectorAll("#cities-list li");
  citiesListUl.forEach((li) => {
    li.remove();
  });

  //clear map pins
  featureGroup1.eachLayer((layer) => layer.clearLayers());
}

//---------------------OTHER FUNCTIONS

function progressBar(input) {
  input;
}

//----------------set select input to match that of current country

function setSelected(countryCodeISO2) {
  $(`#select option[value=${countryCodeISO2}]`).prop("selected", true);
}

function setNavButtons() {
  if (!ll.current.previous) {
    // backButton.removeClass("active-icon");
    backButton.classList.remove("active-icon");
  } else {
    backButton.classList.add("active-icon");
  }
  if (!ll.current.next) {
    // forwardButton.removeClass("active-icon");
    forwardButton.classList.remove("active-icon");
  } else {
    // forwardButton.addClass("active-icon");
    forwardButton.classList.add("active-icon");
  }
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

function fixLatLon(num) {
  num = Math.abs(num);
  return num.toFixed(0);
}

function getLatitudeUnit(lat) {
  lat = parseInt(lat);
  if (lat < 0) {
    return "\u00B0S";
  } else {
    return "\u00B0N";
  }
}

function getLongitudeUnit(lon) {
  lon = parseInt(lon);
  if (lon < 0) {
    return "\u00B0W";
  } else {
    return "\u00B0E";
  }
}

function reduceText(text) {
  if (text === null) return (text = "");
  if (text.length > 30) {
    let words = 10;
    let newText = text;
    while (newText.length > 60) {
      newText = newText.split(" ").slice(0, words).join(" ");
      words--;
    }

    return newText + "...";
  }
  return text;
}

//---makes population figures readable----//
function makeNumberReadable(num) {
  if (num === undefined) {
    return "n/a";
  } else {
    num = num.toString();
    if (num === "0") {
      return "n/a";
    } else if (num.length < 4) {
      return num;
    } else if (num.length <= 6) {
      let thousands = num.slice(0, -3);
      let hundreds = num.slice(-3);
      num = thousands + "," + hundreds;
    } else if (num.length <= 9) {
      num = num.slice(0, -4);
      num = num / 100;
      num = num.toFixed(1);
      num = num + " million";
    } else {
      num = num.slice(0, -7);
      num = num / 100;
      num = num.toFixed(1);
      num = num + " billion";
    }
    return (num = num.replace(".0", ""));
  }
}

function cityNameValidCharactersOnly(inputCityName) {
  let cityName = inputCityName;
  while (
    cityName.includes(" ") ||
    cityName.includes("'") ||
    cityName.includes("(") ||
    cityName.includes(")")
  ) {
    cityName = cityName.replace(" ", "-");
    cityName = cityName.replace("'", "");
    cityName = cityName.replace("(", "");
    cityName = cityName.replace(")", "");
  }
  return cityName;
}

//GENERAL INFO MODAL FUNCTIONS
function addRow(cellTitle, cellInfo, table) {
  if (cellInfo === undefined) return;
  // const table = document.querySelector("#general-info-table");
  const row = table.insertRow(0);
  const cell1 = document.createElement("th");
  cell1.classList = "text-end";
  row.appendChild(cell1);
  const cell2 = row.insertCell();
  let text1 = document.createTextNode(cellTitle);
  let text2 = document.createTextNode(cellInfo);
  cell1.appendChild(text1);
  cell2.appendChild(text2);
}

function addCurrencyRow(cellTitle, cellInfo, symbol) {
  if (!cellInfo) return;
  const table = document.querySelector("#general-info-table");
  const row = table.insertRow(0);
  const cell1 = document.createElement("th");
  cell1.classList = "text-end";
  row.appendChild(cell1);
  const cell2 = row.insertCell();
  let text1 = document.createTextNode(cellTitle);
  let text2 = document.createTextNode(cellInfo);
  cell1.appendChild(text1);
  cell2.appendChild(text2);
  const span = document.createElement("span");
  const currencySymbol = document.createTextNode(`(${symbol})`);
  span.appendChild(currencySymbol);
  span.classList = "text-muted";
  cell2.appendChild(span);
}

function addLocalTimeRow(cellTitle, cellInfo) {
  if (!cellInfo) return;
  const table = document.querySelector("#general-info-table");
  const row = table.insertRow(0);
  const cell1 = document.createElement("th");
  cell1.classList = "text-end";
  const text1 = document.createTextNode(cellTitle);
  cell1.appendChild(text1);
  row.appendChild(cell1);

  const cell2 = row.insertCell();
  row.appendChild(cell2);
  const text2 = document.createTextNode(cellInfo.replace(/am|pm/, ""));
  cell2.appendChild(text2);
  const span = document.createElement("span");
  span.classList = "text-muted";
  const text3 = document.createTextNode(cellInfo.slice(-2));
  span.appendChild(text3);
  cell2.appendChild(span);
}

function addWeatherRow(cellTitle, cellInfo, weatherIcon, table) {
  if (!cellInfo) return;
  const row = table.insertRow(0);
  const cell1 = document.createElement("th");
  cell1.classList = "text-end";
  row.appendChild(cell1);
  let text1 = document.createTextNode(cellTitle);
  cell1.appendChild(text1);

  const cell2 = row.insertCell();
  const outerDiv = document.createElement("div");
  cell2.appendChild(outerDiv);
  outerDiv.classList = "weather-icon-parent-container";
  const innerDiv = document.createElement("div");
  innerDiv.classList = "weather-icon-container";
  outerDiv.appendChild(innerDiv);
  const img = document.createElement("img");
  innerDiv.appendChild(img);
  img.id = "current-weather-icon";
  img.classList = "weather-img";
  img.src = `libs/imgs/${weatherIcon}@2x.png`;
  const temp = document.createTextNode(cellInfo);
  cell2.appendChild(temp);
  const span = document.createElement("span");
  cell2.appendChild(span);
  const spanText = document.createTextNode("°C");
  span.classList = "text-muted";
  span.appendChild(spanText);
}

function addAreaRow(cellTitle, cellInfo) {
  if (!cellInfo) return;
  const table = document.querySelector("#general-info-table");
  const row = table.insertRow(0);

  const cell1 = document.createElement("th");
  cell1.classList = "text-end";
  row.appendChild(cell1);
  let text1 = document.createTextNode(cellTitle);
  cell1.appendChild(text1);

  const cell2 = row.insertCell();
  let text2 = document.createTextNode(cellInfo);
  const span = document.createElement("span");
  const km = document.createTextNode("km");
  span.appendChild(km);
  span.classList = "text-muted";
  const sup = document.createElement("sup");
  const number2 = document.createTextNode("2");
  sup.appendChild(number2);
  sup.classList = "text-muted";
  cell2.appendChild(text2);
  cell2.appendChild(span);
  cell2.appendChild(sup);
}

function addLatLngRow(cellTitle, lat, lng) {
  if (!lat || !lng) return;
  const table = document.querySelector("#general-info-table");
  const row = table.insertRow(0);

  const cell1 = document.createElement("th");
  row.appendChild(cell1);
  cell1.classList = "text-end";
  const text = document.createTextNode(cellTitle);
  cell1.appendChild(text);

  const cell2 = row.insertCell();
  row.appendChild(cell2);
  const span1 = document.createElement("span");
  const latText = document.createTextNode(fixLatLon(lat));
  span1.appendChild(latText);
  cell2.appendChild(span1);

  const span2 = document.createElement("span");
  cell2.appendChild(span2);
  span2.textContent = getLatitudeUnit(lat);

  const span3 = document.createElement("span");
  span3.textContent = ", ";
  cell2.appendChild(span3);

  const span4 = document.createElement("span");
  const lngText = document.createTextNode(fixLatLon(lng));
  span4.appendChild(lngText);
  cell2.appendChild(span4);

  const span5 = document.createElement("span");
  cell2.appendChild(span5);
  span5.textContent = getLongitudeUnit(lng);
}

function dataCapturedAtText(data) {
  const capturedAtArray = document.querySelectorAll(".data-captured-at-text");
  capturedAtArray.forEach((element) => {
    element.textContent = data.dataCapturedAt;
  });
}

function addUVIRow(cellTitle, cellInfo, table) {
  if (cellInfo === undefined) return;
  // const table = document.querySelector("#general-info-table");
  const row = table.insertRow(0);
  const cell1 = document.createElement("th");
  cell1.classList = "text-end";
  row.appendChild(cell1);
  const cell2 = row.insertCell();
  let text1 = document.createTextNode(cellTitle);
  let text2 = document.createTextNode(cellInfo);
  cell1.appendChild(text1);
  cell2.appendChild(text2);

  if (cellInfo <= 2) {
    cell2.classList.add("text-success");
  } else if (cellInfo < 6) {
    cell2.classList.add("text-warning");
  } else if (cellInfo >= 6) {
    cell2.classList.add("text-danger");
  }
}

//IMAGES CAROUSEL FUNCTION
function addCarouselImages(data) {
  if (data.countryImages) {
    const carousel = document.getElementById("country-images-carousel");
    const carouselInner = document.createElement("div");
    carousel.appendChild(carouselInner);
    carouselInner.classList = "carousel-inner";

    data.countryImages.forEach((image) => {
      //carouselItemDiv
      const carouselItemDiv = document.createElement("div");
      carouselInner.appendChild(carouselItemDiv);
      carouselItemDiv.classList = "carousel-item";
      carouselItemDiv.setAttribute("data-bs-interval", "4000");

      //imageParentDiv
      const imageParentDiv = document.createElement("div");
      carouselItemDiv.appendChild(imageParentDiv);
      imageParentDiv.classList =
        "carousel-img-parent d-flex justify-content-center";
      //img
      const img = document.createElement("img");
      imageParentDiv.appendChild(img);
      img.classList = "d-block w-100";
      img.classList = "carousel-img-size";
      img.src = image.url;
      img.setAttribute(
        "title",
        `${
          image.description ? image.description + ": " : data.countryName + ": "
        }${image.alt_description ? image.alt_description : ""}`
      );

      //captionDiv
      const captionDiv = document.createElement("div");
      carouselItemDiv.appendChild(captionDiv);
      captionDiv.classList = "carousel-caption p-0 m-0";
      //title
      const title = document.createElement("h5");
      captionDiv.appendChild(title);
      title.textContent = reduceText(image.description);
      //alt_description
      const altDescription = document.createElement("p");
      captionDiv.appendChild(altDescription);
      altDescription.textContent = reduceText(image.alt_description);
    });
    const images = document.querySelectorAll(".carousel-item");
    images[0].classList.add("active");
    //CREATE BUTTONS
    //PREV
    const prevButton = document.createElement("button");
    carouselInner.appendChild(prevButton);
    prevButton.classList = "carousel-control-prev";
    prevButton.type = "button";
    prevButton.setAttribute("data-bs-target", "#country-images-carousel");
    prevButton.setAttribute("data-bs-slide", "prev");
    //SPANS
    const prevSpan1 = document.createElement("span");
    prevButton.appendChild(prevSpan1);
    prevSpan1.classList = "carousel-control-prev-icon";
    prevSpan1.setAttribute("aria-hidden", "true");
    const prevSpan2 = document.createElement("span");
    prevButton.appendChild(prevSpan2);
    prevSpan2.classList = "visually-hidden";

    //NEXT
    const nextButton = document.createElement("button");
    carouselInner.appendChild(nextButton);
    nextButton.classList = "carousel-control-next";
    nextButton.type = "button";
    nextButton.setAttribute("data-bs-target", "#country-images-carousel");
    nextButton.setAttribute("data-bs-slide", "next");
    //SPANS
    const nextSpan1 = document.createElement("span");
    nextButton.appendChild(nextSpan1);
    nextSpan1.classList = "carousel-control-next-icon";
    nextSpan1.setAttribute("aria-hidden", "true");
    const nextSpan2 = document.createElement("span");
    nextButton.appendChild(nextSpan2);
    nextSpan2.classList = "visually-hidden";
  }
}

function addCities(data) {
  data.cityMarkers = {};
  if (data.cities) {
    data.cities.forEach((city) => {
      //set cityName also used for storing marker names
      let cityName = cityNameValidCharactersOnly(city.name);

      if (city.name !== data.capital) {
        data.cityMarkers[cityName] = L.marker([city.lat, city.lng], {
          icon: cityIcon,
          riseOnHover: true,
        })
          .addTo(citiesMCG)
          .bindPopup(
            `<h6><span id="" class="font-weight-bold">${
              city.name
            }</span><br>Population: ${makeNumberReadable(city.population)}</h6>`
          );
      } else {
        data.cityMarkers[cityName] = L.marker([city.lat, city.lng], {
          icon: capitalCityIcon,
          riseOnHover: true,
        })
          .addTo(capitalMCG)
          .bindPopup(
            `<h6><span id="" class="font-weight-bold">${
              city.name
            }<br>Capital City<br>Population: </span>${makeNumberReadable(
              city.population
            )}</h6>`
          );
        data.cityMarkers[cityName].openPopup();
      }

      //set up elements in cities modal
      const citiesList = document.getElementById("cities-list");
      const li = document.createElement("li");
      citiesList.appendChild(li);
      li.setAttribute("class", "mb-1");

      //create button
      const button = document.createElement("button");
      li.appendChild(button);
      const buttonName = document.createTextNode(`${city.name}`);
      button.appendChild(buttonName);
      button.setAttribute("data-bs-toggle", "collapse");
      button.setAttribute("data-bs-target", `#${cityName}-collapse`);
      button.setAttribute(
        "class",
        "btn btn-toggle align-items-center rounded collapsed"
      );
      button.addEventListener("click", function (e) {
        const targetCity = ll.current.data.cities.find(
          (city) => city.name === e.target.textContent
        );
        cityAPICalls(targetCity);
      });

      const cityDiv = document.createElement("div");
      li.appendChild(cityDiv);

      //cityDiv
      cityDiv.setAttribute("class", "collapse container");
      cityDiv.setAttribute("id", `${cityName}-collapse`);
      const cityDivContainer = document.createElement("div");
      cityDiv.appendChild(cityDivContainer);
      cityDivContainer.classList = "container";

      //create table
      const table = document.createElement("table");
      cityDivContainer.appendChild(table);
      table.id = `${cityName}-table`;
      table.classList = "table table-borderless table-striped table-sm mt-3";

      //findCityOnMap  item
      const findCityOnMap = table.insertRow(-1);
      const cell1 = findCityOnMap.insertCell();
      cell1.textContent = "";

      const cell2 = findCityOnMap.insertCell();
      cell2.textContent = "Find on map  ";
      cell2.classList = "w-50 text-primary fst-italic text-end pointer";

      const iconSpan = document.createElement("span");
      cell2.appendChild(iconSpan);
      cell2.classList = "find-on-map";
      iconSpan.classList = "fa-solid fa-arrow-right-long";

      //set zoom to city function
      cell2.addEventListener("click", function (e) {
        const innerHTML =
          e.target.parentElement.parentElement.parentElement.parentElement
            .parentElement.previousElementSibling.innerHTML;
        console.log(innerHTML);
        // const sliceAt = innerHTML.indexOf("(") - 1;
        // const target = innerHTML.slice(0, sliceAt);
        // console.log(target);
        data.cities.find((city) => {
          citiesModal.hide();
          // if (city.name === target) {
          if (city.name === innerHTML) {
            map.flyTo([city.lat, city.lng], 12, [2, 2]);
            let cityName = cityNameValidCharactersOnly(city.name);
            const marker = data.cityMarkers[cityName];

            (function openPopupOnZoomLevel12() {
              setTimeout(function () {
                if (map.getZoom() === 12) {
                  marker.openPopup();
                } else {
                  console.log(map.getZoom());
                  openPopupOnZoomLevel12();
                }
              }, 750);
            })();
            marker.openPopup();
            // callWeather(city.lat, city.lng, city.name);
          }
        });
      });
    });
  }
}

//----------------------------CITY API CALLS

function cityAPICalls(data) {
  if (data.weatherTemp) {
    return;
  }
  console.log("cityapicalls");
  console.log(data);
  Promise.all([
    apiOpenWeatherOneCall(data),
    apiOpenweatherAirPollution(data),
  ]).then(() => {
    updateCityInfoHTML(data);
  });
}

//---------------------------CITY ADD TO HTML
function updateCityInfoHTML(data) {
  let cityName = cityNameValidCharactersOnly(data.name);
  const table = document.querySelector(`#${cityName}-table`);
  console.log(data);
  addAirPollutionRow("Air Quality Index", data.airPollution, table);
  addUVIRow("UVI", data.uvi, table);
  addWeatherRow("Current Weather", data.weatherTemp, data.weatherIcon, table);
  addRow("Population", makeNumberReadable(data.population), table);
}

function addAirPollutionRow(cellTitle, cellInfo, table) {
  if (cellInfo === undefined) return;

  const row = table.insertRow(0);
  const cell1 = document.createElement("th");
  cell1.classList = "text-end";
  row.appendChild(cell1);
  const cell2 = row.insertCell();
  let text1 = document.createTextNode(cellTitle);
  let text2 = document.createTextNode(cellInfo);
  cell1.appendChild(text1);
  cell2.appendChild(text2);

  switch (cellInfo) {
    case 1:
      cell2.classList = "text-success";
      break;
    case 2:
      cell2.classList = "text-success";
      break;
    case 3:
      cell2.classList = "text-warning";
      break;
    case 4:
      cell2.classList = "text-danger";
      break;
    case 5:
      cell2.classList = "text-danger";
      break;
    default:
      cell2.classList = "";
  }
}
