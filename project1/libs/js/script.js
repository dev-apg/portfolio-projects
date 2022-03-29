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

// Node that forms part of linked list
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
    console.log("new node added");
    let node = new CountryDataNode(data);
    console.log(node);
    //if there's no head add one
    if (!this.head) {
      console.log("there is no head");
      this.head = node;
      this.tail = node;
      this.current = node;
      console.log("head added");
      // otherwise add as new tail...
    } else {
      let current = this.head;
      console.log({ "current.next": [current.next] });
      //... if there's no existing node for that country
      while (current) {
        console.log("there is a current.next");
        console.log(`${current.data.countryName}`);
        if (current.data.countryName === node.data.countryName) {
          current.data = node.data;
          console.log("they matched");
          clearHTML(this.current.data);
          addToHTML(current.data);
          this.current = current;
          setNavButtons(this.current);
          this.recenter();
          return;
        }
        current = current.next;
      }
      //new node links to tail node
      node.previous = this.tail;
      //tail node links to new node
      this.tail.next = node;
      //new node becomes current node
      this.current = node;
      this.tail = node;
      setNavButtons(this.current);
    }
    if (this.current.previous) {
      clearHTML(this.current.previous.data);
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
    map.fitBounds(this.current.data.geojsonCountryOutline.getBounds(), {
      padding: [9, 9],
    });
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
// const map = L.map("map").setView([50, 0], 14);

const map = L.map("map", {
  center: [51.505, -0.09],
  // zoom: 4,
});

const streetTiles = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 2,
    maxZoom: 15,
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

//recenter
const recenterButton = L.easyButton({
  states: [
    {
      icon: "<span class='fa-solid fa-location-crosshairs' ></span>",
      onClick: function () {
        // map.fitBounds(infoStore.geojsonCountryOutline.getBounds(), {
        //   padding: [9, 9],
        // });
        ll.recenter();
        ll.printCurrent();
      },
      id: "myEasyButton",
    },
  ],
}).addTo(map);

//call locationData on change
$("#select").change(function () {
  locationData($("#select").val());
});

//click on flag to refresh
$(".nav-flag-div").on("click", function () {
  locationData($("#select").val());
});

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
  $("#select");
});

//setSelected
function setSelected(twoLetterCountryCode) {
  $(`#select option[value=${twoLetterCountryCode}]`).prop("selected", true);
}

// $("#choose-another").on("click", function () {
//   resetProgressModal();
// });

//----------------------------CALL FUNCTIONS----------------------//
populateSelect();
locationData();

//-------------------------locationData()-------------------------------//

