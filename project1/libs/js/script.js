$(window).on("load", function () {
  //preload handler
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("fast", function () {
        $(this).remove();
      });
  }
  //show hide control so it doesn't clash with the dropdown menu
  // $(".navbar-toggler").on("click", () => {
  //   $(".leaflet-control-layers").toggle();
  // });
  //run locationData on change
  $("#select").change(function () {
    locationData($("#select").val());
  });
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
        $("body").addClass("scroll-disable");
        $("#map").addClass("scroll-disable");
      },
      id: "myEasyButton",
    },
  ],
}).addTo(map);

//CALL FUNCTIONS
populateSelect();
locationData();

//-------------------------locationData()-------------------------------//

//GET USERS' LAT LON FROM DEVICE
//CALLS OPENCAGE WITH THIS INFORMATION
function locationData(selectedCountry) {
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
    continent: "",
    geonameId: "",
    languages: "",
    latitude: "",
    longitude: "",
    area: "",
    flag: "",
    cityDetails: [],
    countryImages: [],
  };

  if (!selectedCountry) {
    //Call functions
    getUserLocation()
      .then((position) =>
        opencageCall(position.coords.latitude, position.coords.longitude)
      )
      .catch((error) => logError(error))
      .then(() => getData(infoStore.twoLetterCountryCode))
      .then(() => setSelected())
      .catch((error) => console.log(error));
  } else {
    //destroy featureGroup
    //call getData with userLocation (two letter country code)
    console.log();
    getData(selectedCountry);
  }

  //setSelected
  function setSelected() {
    $(`#select option[value=${infoStore.twoLetterCountryCode}]`).prop(
      "selected",
      true
    );
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
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("Unable User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
  }

  //success callback
  //on success sets infoStore.twoLetterCountryCode
  function opencageCall(lat, lon) {
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
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }

  //------------------getData()-------------------------------------//
  //------------------declared inside locationData()----------------//
  //------------------has access to infoStore-----------------------//

  function getData(countryCodeISO2) {
    console.log("***getData call***");
    console.log(countryCodeISO2); // check country code received

    //remove previous layers
    featureGroup1.eachLayer((layer) => layer.clearLayers());
    $("#wiki-data").empty();
    $("#info-image-div").empty();
    if (!infoStore.geojsonCountryOutline === "") {
      infoStore.geojsonCountryOutline.remove();
    }

    //call functions
    getGeoJSONData(countryCodeISO2)
      .then(() => geonamesCall(countryCodeISO2))
      .then(() => geonamesCitiesCall(infoStore.boundingBox, countryCodeISO2))
      .then(() => geonamesEarthquakesCall(infoStore.boundingBox))
      .then(() => restCountriesCall(infoStore.threeLetterCountryCode))
      .then(() => geonamesWikiCall())
      .then(() => apiNewsCall())
      .then(() => apiVolcanoesCall())
      .then(() => apiUnsplashCall())
      .then(() => addToHTML());

    function getGeoJSONData(countryCodeISO2) {
      console.log("***getGeonJSONData*** was called");
      console.log({ countryCode: countryCodeISO2 });
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
            // console.log({ boundingBox: infoStore.boundingBox });
          }
        },

        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    function geonamesCall(countryCodeISO2) {
      console.log("***geonamesCall***");
      // console.log({ "geonames input cc": countryCodeISO2 });
      return $.ajax({
        url: "libs/php/api-geonames.php",
        type: "POST",
        dataType: "json",
        data: {
          countryCodeISO2: countryCodeISO2,
        },
        success: function (result) {
          // console.log(result.data);
          if (result.status.name == "ok") {
            //country name
            infoStore.countryName = result.data[0].countryName;
            //capital city
            infoStore.capital = result.data[0].capital;
            //population
            infoStore.population = result.data[0].population;
            //currency name
            infoStore.currencyISO3Code = result.data[0].currencyCode;
            //country code ISO3
            infoStore.threeLetterCountryCode = result.data[0].isoAlpha3;
            //continent
            infoStore.continent = result.data[0].continent;
            //geonameId
            infoStore.geonameId = result.data[0].geonameId;
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // error code
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    function geonamesCitiesCall(boundingBox, countryCodeISO2) {
      console.log("***geonamesCitiesCall*** was called");
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
            console.log(city);
            if (city.countrycode === countryCodeISO2) {
              if (city.toponymName !== infoStore.capital) {
                infoStore.cityDetails.push({
                  toponymName: city.toponymName,
                  lat: city.lat,
                  lng: city.lng,
                });
                L.marker([city.lat, city.lng], {
                  icon: cityIcon,
                  riseOnHover: true,
                })
                  .addTo(citiesMCG)
                  .bindPopup(
                    `${city.name}<br>Population: ${fixPopulation(
                      city.population
                    )}`
                  );
              } else {
                infoStore.cityDetails.push({
                  toponymName: city.toponymName,
                  lat: city.lat,
                  lng: city.lng,
                });
                L.marker([city.lat, city.lng], {
                  icon: capitalCityIcon,
                  riseOnHover: true,
                })
                  .addTo(capitalMCG)
                  .bindPopup(
                    `${city.name}<br class="pop-up-title">${
                      infoStore.countryName
                    } capital<br>Population: ${fixPopulation(city.population)}`
                  )
                  .openPopup();
              }
            }
          });
          console.log(infoStore.cityDetails);
        },

        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    function geonamesEarthquakesCall() {
      console.log("***geonamesEarthquakesCall*** was called");
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
                `Earthquake<br> ${date}<br>Magnitude: ${earthquake.magnitude}`
              );
          });
        },

        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    function restCountriesCall(countryCodeISO3) {
      console.log("***restCountriesCall***");
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
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // error code
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    function geonamesWikiCall() {
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
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    function apiNewsCall() {
      console.log("***apiNewsCall***");
      console.log(infoStore.countryName);
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
              `<p class="lead">${story.title}</p><p>${story.description}</p>
               <p><a href=${story.url} target="_blank">${story.url}</a></p><hr/>`
            );
          });
        },

        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    function apiVolcanoesCall() {
      console.log("***apiVolcanoesCall***");
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
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    function apiUnsplashCall() {
      console.log("***apiUnsplashCall***");
      return $.ajax({
        url: "libs/php/api-unsplash.php",
        type: "POST",
        dataType: "json",
        data: {
          countryname: infoStore.countryName,
        },
        success: function (result) {
          infoStore.countryImages.push(result.data);
          console.log(infoStore.countryImages[0]);
        },

        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    function addToHTML() {
      $(".api-country").html(infoStore.countryName);
      $("#api-capital").html(infoStore.capital);
      $("#api-population").html(fixPopulation(infoStore.population));
      $("#api-currency").html(infoStore.currencyName);
      $("#api-continent").html(infoStore.continent);
      $("#api-languages").html(infoStore.languages);
      $("#api-latitude").html(infoStore.latitude);
      $("#api-longitude").html(infoStore.longitude);
      $("#api-area").html(infoStore.area);
      $(".api-flag").attr("src", infoStore.flag);
      $(".nav-flag-div").css("background-image", `url(${infoStore.flag})`);
      $("#info-image-div").append(
        `<img id='country-image' src=${infoStore.countryImages[0]}/>`
      );
    }
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
