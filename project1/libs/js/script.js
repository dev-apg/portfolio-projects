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

// Node that contains country data for linked list
class CountryDataNode {
  constructor(data, next = null, previous = null) {
    this.data = data;
    this.next = next;
    this.previous = previous;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }

  newCountryDataNode(data) {
    let node = new CountryDataNode(data);
    //if there's no existing country data node add as head, tail and current
    if (!this.head) {
      this.head = node;
      this.tail = node;
      this.current = node;
      // otherwise add as current and new tail
    } else {
      //loop through to find if there's an existing data node for selected country
      //if there's an existing node for that country then add new data to that node
      //otherwise new node added to linked list as this.current and this.tail
      let current = this.head;
      while (current) {
        if (current.data.countryName === node.data.countryName) {
          current.data = node.data;
          clearHTML(this.current.data);
          addToHTML(current.data);
          this.current = current;
          setNavButtons(this.current);
          this.recenter();
          return;
        }
        current = current.next;
      }
      //if there isn't an existing data node for this country:
      // clear existing HTML
      clearHTML(this.current.data);
      //link new node to tail node
      node.previous = this.tail;
      //link tail node to new node
      this.tail.next = node;
      //new node becomes current node and tail node
      this.current = node;
      this.tail = node;
      setNavButtons(this.current);
    }

    addToHTML(this.current.data);
    this.recenter();
  }

  back() {
    //if there's a back to go back to, go back
    if (!this.current.previous) {
      return;
    }
    clearHTML(this.current.data);

    this.current = this.current.previous;

    addToHTML(this.current.data);
    setSelected(this.current.data.twoLetterCountryCode);
    setNavButtons(this.current);
    this.recenter();
  }

  forward() {
    //if there's a forward to go to, go forward
    if (!this.current.next) {
      return;
    }
    clearHTML(this.current.data);
    this.current = this.current.next;
    setSelected(this.current.data.twoLetterCountryCode);
    addToHTML(this.current.data);
    setNavButtons(this.current);
    this.recenter();
  }

  printCurrent() {
    console.log(this.current);
  }

  recenter() {
    // map.fitBounds(this.current.data.geojsonCountryOutline.getBounds(), {
    //   padding: [9, 9],
    // });
    map.fitBounds(
      [
        [this.current.data.south, this.current.data.west],
        [this.current.data.north, this.current.data.east],
      ],
      {
        padding: [9, 9],
      }
    );
  }
}

const backButton = $("#left-bracket");
const forwardButton = $("#right-bracket");

function setNavButtons(current) {
  if (!current.previous) {
    backButton.removeClass("active-icon");
  } else {
    backButton.addClass("active-icon");
  }
  if (!current.next) {
    forwardButton.removeClass("active-icon");
  } else {
    forwardButton.addClass("active-icon");
  }
}

const ll = new LinkedList();

backButton.on("click", () => {
  ll.back();
});

forwardButton.on("click", () => {
  ll.forward();
});

// GLOBAL VARIABLES
let progressBarWidth = 0;

//SET UP MAP----------------------------------------------------//

const map = L.map("map", {
  center: [51.505, -0.09],
  // zoom: 4,
});

//alternative tiles for when maptiler not available due to free account
// const streetTiles = L.tileLayer(
//   "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//   {
//     attribution:
//       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     minZoom: 2,
//     maxZoom: 15,
//   }
// ).addTo(map);

// MAPTILER TILES
//import map tiles
const streetTiles = L.tileLayer(
  "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=I6Fjse9RiOJDIsWoxSx2",
  {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    minZoom: 3,
    maxZoom: 18,
  }
).addTo(map);

// const topographicTiles = L.tileLayer(
//   "https://api.maptiler.com/maps/topographique/{z}/{x}/{y}.png?key=I6Fjse9RiOJDIsWoxSx2",
//   {
//     attribution:
//       '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
//     minZoom: 3,
//     maxZoom: 18,
//   }
// ).addTo(map);

const satelliteTiles = L.tileLayer(
  "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=I6Fjse9RiOJDIsWoxSx2",
  {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    minZoom: 3,
    maxZoom: 18,
  }
).addTo(map);

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

// set up layer group
const featureGroup1 = L.featureGroup().addTo(map);

const citiesMCG = L.markerClusterGroup();
const capitalMCG = L.markerClusterGroup();
const earthquakesMCG = L.markerClusterGroup();
const volcanoesMCG = L.markerClusterGroup();