//GET USERS' LAT LON FROM DEVICE
//CALLS OPENCAGE WITH THIS INFORMATION
function locationData(selectedCountry) {
  resetProgressModal();
  //stores country specific data to be added to html once all tasks are run
  let infoStore = {
    //set by opencage call or from country select
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
    newsArticles: "",
    volcanoes: "",
    dataCapturedAt: "",
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
    // $("#loading-message-text").html(`getting user location`);
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
    //destroy featureGroup
    //call getData with userLocation (two letter country code)
    // console.log();
    getData(selectedCountry);
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
    // $("#retrieving-data-text").addClass("display-none");
    $("#loading-progress-bar-container").addClass("display-none");
  }
  //success callback
  //on success sets infoStore.twoLetterCountryCode
  function opencageCall(lat, lon) {
    console.log("***opencageCall***");
    console.log({ lat: lat, lon: lon });
    console.log(infoStore);
    if (!lat || !lon) {
      errorRetrievingData("error-country-details");
      return;
    }
    // $("#loading-message-text").html(`country details`);
    if (callOpencage === false) return;
    // console.log("***opencageCall***");
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
        console.log(result.data.status.message);
        if (result.data.status.message === "ok") {
          errorRetrievingData("error-country-details");
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
        //console.log(jqXHR);
        //console.log(textStatus);
        //console.log(errorThrown);
        fatalError();
        progressBar(8, "opencage");
      },
    });
  }

  //------------------getData()-------------------------------------//
  //------------------declared inside locationData()----------------//
  //------------------has access to infoStore-----------------------//

  function getData(countryCodeISO2) {
    console.log("***getData call***");
    // add country to progress modal whilst data is loading
    $("#loading-message-country").html($("#select option:selected").text());

    // clearHTML();

    //call functions
    Promise.all([
      getGeoJSONData(countryCodeISO2),
      geonamesCall(countryCodeISO2),
    ])
      .then(() => restCountriesCall(infoStore.threeLetterCountryCode))
      .then(() => console.log(infoStore))
      .then(() =>
        Promise.all([
          // apiVolcanoesCall(infoStore.countryName),
          // openExchangeRatesCall(infoStore.currencyISO3Code),
          geonamesCitiesCall(infoStore.boundingBox, countryCodeISO2),
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
      .then(() => console.log("all done"))
      .then(() => ll.newCountryDataNode(infoStore))
      .then(() => closeProgressModal());

    function getGeoJSONData() {
      console.log("***getGeoJSONData*** was called");
      // if (!countryCodeISO2) {
      //   fatalError();
      //   return;
      // }
      // $("#loading-message-text").html(`geoJSON data`);
      return $.ajax({
        url: "libs/php/countryBorders-geoJSON.php",
        type: "GET",
        dataType: "json",
        data: { countryCode: countryCodeISO2 },
        success: function (result) {
          progressBar(7, "getGeoJSONData");
          console.log(result);
          if (!result) {
            errorRetrievingData("error-geoJSON");
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
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          fatalError();
          progressBar(7, "getGeoJSONData");
        },
      });
    }

    function geonamesCall(countryCodeISO2) {
      console.log("***geonamesCall***");
      console.log({ countryCodeISO2: countryCodeISO2 });
      // $("#loading-message-text").html(`country details`);
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
            errorRetrievingData("error-country-details");
            return;
          }
          infoStore.countryName = result.data[0].countryName;
          infoStore.capital = result.data[0].capital;
          infoStore.population = result.data[0].population;
          infoStore.currencyISO3Code = result.data[0].currencyCode;
          infoStore.threeLetterCountryCode = result.data[0].isoAlpha3;
          infoStore.continent = result.data[0].continentName;
          infoStore.geonameId = result.data[0].geonameId;
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // error code
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          progressBar(7, "geonamesCall");
          fatalError();
        },
      });
    }

    function openExchangeRatesCall(currencyISO3Code) {
      console.log("***openExchangeRatesCall***");
      console.log({ currencyISO3Code: currencyISO3Code });
      // $("#loading-message-text").html(`exchange rate`);
      return $.ajax({
        url: "libs/php/api-openexchangerates.php",
        type: "POST",
        dataType: "json",
        success: function (result) {
          progressBar(7, "openexchangerates");
          if (!result.data) {
            errorRetrievingData("error-country-details");
            return;
          }
          infoStore.exchangeRate = result.data[currencyISO3Code];
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // error code

          fatalError();
        },
      });
    }

    function restCountriesCall(countryCodeISO3) {
      console.log("***restCountriesCall***");
      console.log({ countryCodeISO3: countryCodeISO3 });
      if (!countryCodeISO3) {
        errorRetrievingData("error-country-details");
        return;
      }
      // $("#loading-message-text").html(`country details`);
      return $.ajax({
        url: "libs/php/api-restcountries.php",
        type: "POST",
        dataType: "json",
        data: { countryCodeISO3: countryCodeISO3 },
        success: function (result) {
          // console.log(JSON.stringify(result));
          progressBar(7, "restcountries");

          if (result.data.status === 400) {
            errorRetrievingData("error-country-details");
            return;
          }
          // console.log(result.data);
          infoStore.languages = result.data.languages[0].name;
          infoStore.latitude = result.data.latlng[0];
          infoStore.longitude = result.data.latlng[1];
          infoStore.area = result.data.area;
          infoStore.flag = result.data.flags.png;
          infoStore.currencyName = result.data.currencies[0].name;
          infoStore.currencySymbol = result.data.currencies[0].symbol;
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // error code
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          progressBar(7, "restcountries");
          fatalError();
        },
      });
    }

    function geonamesCitiesCall(boundingBox, countryCodeISO2) {
      console.log({
        boundingBox: boundingBox,
        countryCodeISO2: countryCodeISO2,
      });
      if (!boundingBox || !countryCodeISO2) {
        errorRetrievingData("error-cities");
        return;
      }
      console.log("***geonamesCitiesCall*** was called");
      // $("#loading-message-text").html(`cities`);
      console.log({ countryCodeISO2: countryCodeISO2 });
      return $.ajax({
        url: "libs/php/api-geonames-cities.php",
        type: "POST",
        dataType: "json",
        data: {
          north: boundingBox._northEast.lat,
          south: boundingBox._southWest.lat,
          east: boundingBox._northEast.lng,
          west: boundingBox._southWest.lng,
        },
        success: function (result) {
          progressBar(8, "geonamesCities");
          console.log(result);
          if (result.data.status) {
            errorRetrievingData("error-cities");
            return;
          }
          infoStore.cities = result.data.geonames;
          // result.data.geonames.forEach((city) => {
          //   if (city.countrycode === countryCodeISO2) {
          //     if (city.toponymName !== infoStore.capital) {
          //       L.marker([city.lat, city.lng], {
          //         icon: cityIcon,
          //         riseOnHover: true,
          //       })
          //         .addTo(citiesMCG)
          //         .bindPopup(
          //           `<strong><span id="purple">${
          //             city.name
          //           }</span></strong><br>Population: ${fixPopulation(
          //             city.population
          //           )}`
          //         );
          //     } else {
          //       L.marker([city.lat, city.lng], {
          //         icon: capitalCityIcon,
          //         riseOnHover: true,
          //       })
          //         .addTo(capitalMCG)
          //         .bindPopup(
          //           `<strong>${city.name}</strong><br class="pop-up-title">${
          //             infoStore.countryName
          //           } capital<br>Population: ${fixPopulation(city.population)}`
          //         )
          //         .openPopup();
          //     }
          //   }
          // });
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          progressBar(8, "geonamesCities");
          fatalError();
        },
      });
    }

    function geonamesEarthquakesCall(boundingBox) {
      console.log({ boundingBox: boundingBox });
      if (!boundingBox) {
        errorRetrievingData("error-earthquakes");
        return;
      }
      console.log("***geonamesEarthquakesCall*** was called");
      // $("#loading-message-text").html(`earthquakes`);
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
          // console.log(result.data);
          if (result.data === null) {
            errorRetrievingData("error-volcanoes");
          }
          infoStore.earthquakes = result.data;
          // result.data.forEach((earthquake) => {
          //   // console.log(earthquake);
          //   const thedate = new Date(earthquake.datetime);
          //   const months = [
          //     "January",
          //     "February",
          //     "March",
          //     "April",
          //     "May",
          //     "June",
          //     "July",
          //     "August",
          //     "September",
          //     "October",
          //     "November",
          //     "December",
          //   ];
          //   let date =
          //     thedate.getDate().toString() +
          //     " " +
          //     months[thedate.getMonth()] +
          //     " " +
          //     thedate.getFullYear();

          //   L.marker([earthquake.lat, earthquake.lng], {
          //     color: "#f8b02b",
          //     icon: earthquakeIcon,
          //     riseOnHover: true,
          //   })
          //     .addTo(earthquakesMCG)
          //     .bindPopup(
          //       `<strong>Earthquake location</strong><br><strong>Date:</strong> ${date}<br><strong>Magnitude:</strong> ${earthquake.magnitude}`
          //     );
          // });
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          progressBar(8, "earthquakes");
          fatalError();
        },
      });
    }

    function geonamesWikiCall(boundingBox) {
      console.log({ boundingBox: boundingBox });
      console.log("***geonamesWikiCall***");
      if (!boundingBox) {
        errorRetrievingData("error-wikipedia");
        return;
      }
      // $("#loading-message-text").html(`wikipedia articles`);
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
          // console.log(result);
          if (result.data.length === 1) {
            errorRetrievingData("error-wikipedia");
            return;
          }
          infoStore.wikipediaArticles = JSON.parse(result.data);
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          progressBar(8, "geonameswikipedia");
          fatalError();
        },
      });
    }

    function apiNewsCall(countryName) {
      console.log({ countryName: countryName });
      console.log("***apiNewsCall***");
      if (!countryName) {
        errorRetrievingData("error-news");
        return;
      }
      // $("#loading-message-text").html(`news articles`);
      return $.ajax({
        url: "libs/php/api-apinews.php",
        type: "POST",
        dataType: "json",
        data: {
          countryname: countryName,
        },
        success: function (result) {
          progressBar(8, "news");
          console.log(result);
          if (result.data.articles && result.data.articles.length > 0) {
            infoStore.newsArticles = result.data.articles;
          } else {
            errorRetrievingData("error-news");
            return;
          }
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          progressBar(8, "news");
          fatalError();
        },
      });
    }

    function apiOpenWeatherCurrentCall(latitude, longitude) {
      console.log("***apiOpenWeatherCurrentCall***");
      console.log({ latitude: latitude, longitude: longitude });
      if (!latitude || !longitude) {
        errorRetrievingData("error-current-weather");
        return;
      }
      // $("#loading-message-text").html(`current weather`);
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
            errorRetrievingData("error-current-weather");
            return;
          }
          //description
          infoStore.currentWeather.description =
            result.data.current.weather[0].description;
          //icon
          infoStore.currentWeather.icon = result.data.current.weather[0].icon;
          //temp
          infoStore.currentWeather.temp = result.data.current.temp;
          // console.log(infoStore.currentWeather);
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          progressBar(8, "current-weather");
          fatalError();
        },
      });
    }

    function apiOpenWeatherForecastCall(latitude, longitude) {
      console.log("***apiOpenWeatherForecastCall***");
      console.log({ latitude: latitude, longitude: longitude });
      if (!latitude || !longitude) {
        errorRetrievingData("error-weather-forecast");
        return;
      }
      // $("#loading-message-text").html(`weather forecast`);
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
            errorRetrievingData("error-weather-forecast");
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
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          progressBar(8, "openweatherForecast");
          fatalError();
        },
      });
    }

    function apiVolcanoesCall(countryName) {
      console.log("***apiVolcanoesCall***");
      console.log({ countryName: countryName });
      if (!countryName) {
        errorRetrievingData("error-volcanoes");
        return;
      }

      // $("#loading-message-text").html(`volcanoes`);
      return $.ajax({
        url: "libs/php/api-volcanoes.php",
        type: "POST",
        dataType: "json",
        data: {
          countryname: countryName,
        },
        success: function (result) {
          progressBar(8, "volcanoes");
          console.log({ volcanoes: result });
          infoStore.volcanoes = result.data;
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
          progressBar(8, "volcanoes");
          fatalError();
        },
      });
    }

    function apiUnsplashCall(countryName) {
      console.log("***apiUnsplashCall***");
      console.log({ countryName: countryName });
      if (!countryName) {
        errorRetrievingData("country-images");
        return;
      }
      // $("#loading-message-text").html(`country images`);
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
            errorRetrievingData("country-images");
            return;
          }
          // console.log(result);
          result.data.forEach((result) => {
            let obj = {};
            obj.url = result.urls.small;
            obj.description = result.description;
            obj.alt_description = result.alt_description;
            infoStore.countryImages.push(obj);
          });
          // console.log(infoStore.countryImages);
        },

        error: function (jqXHR, textStatus, errorThrown) {
          // console.log(jqXHR);
          // console.log(textStatus);
          // console.log(errorThrown);
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

    function fatalError() {
      const country = $("#select option:selected").text();
      $("#loading-message-text").html(
        `Data for ${country} not currently available!`
      );
      $("#progress-modal-footer").removeClass("display-none");
      $("#try-again").removeClass("display-none");
      $("#choose-another").removeClass("display-none");
      $("#loading-message")
        .removeClass("alert-primary")
        .addClass("alert-danger");
      // $("#retrieving-data-text").addClass("display-none");
    }

    //Error function - when API callfails error modal is enabled
    function errorRetrievingData(id) {
      $("#loading-message")
        .removeClass("alert-primary")
        .addClass("alert-danger");
      // $("#error-retrieving-messages").append(`<p>${message}</p>`);
      $(`#${id}`).removeClass("display-none");
      infoStore.errors = true;
    }

    function closeProgressModal() {
      if (infoStore.errors === false) {
        $("#progressModal").modal("hide");
        console.log(infoStore.errors);
      } else {
        $("#progress-modal-footer").removeClass("display-none");
        $("#close-progress-modal").removeClass("display-none");
        $("#loading-progress-bar-container").addClass("display-none");
        // $("#retrieving-data-text").addClass("display-none");
        $("#loading-message-text").html("");
        console.log(infoStore.errors);
      }
    }
  }
}

