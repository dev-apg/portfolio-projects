//-----------------store---------------------//

let store = {
  // locationString: "",
  // country: "",
  // currencyName: "",
  currencyISO3Code: "",
  countryCodeISO2: "",
  countryCodeISO3: "",
  geonameId: "",
  capital: "",
  // population: "",
  // languages: "",
  // lat: "",
  // lon: "",
  // symbol: "",
  // exchangeRate: "",
  geojsonMapLayer: "",
  citiesLayer: "",
  geojsonData: "",
  boundingBox: [],
};

function setStore(name, value) {
  store[name] = value;
  console.log(`Added to store - ${name}: ${value}`);
}

//-----------------------------script runs on load-----------------------//
$(window).on("load", function () {
  //preload handler
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("fast", function () {
        $(this).remove();
      });
  }

  //populate select
  populateSelect();

  //getcoordinates and data
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(function (position) {
  //----------------declare variables-----------------------//
  // ---------------set coordinates-------------------------//
  // store.lat = position.coords.latitude;
  // store.lon = position.coords.longitude;
  store.lat = 51.5;
  store.lon = 0.1;
  opencageCall(store.lat, store.lon).then(() => getData(store.countryCodeISO2));
  // });
  // }
});

//---------------------GET DATA FUNCTION------------------------------//
//--retrieves data, populates store and updates index.html------------//
const getData = (countryCodeISO2) => {
  emptyStore();
  geonamesCall(countryCodeISO2)
    .then(() => openExchangeRatesCall(store.currencyISO3Code))
    .then(() => getGeoJSONData(countryCodeISO2))
    .then(() => restCountriesCall(store.countryCodeISO3))
    .then(() => geonamesCitiesCall(store.boundingBox))
    .then(() => geonamesEarthquakesCall(store.boundingBox))
    .then(() => (document.querySelector("#select").value = countryCodeISO2));
};

//-----------------empty store function------------------------------//

const emptyStore = () => {
  if (store.geojsonMapLayer !== "") {
    store.geojsonMapLayer.remove();
    store.citiesLayer.remove();
    store = {};
  }
};

//LEAFLET SETUP
const map = L.map("map").setView([200, 200], 14);
L.tileLayer(
  "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=I6Fjse9RiOJDIsWoxSx2",
  {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    // minZoom: 3,
    // maxZoom: 1,
  }
).addTo(map);

//add layer to add markers to

//--------COUNTRYBORDERS.GEO.JSON FILE---------------//
//-------1. populating select tag country options------//

const populateSelect = (countryCodeISO3) => {
  return $.ajax({
    url: "libs/php/countryBorders-names.php",
    type: "GET",
    dataType: "json",
    data: { countryCodeISO3: countryCodeISO3 },
    success: function (result) {
      // console.log(JSON.stringify(result));
      if (result) {
        result.forEach((country) => {
          $("#select").append(
            $("<option>", { value: [country[1]], text: [country[0]] })
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
};

// ------------2. getting geoJSON coordinates for selected country -----------//
//DONT THINK THIS IS NECESSARY ANY MORE
let geojson = {};

const getGeoJSONData = (countryCode) => {
  console.log("***getGeonJSONData*** was called");
  return $.ajax({
    url: "libs/php/countryBorders-geoJSON.php",
    type: "GET",
    dataType: "json",
    data: { countryCode: countryCode },
    success: function (result) {
      console.log(JSON.stringify(result));
      if (result) {
        // 1. create map layer for Leaflet bounding box
        setStore("geojsonMapLayer", result);
        store.geojsonMapLayer = L.geoJSON(result, {
          style: function (feature) {
            // return { color: "rgba(60, 60, 112, 0.11)" };
          },
        }).addTo(map);
        map.fitBounds(store.geojsonMapLayer.getBounds(), {
          padding: [18, 18],
        });
        // create bounding box co-ordinates
        const boundingBox = getBBox(result);
        setStore("boundingBox", boundingBox);
        console.log({ boundingboxresult: store.boundingBox });
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

//Called on change country select
$("#select").change(function () {
  getData($("#select").val());
});

//-------------------API CALLS---------------------------------------------//

//-----------0-opencage using geolocation lat/lon-------------------------//
//--------retrieves ISO2 country to add to store and use in getData-------//
//------------------runs on start-----------------------------------------//
const opencageCall = (lat, lon) => {
  console.log("***opencageCall***");
  return $.ajax({
    url: "libs/php/api-opencage.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: lat,
      lon: lon,
    },
    success: function (result) {
      // console.log(JSON.stringify(result));
      if (result.status.name == "ok") {
        setStore(
          "countryCodeISO2",
          result.data.results[0].components["ISO_3166-1_alpha-2"]
        );
        return result;
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

//----------------------1-geonames------------------//
//-------------POST: country code------------------//
//-------------GET: ------------------------------//
const geonamesCall = (countryCodeISO2) => {
  console.log("***geonamesCall***");
  return $.ajax({
    url: "libs/php/api-geonames.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCodeISO2: countryCodeISO2,
    },
    success: function (result) {
      // console.log(JSON.stringify(result));
      if (result.status.name == "ok") {
        //country name
        $(".api-country").html(result.data[0].countryName);
        //capital city
        $("#api-capital").html(result.data[0].capital);
        //population
        $("#api-population").html(result.data[0].population);
        //currency name - add to store and html
        setStore("currencyISO3Code", result.data[0].currencyCode);
        $("#api-currency").html(result.data[0].currencyCode);
        //languages
        // $("#api-languages").html(result.data[0].languages);
        //country code ISO3
        setStore("countryCodeISO3", result.data[0].isoAlpha3);
        //country code ISO2
        setStore("countryCodeISO2", result.data[0].countryCode);
        //continent
        $("#api-continent").html(result.data[0].continent);
        //geonameId
        setStore("geonameId", result.data[0].geonameId);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // error code
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

//--------------OPENEXCHANGERATES------------//
const openExchangeRatesCall = (currency) => {
  console.log("***openExchangeRatesCall***");
  return $.ajax({
    url: "libs/php/api-openexchangerates.php",
    type: "GET",
    dataType: "json",
    data: {},
    success: function (result) {
      // console.log({ currencyinOpenExchangeRates: currency });
      // console.log(JSON.stringify(result));
      if (result.status.name == "ok") {
        const rates = Object.entries(result.data.rates);
        const rate = rates.filter((rate) => rate[0] === currency);
        // setStore("exchangeRate", rate[0][1]);
        // console.log({ rate: rate[0][1] });
        $("#api-exchange-rate").html(rate[0][1].toFixed(2));
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // error code
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};
//------------------REST COUNTRIES---------------//
const restCountriesCall = (countryCodeISO3) => {
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
        // console.log(result.data.capital);
        setStore("capital", result.data.capital);
        $("#api-languages").html(result.data.languages[0].name);
        $("#api-latitude").html(result.data.latlng[0]);
        $("#api-longitude").html(result.data.latlng[1]);
        $("#api-area").html(result.data.area);
        $(".api-flag").attr("src", result.data.flags.png);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // error code
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

//----------------GEONAMES CITIES----------------//

const geonamesCitiesCall = (boundingBox) => {
  console.log("***geonamesCitiesCall*** was called");
  // console.log({ boundingboxfromCities: store.boundingBox });
  return $.ajax({
    url: "libs/php/api-geonames-cities.php",
    type: "POST",
    dataType: "json",
    data: {
      north: boundingBox[3],
      south: boundingBox[1],
      east: boundingBox[2],
      west: boundingBox[0],
    },
    success: function (result) {
      // console.log(JSON.stringify(result));

      console.log(result.data[0]);

      result.data.forEach((city) => {
        console.log(city);
        if (
          city.countrycode === store.countryCodeISO2 &&
          city.population > 100000
        ) {
          if (city.name !== store.capital) {
            L.marker([city.lat, city.lng])
              .addTo(map)
              .bindPopup(
                `${city.name}<br>Population: ${fixPopulation(city.population)}`
              );
          } else {
            L.marker([city.lat, city.lng])
              .addTo(map)
              .bindPopup(
                `${city.name}<br>${
                  store.countryCodeISO3
                } capital<br>Population: ${fixPopulation(city.population)}`
              )
              .openPopup();
          }
        }
      });
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

//----------------GEONAMES EARTHQUAKES----------------//

const geonamesEarthquakesCall = (boundingBox) => {
  console.log("***geonamesEarthquakesCall*** was called");
  // console.log({ boundingboxfromCities: store.boundingBox });
  return $.ajax({
    url: "libs/php/api-geonames-earthquakes.php",
    type: "POST",
    dataType: "json",
    data: {
      north: boundingBox[3],
      south: boundingBox[1],
      east: boundingBox[2],
      west: boundingBox[0],
    },
    success: function (result) {
      // console.log(JSON.stringify(result));
      console.log(result.data);

      result.data.forEach((earthquake) => {
        // console.log(earthquake);

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

        L.marker([earthquake.lat, earthquake.lng], { color: "#f8b02b" })
          .addTo(map)
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
};

//---------------ADD DATA TO DOM-----------//

const addToHTML = () => {
  // console.log("add to html fired");
  // $("#api-location-string").html(store.locationString);
  // $(".api-country").html(store.country);
  // $("#api-capital").html(store.capital);
  // $("#api-population").html(store.population);
  // $("#api-currency").html(store.currencyName);
  // $("#api-exchange-rate").html(
  //   `${store.currencySymbol}${store.exchangeRate.toFixed(2)}`
  // );
};

//--------------various helper functions-------------//
//------extracting bounding box from geoJSON---------//

function getBBox(gj) {
  var coords, bbox;
  if (!gj.hasOwnProperty("type")) return;
  coords = getCoordinatesDump(gj);
  bbox = [
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ];
  return coords.reduce(function (prev, coord) {
    return [
      Math.min(coord[0], prev[0]),
      Math.min(coord[1], prev[1]),
      Math.max(coord[0], prev[2]),
      Math.max(coord[1], prev[3]),
    ];
  }, bbox);
}

function getCoordinatesDump(gj) {
  var coords;
  if (gj.type == "Point") {
    coords = [gj.coordinates];
  } else if (gj.type == "LineString" || gj.type == "MultiPoint") {
    coords = gj.coordinates;
  } else if (gj.type == "Polygon" || gj.type == "MultiLineString") {
    coords = gj.coordinates.reduce(function (dump, part) {
      return dump.concat(part);
    }, []);
  } else if (gj.type == "MultiPolygon") {
    coords = gj.coordinates.reduce(function (dump, poly) {
      return dump.concat(
        poly.reduce(function (points, part) {
          return points.concat(part);
        }, [])
      );
    }, []);
  } else if (gj.type == "Feature") {
    coords = getCoordinatesDump(gj.geometry);
  } else if (gj.type == "GeometryCollection") {
    coords = gj.geometries.reduce(function (dump, g) {
      return dump.concat(getCoordinatesDump(g));
    }, []);
  } else if (gj.type == "FeatureCollection") {
    coords = gj.features.reduce(function (dump, f) {
      return dump.concat(getCoordinatesDump(f));
    }, []);
  }
  return coords;
}

function fixPopulation(num) {
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