citiesMCG.addTo(featureGroup1);
capitalMCG.addTo(featureGroup1);
earthquakesMCG.addTo(featureGroup1);
volcanoesMCG.addTo(featureGroup1);

const baseLayers = {
  Satellite: satelliteTiles,
  // Topographic: topographicTiles,
  Street: streetTiles,
};

const overlays = {
  cities: citiesMCG,
  capital: capitalMCG,
  earthquakes: earthquakesMCG,
  volcanoes: volcanoesMCG,
};

// test
L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);

// EASY BUTTONS
//general info button
const generalInfoButton = L.easyButton({
  states: [
    {
      icon: "<span class='fas fa-info' ></span>",
      onClick: function () {
        $("#infoModal").modal("show");
      },
      id: "myEasyButton",
    },
  ],
}).addTo(map);

//wikipedia articles button
const wikiButton = L.easyButton({
  states: [
    {
      icon: "<span class='fab fa-wikipedia-w' ></span>",
      onClick: function () {
        $("#wikiModal").modal("show");
      },
      id: "myEasyButton",
    },
  ],
}).addTo(map);

//newsarticles button
const newsButton = L.easyButton({
  states: [
    {
      icon: "<span class='fas fa-newspaper' ></span>",
      onClick: function () {
        $("#newsModal").modal("show");
      },
      id: "myEasyButton",
    },
  ],
}).addTo(map);

//recenter button
const recenterButton = L.easyButton({
  states: [
    {
      icon: "<span class='fa-solid fa-location-crosshairs' ></span>",
      onClick: function () {
        ll.recenter();
      },
      id: "myEasyButton",
    },
  ],
}).addTo(map);

//call locationData on change
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

//launch "about" modal
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

//set select input to match that of current country
function setSelected(twoLetterCountryCode) {
  $(`#select option[value=${twoLetterCountryCode}]`).prop("selected", true);
}

//----------------------------CALL FUNCTIONS----------------------//
populateSelect();
locationData();

//-------------------------locationData()-------------------------------//

