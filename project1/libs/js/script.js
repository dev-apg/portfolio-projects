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

//SET UP MAP----------------------------------------------------//
// const map = L.map("map").setView([50, 0], 14);

const map = L.map("map", {
  center: [51.505, -0.09],
  zoom: 4,
});

const streetTiles = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 3,
    maxZoom: 18,
  }
).addTo(map);

// MAPTILER TILES - CURRENTLY LOCKED OUT DUE TO OVER USE OF FREE ACCOUNT
//import map tiles
// const streetTiles = L.tileLayer(
//   "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=I6Fjse9RiOJDIsWoxSx2",
//   {
//     attribution:
//       '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
//     minZoom: 3,
//     maxZoom: 18,
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
//     minZoom: 3,
//     maxZoom: 18,
//   }
// ).addTo(map);

let cityIcon = L.icon({
  iconUrl: "libs/css/images/bigcity.png",
  iconSize: [38, 45], // size of the icon
});

let capitalCityIcon = L.icon({
  iconUrl: "libs/css/images/capitalcity.png",
  iconSize: [50, 60], // size of the icon
});

let earthquakeIcon = L.icon({
  iconUrl: "libs/css/images/earthquake.png",
  iconSize: [38, 45], // size of the icon
});

let volcanoIcon = L.icon({
  iconUrl: "libs/css/images/volcano.png",
  iconSize: [38, 45], // size of the icon
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
  // Satellite: satelliteTiles,
  // Topographic: topographicTiles,
  Street: streetTiles,
};

const overlays = {
  cities: citiesMCG,
  capital: capitalMCG,
  earthquakes: earthquakesMCG,
  volcanoes: volcanoesMCG,
};

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

//wikipedia articles
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

//newsarticles
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

//call locationData on change
$("#select").change(function () {
  locationData($("#select").val());
});

//--------------------------Progress Modal error buttons-------------------------//

$("#try-again").on("click", function () {
  resetProgressModal();
  locationData($("#select").val());
});

$("#choose-another").on("click", function () {
  resetProgressModal();
  $("#select").attr("disabled", false);
});

//----------------------------CALL FUNCTIONS----------------------//
populateSelect();
locationData();

//-------------------------locationData()-------------------------------//

//GET USERS' LAT LON FROM DEVICE
//CALLS OPENCAGE WITH THIS INFORMATION
function locationData(selectedCountry) {
  progressBar(0);
  //stores country specific data to be added to html once all tasks are run
  infoStore = {
    //set by opencage call or from country select
    twoLetterCountryCode: "",
    threeLetterCountryCode: "",
    geojsonCountryOutline: "",
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
    // cityDetails: [],
    countryImages: [],
    weather: [],
    offset_sec: "",
    localTime: "",
  };
  //show progress modal
  $("#progressModal").modal({
    backdrop: "static",
    keyboard: false,
  });

  //flag to stop OpenCage being run twice on the first run
  let callOpencage = true;

  if (!selectedCountry) {
    //Call functions
    $("#loading-message-text").html(`getting user location`);
    getUserLocation()
      .then((position) =>
        opencageCall(position.coords.latitude, position.coords.longitude)
      )
      .catch((error) => logError(error))
      .then(() => setCallOpencageToFalse())
      .then(() => setSelected())
      .then(() => getData(infoStore.twoLetterCountryCode))
      .catch((error) => console.log(error));
  } else {
    //destroy featureGroup
    //call getData with userLocation (two letter country code)
    // console.log();
    getData(selectedCountry);
  }

  //setSelected
  function setSelected() {
    $(`#select option[value=${infoStore.twoLetterCountryCode}]`).prop(
      "selected",
      true
    );
  }

  function setCallOpencageToFalse() {
    callOpencage = false;
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
        errorMessage = `Geolocation request denied - please select a country`;
        break;
      case error.POSITION_UNAVAILABLE:
        // alert("Location information is unavailable.");
        errorMessage = `Geolocation unavailable - please select a country`;

        break;
      case error.TIMEOUT:
        // alert("The request to get user location timed out.");
        errorMessage = `Geolocation request timed out - please choose a country`;
        break;
      case error.UNKNOWN_ERROR:
        // alert("An unknown error occurred.");
        errorMessage = `Unable to access Geolocation - please choose a country`;
        break;
    }

    $("#loading-message-text").html(`${errorMessage}`);
  }

  //success callback
  //on success sets infoStore.twoLetterCountryCode
  function opencageCall(lat, lon) {
    if (callOpencage === false) return;
    console.log("***opencageCall***");
    console.log({ lat: lat, lon: lon });
    return $.ajax({
      url: "libs/php/api-opencage.php",
      type: "POST",
      dataType: "json",
      data: {
        lat: lat,
        lon: lon,
      },
      success: function (result) {
        if (result.status.name === "ok") {
          infoStore.twoLetterCountryCode =
            result.data.results[0].components["ISO_3166-1_alpha-2"];
          //new stuff
          infoStore.offset_sec =
            result.data.results[0].annotations.timezone.offset_sec;
          infoStore.unix = result.data.timestamp.created_unix;
          infoStore.localTime = currentDayTime(
            infoStore.unix + infoStore.offset_sec
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        //console.log(jqXHR);
        //console.log(textStatus);
        //console.log(errorThrown);
        errorRetrievingData();
      },
    });
  }

  //------------------getData()-------------------------------------//
  //------------------declared inside locationData()----------------//
  //------------------has access to infoStore-----------------------//

  function getData(countryCodeISO2) {
    console.log("***getData call***");
    console.log(countryCodeISO2); // check country code received
    $("#loading-message-country").html($("#select option:selected").text());

    //remove previous layers
    featureGroup1.eachLayer((layer) => layer.clearLayers());
    //clear modal data
    $("#wiki-data").empty();
    $("#news-data").empty();
    //clear unsplash country image
    $("#info-image-div").empty();
    if (!infoStore.geojsonCountryOutline === "") {
      infoStore.geojsonCountryOutline.remove();
    }
    clearHTML();
    progressBar(25);
    //call functions
    getGeoJSONData(countryCodeISO2)
      .then(() => geonamesCall(countryCodeISO2))
      .then(() => geonamesCitiesCall(infoStore.boundingBox, countryCodeISO2))
      .then(() => geonamesEarthquakesCall(infoStore.boundingBox))
      .then(() => restCountriesCall(infoStore.threeLetterCountryCode))
      .then(() => opencageCall(infoStore.latitude, infoStore.longitude))
      .then(() => geonamesWikiCall())
      .then(() => progressBar(50))
      .then(() => apiNewsCall())
      // .then(() => apiVolcanoesCall())
      .then(() => progressBar(75))
      .then(() => apiUnsplashCall())
      .then(() => apiOpenWeatherCurrentCall())
      .then(() => apiOpenWeatherForecastCall())
      .then(() => addToHTML())
      .then(() => progressBar(100));

    function getGeoJSONData(countryCodeISO2) {
      console.log("***getGeoJSONData*** was called");
      console.log({ countryCode: countryCodeISO2 });
      $("#loading-message-text").html(`geoJSON data`);
      return $.ajax({
        url: "libs/php/countryBorders-geoJSON.php",
        type: "GET",
        dataType: "json",
        data: { countryCode: countryCodeISO2 },
        success: function (result) {
          console.log(result);
          if (result) {
            // 1. create map layer for Leaflet bounding box
            infoStore.geojsonCountryOutline = L.geoJSON(result, {
              style: function (feature) {
                return { color: "rgba(35, 161, 192, 0.548)" };
              },
            }).addTo(featureGroup1);
            map.fitBounds(infoStore.geojsonCountryOutline.getBounds(), {
              padding: [18, 18],
            });
            //2. create bounding box co-ordinates
            infoStore.boundingBox = infoStore.geojsonCountryOutline.getBounds();
          }
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          errorRetrievingData();
        },
      });
    }

    function geonamesCall(countryCodeISO2) {
      console.log("***geonamesCall***");
      $("#loading-message-text").html(`country details`);
      return $.ajax({
        url: "libs/php/api-geonames.php",
        type: "POST",
        dataType: "json",
        data: {
          countryCodeISO2: countryCodeISO2,
        },
        success: function (result) {
          if (result.status.name == "ok") {
            infoStore.countryName = result.data[0].countryName;
            infoStore.capital = result.data[0].capital;
            infoStore.population = result.data[0].population;
            infoStore.currencyISO3Code = result.data[0].currencyCode;
            infoStore.threeLetterCountryCode = result.data[0].isoAlpha3;
            infoStore.continent = result.data[0].continentName;
            infoStore.geonameId = result.data[0].geonameId;
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // error code
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          errorRetrievingData();
        },
      });
    }

    function geonamesCitiesCall(boundingBox, countryCodeISO2) {
      console.log("***geonamesCitiesCall*** was called");
      $("#loading-message-text").html(`cities`);
      return $.ajax({
        url: "libs/php/api-geonames-cities.php",
        type: "POST",
        dataType: "json",
        data: {
          north: infoStore.boundingBox._northEast.lat,
          south: infoStore.boundingBox._southWest.lat,
          east: infoStore.boundingBox._northEast.lng,
          west: infoStore.boundingBox._southWest.lng,
        },
        success: function (result) {
          console.log({ infoStore: infoStore });
          result.data.forEach((city) => {
            // console.log(city);
            if (city.countrycode === countryCodeISO2) {
              if (city.toponymName !== infoStore.capital) {
                // infoStore.cityDetails.push({
                //   toponymName: city.toponymName,
                //   lat: city.lat,
                //   lng: city.lng,
                // });
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
                // infoStore.cityDetails.push({
                //   toponymName: city.toponymName,
                //   lat: city.lat,
                //   lng: city.lng,
                // });
                L.marker([city.lat, city.lng], {
                  icon: capitalCityIcon,
                  riseOnHover: true,
                })
                  .addTo(capitalMCG)
                  .bindPopup(
                    `<strong>${city.name}</strong><br class="pop-up-title">${
                      infoStore.countryName
                    } capital<br>Population: ${fixPopulation(city.population)}`
                  )
                  .openPopup();
              }
            }
          });
          // console.log(infoStore.cityDetails);
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          errorRetrievingData();
        },
      });
    }

    function geonamesEarthquakesCall() {
      console.log("***geonamesEarthquakesCall*** was called");
      $("#loading-message-text").html(`earthquakes`);
      return $.ajax({
        url: "libs/php/api-geonames-earthquakes.php",
        type: "POST",
        dataType: "json",
        data: {
          north: infoStore.boundingBox._northEast.lat,
          south: infoStore.boundingBox._southWest.lat,
          east: infoStore.boundingBox._northEast.lng,
          west: infoStore.boundingBox._southWest.lng,
        },
        success: function (result) {
          console.log(result.data);

          result.data.forEach((earthquake) => {
            console.log(earthquake);
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
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          errorRetrievingData();
        },
      });
    }

    function restCountriesCall(countryCodeISO3) {
      console.log("***restCountriesCall***");
      $("#loading-message-text").html(`country details`);
      return $.ajax({
        url: "libs/php/api-restcountries.php",
        type: "POST",
        dataType: "json",
        data: { countryCodeISO3: countryCodeISO3 },
        success: function (result) {
          // console.log(JSON.stringify(result));
          if (result.status.name == "ok") {
            console.log(result.data);
            infoStore.languages = result.data.languages[0].name;
            infoStore.latitude = result.data.latlng[0];
            infoStore.longitude = result.data.latlng[1];
            infoStore.area = result.data.area;
            infoStore.flag = result.data.flags.png;
            infoStore.currencyName = result.data.currencies[0].name;
            infoStore.currencySymbol = result.data.currencies[0].symbol;
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // error code
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          errorRetrievingData();
        },
      });
    }

    function geonamesWikiCall() {
      $("#loading-message-text").html(`wikipedia articles`);
      return $.ajax({
        url: "libs/php/api-geonames-wikipedia.php",
        type: "POST",
        dataType: "json",
        data: {
          north: infoStore.boundingBox._northEast.lat,
          south: infoStore.boundingBox._southWest.lat,
          east: infoStore.boundingBox._northEast.lng,
          west: infoStore.boundingBox._southWest.lng,
        },
        success: function (result) {
          // console.log(result.data);
          const articles = JSON.parse(result.data);
          articles.forEach((story) => {
            $("#wiki-data").append(
              `<p class="lead">${story[0][0]}</p><p>${story[1][0]}</p>
              <p><a href=${story[2][0]} target="_blank">${story[2][0]}</a></p><hr/>`
            );
          });
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          errorRetrievingData();
        },
      });
    }

    function apiNewsCall() {
      console.log("***apiNewsCall***");
      $("#loading-message-text").html(`news articles`);
      // console.log(infoStore.countryName);
      return $.ajax({
        url: "libs/php/api-apinews.php",
        type: "POST",
        dataType: "json",
        data: {
          countryname: infoStore.countryName,
        },
        success: function (result) {
          console.log(result);
          // const articles = JSON.parse(result.data);
          result.data.articles.forEach((story) => {
            // console.log(story);
            $("#news-data").append(
              `<p class="lead">${
                story.title
              }</p><p class="font-italic">${readableDate(
                story.publishedAt
              )}</p><img class="news-image" src=${story.urlToImage}><p>${
                story.description
              }</p>
               <p><a href=${story.url} target="_blank">${
                story.url
              }</a></p><hr/>`
            );
          });
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          errorRetrievingData();
        },
      });
    }

    function apiOpenWeatherCurrentCall() {
      console.log("***apiOpenWeatherCurrentCall***");
      $("#loading-message-text").html(`current weather`);
      return $.ajax({
        url: "libs/php/api-openweatherCurrent.php",
        type: "POST",
        dataType: "json",
        data: {
          latitude: infoStore.latitude,
          longitude: infoStore.longitude,
        },
        success: function (result) {
          // console.log(result.data);
          // infoStore.currentWeather.dayTime = currentDayTime(
          //   result.data.current.dt
          // );
          //description
          infoStore.currentWeather.description =
            result.data.current.weather[0].description;
          //icon
          infoStore.currentWeather.icon = result.data.current.weather[0].icon;
          //temp
          infoStore.currentWeather.temp = result.data.current.temp;
          console.log(infoStore.currentWeather);
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          errorRetrievingData();
        },
      });
    }

    function apiOpenWeatherForecastCall() {
      console.log("***apiOpenWeatherForecastCall***");
      $("#loading-message-text").html(`weather forecast`);
      return $.ajax({
        url: "libs/php/api-openweatherForecast.php",
        type: "POST",
        dataType: "json",
        data: {
          latitude: infoStore.latitude,
          longitude: infoStore.longitude,
        },
        success: function (result) {
          // console.log(result.data.list[0]);
          // console.log(result.data.list);
          console.log({ offset_sec: infoStore.offset_sec });
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
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          errorRetrievingData();
        },
      });
    }

    function apiVolcanoesCall() {
      console.log("***apiVolcanoesCall***");
      $("#loading-message-text").html(`volcanoes`);
      return $.ajax({
        url: "libs/php/api-volcanoes.php",
        type: "POST",
        dataType: "json",
        data: {
          countryname: infoStore.countryName,
        },
        success: function (result) {
          console.log(result);
          result.data.forEach((volcano) => {
            console.log(volcano.properties);
            L.marker(
              [volcano.properties.Latitude, volcano.properties.Longitude],
              {
                icon: volcanoIcon,
                riseOnHover: true,
              }
            )
              .addTo(volcanoesMCG)
              .bindPopup(`${volcano.properties.Volcano_Name}<br>Volcano`);
          });
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          errorRetrievingData();
        },
      });
    }

    function apiUnsplashCall() {
      console.log("***apiUnsplashCall***");
      $("#loading-message-text").html(`country images`);
      return $.ajax({
        url: "libs/php/api-unsplash.php",
        type: "POST",
        dataType: "json",
        data: {
          countryname: infoStore.countryName,
        },
        success: function (result) {
          // infoStore.countryImages.push(result.data);
          // console.log(infoStore.countryImages[0]);
          // console.log(result.data[0].urls.small);
          result.data.forEach((result) => {
            let obj = {};
            obj.url = result.urls.small;
            obj.description = result.description;
            obj.alt_description = result.alt_description;
            infoStore.countryImages.push(obj);
          });
          console.log(infoStore.countryImages);
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          errorRetrievingData();
        },
      });
    }

    function clearHTML() {
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

    function addToHTML() {
      $(".api-country").html(infoStore.countryName);
      $("#api-capital").html(infoStore.capital);
      $("#api-population").html(fixPopulation(infoStore.population));
      $("#api-currency").html(infoStore.currencyName);
      $("#api-currency-symbol").html(` (${infoStore.currencySymbol})`);
      $("#api-continent").html(infoStore.continent);
      $("#api-languages").html(infoStore.languages);
      $("#api-latitude").html(fixLatLon(infoStore.latitude));
      $("#api-latitude-units").html(getLatitudeUnit(infoStore.latitude));
      $("#api-longitude").html(fixLatLon(infoStore.longitude));
      $("#api-longitude-units").html(getLongitudeUnit(infoStore.longitude));
      $("#api-area").html(fixPopulation(infoStore.area));
      $(".api-flag").attr("src", infoStore.flag);
      $(".nav-flag-div").css("background-image", `url(${infoStore.flag})`);
      //COUNTRY IMAGES FOR CAROUSEL
      for (let i = 0; i < 5; i++) {
        $(`#country-image-${i}`).attr("src", infoStore.countryImages[i].url);
        $(`#country-image-${i}-description`).html(
          infoStore.countryImages[i].description
            ? infoStore.countryImages[i].description
            : infoStore.countryName
        );
        $(`#country-image-${i}-alt-description`).html(
          infoStore.countryImages[i].alt_description
        );
      }
      //LOCAL TIME
      $("#api-date-time").html(infoStore.localTime.slice(0, -3));
      $("#api-date-time-units").html(infoStore.localTime.slice(-2));
      //CURRENT WEATHER
      $("#current-weather-icon").attr(
        "src",
        `libs/imgs/${infoStore.currentWeather.icon}@2x.png`
      );
      $("#current-weather-icon").attr(
        "alt",
        infoStore.currentWeather.description
      );
      $("#current-temp").html(infoStore.currentWeather.temp);

      // FORECAST
      for (let i = 0; i < 5; i++) {
        $(`#weather-${i}-dateTime`).html(infoStore.weather[i].dateTime);
        $(`#weather-${i}-icon`).attr(
          "src",
          `libs/imgs/${infoStore.weather[i].icon}@2x.png`
        );
        $(`#weather-${i}-icon`).attr("alt", infoStore.weather[i].description);
        $(`#weather-${i}-temp`).html(infoStore.weather[i].temp);
      }
      $("#progressModal").modal("hide");
    }
  }

  //Error function - when API fails error modal is enabled
  function errorRetrievingData() {
    // $("#error-country-name").html($("#select option:selected").text());
    const country = $("#select option:selected").text();

    $("#loading-message-text").html(
      `Data for ${country} not currently available!`
    );

    $("#progress-modal-footer").removeClass("hide-progress-modal-footer");
    $("#loading-message").removeClass("alert-primary").addClass("alert-danger");
  }
}

function resetProgressModal() {
  $("#progress-modal-footer").addClass("hide-progress-modal-footer");
  $("#loading-message").removeClass("alert-danger").addClass("alert-primary");
}

//HELPER FUNCTIONS------------------------------------------//

//adjust width of progress bar - 0, 25, 50, 75, 100
function progressBar(width) {
  if (width === 0) {
    $("#loading-progress-bar")
      .removeClass(`width25`)
      .removeClass(`width50`)
      .removeClass(`width75`)
      .removeClass(`width100`);
  }
  $("#loading-progress-bar").addClass(`width${width}`);
  $("#loading-progress-bar").html(`${width}%`);
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
        // console.log(result);
        // console.log(Array.isArray(result));
        result.forEach((country) => {
          // console.log(country);
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
    if (num.length <= 6) {
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
  const date = new Date(unix * 1000);
  const options = {
    hour12: true,
    day: "2-digit",
    month: "short",
    weekday: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Intl.DateTimeFormat("en-GB", options).format(date);
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
document.getElementById("show-hide-forecast").onclick = function () {
  const collection = document.getElementsByClassName("weather-row");
  Array.from(collection).forEach((row) => {
    row.classList.toggle("hide-row");
  });
  if ($("#show-hide-forecast").html() === "(show forecast)") {
    $("#show-hide-forecast").html("(hide forecast)");
  } else {
    $("#show-hide-forecast").html("(show forecast)");
  }
};

function fixLatLon(num) {
  return Math.abs(num);
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