function resetProgressModal() {
  $("#loading-progress-bar-container").removeClass("display-none");
  $("#country-selected-text").removeClass("display-none");
  // $("#retrieving-data-text").removeClass("display-none");
  $("#progress-modal-footer").addClass("display-none");
  $("#try-again").addClass("display-none");
  $("#choose-another").addClass("display-none");
  $("#close-progress-modal").addClass("display-none");
  $("#loading-message").removeClass("alert-danger").addClass("alert-primary");
  //error messages:
  $("#error-country-details").addClass("display-none");
  $("#error-cities").addClass("display-none");
  $("#loading-progress-bar-container").removeClass("display-none");
  progressBarWidth = 0;
  progressBar(0, "reset to zero");
}

function clearHTML(data) {
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
  //ERRORS ON PROGRESS MODAL
  $("#error-geoJSON").addClass("display-none");
  $("#error-country-details").addClass("display-none");
  $("#error-cities").addClass("display-none");
  $("#error-wikipedia").addClass("display-none");
  $("#error-news").addClass("display-none");
  $("#error-current-weather").addClass("display-none");
  $("#error-weather-forecast").addClass("display-none");
  $("#error-volcanoes").addClass("display-none");
  $("#error-country-images").addClass("display-none");
}

function addToHTML(data) {
  // 1. create map layer for Leaflet bounding box
  const outline = L.geoJSON(data.geoJSON, {
    style: function (feature) {
      return { color: "rgba(15, 188, 249, 0.548)" };
    },
  }).addTo(featureGroup1);
  // 2. zoom to place on map
  // map.fitBounds(outline.getBounds(), {
  //   padding: [9, 9],
  // });
  //2. create bounding box co-ordinates
  const boundingBox = outline.getBounds();
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

  if (data.volcanoes) {
    data.volcanoes.forEach((volcano) => {
      console.log(volcano.properties);
      L.marker([volcano.properties.Latitude, volcano.properties.Longitude], {
        icon: volcanoIcon,
        riseOnHover: true,
      })
        .addTo(volcanoesMCG)
        .bindPopup(`${volcano.properties.Volcano_Name}<br>Volcano`);
    });
  }
  // wikipedia articles
  data.wikipediaArticles.forEach((story) => {
    $("#wiki-data").append(
      `<p class="lead">${story[0][0]}</p><p>${story[1][0]}</p>
    <p><a href=${story[2][0]} target="_blank">${story[2][0]}</a></p><hr/>`
    );
  });

  // news articles
  data.newsArticles.forEach((story) => {
    // console.log(story);
    $("#news-data").append(
      `<p class="lead">${story.title}</p><p class="font-italic">${readableDate(
        story.publishedAt
      )}</p><img class="news-image" src=${story.urlToImage}><p>${
        story.description
      }</p>
      <p><a href=${story.url} target="_blank">${story.url}</a></p><hr/>`
    );
  });

  // general info
  $(".api-country").html(data.countryName);
  $("#api-capital").html(data.capital);
  $("#api-population").html(fixPopulation(data.population));
  $("#api-currency").html(data.currencyName);
  $("#api-currency-symbol").html(` (${data.currencySymbol})`);
  $("#api-currency-symbol-for-exchange").html(data.currencySymbol);
  // $("#api-exchange-rate").html(data.exchangeRate.toFixed(2));
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
  // $("#api-date-time").html(data.localTime.replace("pm", ""));
  $("#api-date-time-units").html(data.localTime.slice(-2));
  //CURRENT WEATHER
  $("#current-weather-icon").attr(
    "src",
    `libs/imgs/${data.currentWeather.icon}@2x.png`
  );
  $("#current-weather-icon").attr("alt", data.currentWeather.description);
  $("#current-temp").html(data.currentWeather.temp);

  // FORECAST

  // console.log(infoStore.weather);
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
  if (data.countryImages !== []) {
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
        // console.log(result);
        // console.log(Array.isArray(result));
        result.forEach((country) => {
          console.log(country);
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