//GET USER'S LOCATION (LAT LON coords) FROM DEVICE
//CALLS OPENCAGE WITH THIS INFORMATION
function locationData(selectedCountry) {
  resetProgressModal();

  //data store used for other api calls and then dumped into new linked list node
  let infoStore = {
    errors: false,
    twoLetterCountryCode: "",
    threeLetterCountryCode: "",
    geojsonCountryOutline: "",
    geoJSON: "",
    boundingBox: "",
    countryName: "",
    capital: "",
    population: "",
    currencyISO3Code: "",
    currencyName: "",
    currencySymbol: "",
    continent: "",
    geonameId: "",
    languages: "",
    latitude: "",
    longitude: "",
    area: "",
    flag: "",
    currentWeather: {},
    cities: null,
    countryImages: [],
    weather: [],
    offset_sec: "",
    localTime: "",
    exchangeRate: "",
    earthquakes: "",
    wikipediaArticles: "",
    newsArticles: null,
    volcanoes: "",
    dataCapturedAt: "",
    north: null,
    south: null,
    east: null,
    west: null,
  };

  //show progress modal
  //settings added so that user can't click off before completion
  $("#progressModal").modal({
    backdrop: "static",
    keyboard: false,
  });

  //flag to stop OpenCage being run twice on the first run
  let callOpencage = true;

  function setCallOpencageToFalse() {
    callOpencage = false;
  }

  if (!selectedCountry) {
    //Call functions
    getUserLocation()
      .then((position) =>
        opencageCall(position.coords.latitude, position.coords.longitude)
      )
      .catch((error) => logError(error))
      .then(() => setCallOpencageToFalse())
      .then(() => setSelected(infoStore.twoLetterCountryCode))
      .then(() => getData(infoStore.twoLetterCountryCode))
      .catch((error) => console.log(error));
  } else {
    getData(selectedCountry);
  }

  //-------------------getLocation() - declared inside locationData()-----------------//
  function getUserLocation() {
    return new Promise(function (resolve, reject) {
      // Promisifying the geolocation API
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error)
      );
    });
  }

  //used as error callback
  function logError(error) {
    let errorMessage = "";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        // alert("Unable User denied the request for Geolocation.");
        errorMessage = `Unable to access your location - please select a country to visit.`;
        break;
      case error.POSITION_UNAVAILABLE:
        // alert("Location information is unavailable.");
        errorMessage = `Unable to access your location - please select a country`;

        break;
      case error.TIMEOUT:
        // alert("The request to get user location timed out.");
        errorMessage = `Geolocation request timed out - please choose a country`;
        break;
      case error.UNKNOWN_ERROR:
        // alert("An unknown error occurred.");
        errorMessage = `Unable to access your location - please choose a country`;
        break;
    }
    $("#loading-message-text").html(`${errorMessage}`);
    $("#progress-modal-footer").removeClass("display-none");
    $("#close-progress-modal").removeClass("display-none");
    $("#loading-message").removeClass("alert-primary").addClass("alert-danger");
    $("#country-selected-text").addClass("display-none");
    $("#loading-progress-bar-container").addClass("display-none");
  }
  //success callback
  //on success sets infoStore.twoLetterCountryCode
  function opencageCall(lat, lon) {
    console.log("***opencageCall***");
    if (!lat || !lon) {
      errorRetrievingData("error-country-details", infoStore);
      return;
    }
    if (callOpencage === false) return;
    return $.ajax({
      url: "libs/php/api-opencage.php",
      type: "POST",
      dataType: "json",
      data: {
        lat: lat,
        lon: lon,
      },
      success: function (result) {
        progressBar(8, "opencage");
        if (result.data.results.length === 0) {
          errorRetrievingData("error-country-details", infoStore);
          return;
        }
        infoStore.twoLetterCountryCode =
          result.data.results[0].components["ISO_3166-1_alpha-2"];
        //utc time
        infoStore.offset_sec =
          result.data.results[0].annotations.timezone.offset_sec;
        infoStore.unix = result.data.timestamp.created_unix;
        infoStore.localTime = currentDayTime(
          infoStore.unix + infoStore.offset_sec
        );
      },
      error: function (jqXHR, textStatus, errorThrown) {
        fatalError();
        progressBar(8, "opencage");
      },
    });
  }

  //------------------getData()-------------------------------------//
  //------------------declared inside locationData()----------------//
  //------------------has access to infoStore above-----------------------//

  function getData(countryCodeISO2) {
    console.log("***getData call***");
    // add country to progress modal whilst data is loading
    $("#loading-message-country").html($("#select option:selected").text());
    //call functions
    Promise.all([
      getGeoJSONData(countryCodeISO2),
      geonamesCall(countryCodeISO2),
    ])
      .then(() => restCountriesCall(infoStore.threeLetterCountryCode))
      .then(() =>
        Promise.all([
          apiVolcanoesCall(infoStore.countryName),
          openExchangeRatesCall(infoStore.currencyISO3Code),
          geonamesCitiesCall(infoStore, countryCodeISO2),
          geonamesEarthquakesCall(infoStore.boundingBox),
          geonamesWikiCall(infoStore.boundingBox),
          opencageCall(infoStore.latitude, infoStore.longitude),
          apiOpenWeatherCurrentCall(infoStore.latitude, infoStore.longitude),
          apiOpenWeatherForecastCall(infoStore.latitude, infoStore.longitude),
          apiNewsCall(infoStore.countryName),
          apiUnsplashCall(infoStore.countryName),
          getDateTime(),
        ])
      )
      .then(() => ll.newCountryDataNode(infoStore))
      .then(() => closeProgressModal(infoStore))
      .catch((error) => console.log(error));

    function getGeoJSONData(countryCodeISO2) {
      console.log("***getGeoJSONData*** was called");
      if (!countryCodeISO2) {
        fatalError();
        return;
      }
      // $("#loading-message-text").html(`geoJSON data`);
      return $.ajax({
        url: "libs/php/countryBorders-geoJSON.php",
        type: "GET",
        dataType: "json",
        data: { countryCode: countryCodeISO2 },
        success: function (result) {
          progressBar(7, "getGeoJSONData");
          if (!result) {
            errorRetrievingData("error-geoJSON", infoStore);
            return;
          }
          infoStore.geoJSON = result;
          infoStore.geojsonCountryOutline = L.geoJSON(result, {
            style: function (feature) {
              return { color: "rgba(15, 188, 249, 0.548)" };
            },
          });
          infoStore.boundingBox = infoStore.geojsonCountryOutline.getBounds();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          fatalError();
          progressBar(7, "getGeoJSONData");
        },
      });
    }

    function geonamesCall(countryCodeISO2) {
      console.log("***geonamesCall***");
      return $.ajax({
        url: "libs/php/api-geonames.php",
        type: "POST",
        dataType: "json",
        data: {
          countryCodeISO2: countryCodeISO2,
        },
        success: function (result) {
          progressBar(7, "geonamesCall");
          if (result.data.length !== 1) {
            errorRetrievingData("error-country-details", infoStore);
            return;
          }
          infoStore.countryName = result.data[0].countryName;
          infoStore.capital = result.data[0].capital;
          infoStore.population = result.data[0].population;
          infoStore.currencyISO3Code = result.data[0].currencyCode;
          infoStore.threeLetterCountryCode = result.data[0].isoAlpha3;
          infoStore.continent = result.data[0].continentName;
          infoStore.geonameId = result.data[0].geonameId;
          //
          infoStore.north = result.data[0].north;
          infoStore.south = result.data[0].south;
          infoStore.east = result.data[0].east;
          infoStore.west = result.data[0].west;
        },
        error: function (jqXHR, textStatus, errorThrown) {
          progressBar(7, "geonamesCall");
          fatalError();
        },
      });
    }

    function openExchangeRatesCall(currencyISO3Code) {
      console.log("***openExchangeRatesCall***");
      if (!currencyISO3Code) {
        errorRetrievingData("error-country-details", infoStore);
      }
      return $.ajax({
        url: "libs/php/api-openexchangerates.php",
        type: "POST",
        dataType: "json",
        success: function (result) {
          progressBar(7, "openexchangerates");
          if (!result.data) {
            errorRetrievingData("error-country-details", infoStore);
            return;
          }
          infoStore.exchangeRate = result.data[currencyISO3Code];
        },
        error: function (jqXHR, textStatus, errorThrown) {
          progressBar(7, "openexchangerates");
          fatalError();
        },
      });
    }

    function restCountriesCall(countryCodeISO3) {
      console.log("***restCountriesCall***");
      if (!countryCodeISO3) {
        errorRetrievingData("error-country-details", infoStore);
        progressBar(7, "restcountries");
        return;
      }
      return $.ajax({
        url: "libs/php/api-restcountries.php",
        type: "POST",
        dataType: "json",
        data: { countryCodeISO3: countryCodeISO3 },
        success: function (result) {
          progressBar(7, "restcountries");
          if (result.data.status === 400) {
            errorRetrievingData("error-country-details", infoStore);
            return;
          }
          infoStore.languages = result.data.languages[0].name;
          infoStore.latitude = result.data.latlng[0];
          infoStore.longitude = result.data.latlng[1];
          infoStore.area = result.data.area;
          infoStore.flag = result.data.flags.png;
          infoStore.currencyName = result.data.currencies[0].name;
          infoStore.currencySymbol = result.data.currencies[0].symbol;
        },
        error: function (jqXHR, textStatus, errorThrown) {
          progressBar(7, "restcountries");
          fatalError();
        },
      });
    }

    function geonamesCitiesCall(infoStore) {
      console.log("***geonamesCitiesCall*** was called");
      if (
        !infoStore.west ||
        !infoStore.north ||
        !infoStore.east ||
        !infoStore.south
      ) {
        errorRetrievingData("error-cities", infoStore);
        return;
      }
      return $.ajax({
        url: "libs/php/api-geonames-cities.php",
        type: "POST",
        dataType: "json",
        data: {
          west: infoStore.west,
          north: infoStore.north,
          east: infoStore.east,
          south: infoStore.south,
        },
        success: function (result) {
          progressBar(8, "geonamesCities");
          if (result.data.status) {
            errorRetrievingData("error-cities", infoStore);
            return;
          }
          infoStore.cities = result.data.geonames;
        },
        error: function (jqXHR, textStatus, errorThrown) {
          progressBar(8, "geonamesCities");
          fatalError();
        },
      });
    }

    function geonamesEarthquakesCall(boundingBox) {
      if (!boundingBox) {
        progressBar(8, "earthquakes");
        errorRetrievingData("error-earthquakes", infoStore);
        return;
      }
      console.log("***geonamesEarthquakesCall*** was called");
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
          progressBar(8, "earthquakes");
          if (!result.data) {
            errorRetrievingData("error-volcanoes", infoStore);
          }
          infoStore.earthquakes = result.data;
        },

        error: function (jqXHR, textStatus, errorThrown) {
          progressBar(8, "earthquakes");
          fatalError();
        },
      });
    }

    function geonamesWikiCall(boundingBox) {
      console.log("***geonamesWikiCall***");
      if (!boundingBox) {
        errorRetrievingData("error-wikipedia", infoStore);
        progressBar(8, "geonameswikipedia");
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
          progressBar(8, "geonameswikipedia");
          if (result.data.length === 1) {
            errorRetrievingData("error-wikipedia", infoStore);
            return;
          }
          infoStore.wikipediaArticles = JSON.parse(result.data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          progressBar(8, "geonameswikipedia");
          fatalError();
        },
      });
    }

    function apiNewsCall(countryName) {
      console.log("***apiNewsCall***");
      if (!countryName) {
        progressBar(8, "news");
        errorRetrievingData("error-news", infoStore);
        return;
      }
      return $.ajax({
        url: "libs/php/api-apinews.php",
        type: "POST",
        dataType: "json",
        data: {
          countryname: countryName,
        },
        success: function (result) {
          progressBar(8, "news");
          if (result.data.articles && result.data.articles.length > 0) {
            infoStore.newsArticles = result.data.articles;
          } else {
            errorRetrievingData("error-news", infoStore);
            return;
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          progressBar(8, "news");
          fatalError();
        },
      });
    }

    function apiOpenWeatherCurrentCall(latitude, longitude) {
      console.log("***apiOpenWeatherCurrentCall***");
      if (!latitude || !longitude) {
        errorRetrievingData("error-current-weather", infoStore);
        progressBar(8, "current-weather");
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
          progressBar(8, "current-weather");
          if (result.data.cod) {
            errorRetrievingData("error-current-weather", infoStore);
            return;
          }
          infoStore.currentWeather.description =
            result.data.current.weather[0].description;
          infoStore.currentWeather.icon = result.data.current.weather[0].icon;
          infoStore.currentWeather.temp = result.data.current.temp;
        },

        error: function (jqXHR, textStatus, errorThrown) {
          progressBar(8, "current-weather");
          fatalError();
        },
      });
    }

    function apiOpenWeatherForecastCall(latitude, longitude) {
      console.log("***apiOpenWeatherForecastCall***");
      if (!latitude || !longitude) {
        errorRetrievingData("error-weather-forecast", infoStore);
        progressBar(8, "openweatherForecast");
        return;
      }
      return $.ajax({
        url: "libs/php/api-openweatherForecast.php",
        type: "POST",
        dataType: "json",
        data: {
          latitude: infoStore.latitude,
          longitude: infoStore.longitude,
        },
        success: function (result) {
          progressBar(8, "openweatherForecast");
          if (result.data.cod !== "200") {
            errorRetrievingData("error-weather-forecast", infoStore);
            return;
          }

          const forecast = result.data.list;
          for (let i = 0; i < 5; i++) {
            const obj = {};
            if (i === 0) {
              obj.dateTime = forecastDayAndTime(
                forecast[i].dt + infoStore.offset_sec
              );
            } else if (
              i > 0 &&
              forecastDay(forecast[i].dt + infoStore.offset_sec) ===
                forecastDay(forecast[i - 1].dt + infoStore.offset_sec)
            ) {
              obj.dateTime = forecastTime(
                forecast[i].dt + infoStore.offset_sec
              );
            } else {
              obj.dateTime = forecastDayAndTime(
                forecast[i].dt + infoStore.offset_sec
              );
            }
            obj.description = forecast[i].weather[0].description;
            obj.icon = forecast[i].weather[0].icon;
            obj.temp = forecast[i].main.temp;
            infoStore.weather.push(obj);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          progressBar(8, "openweatherForecast");
          fatalError();
        },
      });
    }

    function apiVolcanoesCall(countryName) {
      console.log("***apiVolcanoesCall***");
      if (!countryName) {
        errorRetrievingData("error-volcanoes", infoStore);
        progressBar(8, "volcanoes");
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
          progressBar(8, "volcanoes");
          infoStore.volcanoes = result.data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
          progressBar(8, "volcanoes");
          fatalError();
        },
      });
    }

    function apiUnsplashCall(countryName) {
      console.log("***apiUnsplashCall***");
      if (!countryName) {
        errorRetrievingData("country-images", infoStore);
        progressBar(8, "unsplash");
        return;
      }
      return $.ajax({
        url: "libs/php/api-unsplash.php",
        type: "POST",
        dataType: "json",
        data: {
          countryname: infoStore.countryName,
        },
        success: function (result) {
          progressBar(8, "unsplash");
          if (result.data.length === 0) {
            errorRetrievingData("country-images", infoStore);
            return;
          }
          result.data.forEach((result) => {
            let obj = {};
            obj.url = result.urls.small;
            obj.description = result.description;
            obj.alt_description = result.alt_description;
            infoStore.countryImages.push(obj);
          });
        },

        error: function (jqXHR, textStatus, errorThrown) {
          progressBar(8, "unsplash");
          fatalError();
        },
      });
    }

    function getDateTime() {
      let date = Date();
      const printDate = date.split(" ").slice(0, 5).join(" ");
      infoStore.dataCapturedAt = printDate;
    }
  }
}

function resetProgressModal() {
  $("#loading-progress-bar-container").removeClass("display-none");
  $("#country-selected-text").removeClass("display-none");
  $("#progress-modal-footer").addClass("display-none");
  $("#try-again").addClass("display-none");
  $("#choose-another").addClass("display-none");
  $("#close-progress-modal").addClass("display-none");
  $("#loading-message").removeClass("alert-danger").addClass("alert-primary");
  //error messages:
  $("#error-cities").addClass("display-none");
  $("#error-geoJSON").addClass("display-none");
  $("#error-country-details").addClass("display-none");
  $("#error-wikipedia").addClass("display-none");
  $("#error-news").addClass("display-none");
  $("#error-current-weather").addClass("display-none");
  $("#error-weather-forecast").addClass("display-none");
  $("#error-volcanoes").addClass("display-none");
  $("#error-country-images").addClass("display-none");
  $("#loading-progress-bar-container").removeClass("display-none");
  progressBarWidth = 0;
  progressBar(0, "reset to zero");
}

//fatalError offers user choice to try again or choose another country
function fatalError() {
  const country = $("#select option:selected").text();
  $("#loading-message-text").html(
    `Data for ${country} not currently available!`
  );
  $("#progress-modal-footer").removeClass("display-none");
  $("#try-again").removeClass("display-none");
  $("#choose-another").removeClass("display-none");
  $("#loading-message").removeClass("alert-primary").addClass("alert-danger");
  $("#loading-progress-bar-container").addClass("display-none");
}

//Error function - when API callfails error modal is enabled
function errorRetrievingData(id, infoStore) {
  $(`#${id}`).removeClass("display-none");
  infoStore.errors = true;
}

function closeProgressModal(infoStore) {
  if (infoStore.errors === false) {
    $("#progressModal").modal("hide");
  } else {
    $("#progress-modal-footer").removeClass("display-none");
    $("#close-progress-modal").removeClass("display-none");
    $("#loading-progress-bar-container").addClass("display-none");
    $("#loading-message-text").html("");
  }
}

//reset the map and all modals
function clearHTML(data) {
  //hide
  if ($("#show-hide-forecast").html() === "(less)") {
    $("#show-hide-forecast").html("(more)");
    const collection = $(".weather-row");
    Array.from(collection).forEach((row) => {
      row.classList.toggle("hide-row");
    });
  }

  //remove previous layers
  featureGroup1.eachLayer((layer) => layer.clearLayers());
  //clear modal data
  $("#wiki-data").empty();
  $("#news-data").empty();
  //clear unsplash country image
  $("#info-image-div").empty();
  if (!data.geojsonCountryOutline === "") {
    data.geojsonCountryOutline.remove();
  }

  //clear infoModal data (in case new data doesn't load and overwrite it)
  $(".api-country").html("");
  $("#api-capital").html("");
  $("#api-population").html("");
  $("#api-currency").html("");
  $("#api-currency-symbol").html("");
  $("#api-continent").html("");
  $("#api-languages").html("");
  $("#api-latitude").html("");
  $("#api-latitude-units").html("");
  $("#api-longitude").html("");
  $("#api-longitude-units").html("");
  $("#api-area").html("");
  $(".api-flag").attr("src", "");
  $(".nav-flag-div").css("background-image", "");
  //COUNTRY IMAGES FOR CAROUSEL
  for (let i = 0; i < 5; i++) {
    $(`#country-image-${i}`).attr("src", "");
    $(`#country-image-${i}-description`).html("");
    $(`#country-image-${i}-alt-description`).html("");
  }
  //LOCAL TIME
  $("#api-date-time").html("");
  $("#api-date-time-units").html("");
  //CURRENT WEATHER
  $("#current-weather-icon").attr("src", "");
  $("#current-weather-icon").attr("alt", "");
  $("#current-temp").html("");

  // FORECAST
  for (let i = 0; i < 5; i++) {
    $(`#weather-${i}-dateTime`).html("");
    $(`#weather-${i}-icon`).attr("src", "");
    $(`#weather-${i}-icon`).attr("alt", "");
    $(`#weather-${i}-temp`).html("");
  }
}

function addToHTML(data) {
  // country outline
  const outline = L.geoJSON(data.geoJSON, {
    style: function (feature) {
      return { color: "rgba(15, 188, 249, 0.548)" };
    },
  }).addTo(featureGroup1);

  //cities
  if (data.cities) {
    data.cities.forEach((city) => {
      if (city.countrycode === data.twoLetterCountryCode) {
        if (city.toponymName !== data.capital) {
          L.marker([city.lat, city.lng], {
            icon: cityIcon,
            riseOnHover: true,
          })
            .addTo(citiesMCG)
            .bindPopup(
              `<strong><span id="purple">${
                city.name
              }</span></strong><br>Population: ${fixPopulation(
                city.population
              )}`
            );
        } else {
          L.marker([city.lat, city.lng], {
            icon: capitalCityIcon,
            riseOnHover: true,
          })
            .addTo(capitalMCG)
            .bindPopup(
              `<strong>${city.name}</strong><br class="pop-up-title">${
                data.countryName
              } capital<br>Population: ${fixPopulation(city.population)}`
            )
            .openPopup();
        }
      }
    });
  }
  // earthquakes
  if (data.earthquakes) {
    data.earthquakes.forEach((earthquake) => {
      const thedate = new Date(earthquake.datetime);
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let date =
        thedate.getDate().toString() +
        " " +
        months[thedate.getMonth()] +
        " " +
        thedate.getFullYear();

      L.marker([earthquake.lat, earthquake.lng], {
        color: "#f8b02b",
        icon: earthquakeIcon,
        riseOnHover: true,
      })
        .addTo(earthquakesMCG)
        .bindPopup(
          `<strong>Earthquake location</strong><br><strong>Date:</strong> ${date}<br><strong>Magnitude:</strong> ${earthquake.magnitude}`
        );
    });
  }

  if (data.volcanoes) {
    data.volcanoes.forEach((volcano) => {
      L.marker([volcano.properties.Latitude, volcano.properties.Longitude], {
        icon: volcanoIcon,
        riseOnHover: true,
      })
        .addTo(volcanoesMCG)
        .bindPopup(`${volcano.properties.Volcano_Name}<br>Volcano`);
    });
  }
  // wikipedia articles
  if (data.wikipediaArticles) {
    data.wikipediaArticles.forEach((story) => {
      $("#wiki-data").append(
        `<p class="lead">${story[0][0]}</p><p>${story[1][0]}</p>
      <p><a href=${story[2][0]} target="_blank">${story[2][0]}</a></p><hr/>`
      );
    });
  }

  // news articles
  if (data.newsArticles) {
    data.newsArticles.forEach((story) => {
      $("#news-data").append(
        `<p class="lead">${
          story.title
        }</p><p class="font-italic">${readableDate(
          story.publishedAt
        )}</p><img class="news-image" src=${story.urlToImage}><p>${
          story.description
        }</p>
      <p><a href=${story.url} target="_blank">${story.url}</a></p><hr/>`
      );
    });
  }

  // general info
  $(".api-country").html(data.countryName);
  $("#api-capital").html(data.capital);
  $("#api-population").html(fixPopulation(data.population));
  $("#api-currency").html(data.currencyName);
  $("#api-currency-symbol").html(` (${data.currencySymbol})`);
  $("#api-currency-symbol-for-exchange").html(data.currencySymbol);
  if (data.exchangeRate) {
    $("#api-exchange-rate").html(data.exchangeRate.toFixed(2));
  }

  $("#api-continent").html(data.continent);
  $("#api-languages").html(data.languages);
  $("#api-latitude").html(fixLatLon(data.latitude));
  $("#api-latitude-units").html(getLatitudeUnit(data.latitude));
  $("#api-longitude").html(fixLatLon(data.longitude));
  $("#api-longitude-units").html(getLongitudeUnit(data.longitude));
  $("#api-area").html(fixPopulation(data.area));
  $(".api-flag").attr("src", data.flag);
  $(".nav-flag-div").css("background-image", `url(${data.flag})`);

  //LOCAL TIME
  $("#api-date-time").html(data.localTime.replace(/am|pm/, ""));
  $("#api-date-time-units").html(data.localTime.slice(-2));
  //CURRENT WEATHER
  $("#current-weather-icon").attr(
    "src",
    `libs/imgs/${data.currentWeather.icon}@2x.png`
  );
  $("#current-weather-icon").attr("alt", data.currentWeather.description);
  $("#current-temp").html(data.currentWeather.temp);

  // FORECAST

  if (data.weather.length !== 0) {
    for (let i = 0; i < 5; i++) {
      $(`#weather-${i}-dateTime`).html(data.weather[i].dateTime);
      $(`#weather-${i}-icon`).attr(
        "src",
        `libs/imgs/${data.weather[i].icon}@2x.png`
      );
      $(`#weather-${i}-icon`).attr("alt", data.weather[i].description);
      $(`#weather-${i}-temp`).html(data.weather[i].temp);
    }
  }

  //COUNTRY IMAGES FOR GENERAL INFO CAROUSEL
  if (data.countryImages.length !== 0) {
    for (let i = 0; i < 5; i++) {
      $(`#country-image-${i}`).attr("src", data.countryImages[i].url);
      $(`#country-image-${i}`).attr(
        "title",
        `${
          data.countryImages[i].description
            ? data.countryImages[i].description + ": "
            : data.countryName + ": "
        }${
          data.countryImages[i].alt_description
            ? data.countryImages[i].alt_description
            : ""
        }`
      );
      $(`#country-image-${i}-description`).html(
        data.countryImages[i].description
          ? reduceText(data.countryImages[i].description)
          : data.countryName
      );
      $(`#country-image-${i}-alt-description`).html(
        reduceText(data.countryImages[i].alt_description)
      );
    }
  }

  $("#data-captured-at-text").html(data.dataCapturedAt);
}

//HELPER FUNCTIONS------------------------------------------//

function progressBar(widthIncrease, functionName) {
  progressBarWidth += widthIncrease;
  // console.log({ progressBarWidth, functionName: functionName });
  $("#loading-progress-bar").css({ width: `${progressBarWidth}%` });
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

//---makes population figures readable----//
function fixPopulation(num) {
  if (num === undefined) {
    return "n/a";
  } else {
    num = num.toString();
    if (num === "0") {
      return "n/a";
    } else if (num.length < 4) {
      return num;
    } else if (num.length <= 6) {
      num = num.slice(0, -1);
      num = num / 100;
      num = num.toFixed(0);
      num = num + " thousand";
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

//make date readable
function readableDate(rawDate) {
  let date = new Date(rawDate);
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-GB", options).format(date);
}

//DATE AND TIME FOR LOCAL TIME

function currentDayTime(unix) {
  unix = unix * 1000;
  const date = new Date(unix);
  const options = {
    day: "2-digit",
    month: "short",
    weekday: "short",
    year: "numeric",
  };
  let minutes = String(date.getMinutes());
  let hours = date.getHours();
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

  return (
    new Intl.DateTimeFormat("en-GB", options).format(date) +
    ", " +
    hours +
    ":" +
    minutes +
    amOrPm
  );
}

//DATE AND TIME FORMATTING FOR FORECAST

function forecastDay(unix) {
  unix = unix * 1000;
  let date = new Date(unix);
  let options = {
    weekday: "long",
  };
  return new Intl.DateTimeFormat("en-GB", options).format(date);
}

function forecastTime(unix) {
  unix = unix * 1000;
  let date = new Date(unix);
  let hours = date.getHours();
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

function forecastDayAndTime(unix) {
  unix = unix * 1000;
  let date = new Date(unix);
  let options = {
    weekday: "long",
    // hour12: true,
    // hour: "numeric",
  };
  let hours = date.getHours();

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

//SHOW/HIDE FORECAST ON INFO MODAL
$("#show-hide-forecast").on("click", function () {
  const collection = $(".weather-row");
  Array.from(collection).forEach((row) => {
    row.classList.toggle("hide-row");
  });
  if ($("#show-hide-forecast").html() === "(more)") {
    $("#show-hide-forecast").html("(less)");
  } else {
    $("#show-hide-forecast").html("(more)");
  }
});

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
    while (newText.length > 30) {
      newText = newText.split(" ").slice(0, words).join(" ");
      words--;
    }

    return newText + "...";
  }
  return text;
}
