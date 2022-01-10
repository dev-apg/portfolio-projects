const store = {
  // locationString: "",
  // country: "",
  // currencyName: "",
  currencyISO3Code: "",
  countryCodeISO2: "",
  countryCodeISO3: "",
  geonameId: "",
  // capital: "",
  // population: "",
  // languages: "",
  // lat: "",
  // lon: "",
  // symbol: "",
  // exchangeRate: "",
  geojson: "",
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
  geonamesCall(countryCodeISO2)
    .then(() => openExchangeRatesCall(store.currencyISO3Code))
    .then(() => addToHTML())
    .then(() => console.log(store))
    .then(() => {
      getGeoJSONData(countryCodeISO2);
    });
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

//--------COUNTRYBORDERS.GEO.JSON FILE---------------//
//-------1. populating select tag country options------//

const populateSelect = () => {
  $.ajax({
    url: "libs/php/countryBorders-names.php",
    type: "GET",
    dataType: "json",
    data: {},
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

// ------------2. getting coordinates for Leaflet.js geoJSON layer-----------//
let geojson = {};

const getGeoJSONData = (countryCode) => {
  console.log("***getGeonJSONData*** was called");
  $.ajax({
    url: "libs/php/countryBorders-geoJSON.php",
    type: "GET",
    dataType: "json",
    data: { countryCode: countryCode },
    success: function (result) {
      // console.log(JSON.stringify(result));
      if (result) {
        if (store.geojson !== "") {
          store.geojson.remove();
        }
        setStore("geojson", result);
        store.geojson = L.geoJSON(result, {
          style: function (feature) {
            // return { color: "rgba(60, 60, 112, 0.11)" };
          },
        }).addTo(map);

        map.fitBounds(store.geojson.getBounds(), {
          padding: [18, 18],
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
      console.log(JSON.stringify(result));
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
        $("#api-languages").html(result.data[0].languages);
        //country code ISO3
        setStore("countryCodeISO3", result.data[0].isoAlpha3);
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
    type: "POST",
    dataType: "json",
    data: {},
    success: function (result) {
      console.log({ currencyinOpenExchangeRates: currency });
      // console.log(JSON.stringify(result));
      if (result.status.name == "ok") {
        const rates = Object.entries(result.data.rates);
        const rate = rates.filter((rate) => rate[0] === currency);
        // setStore("exchangeRate", rate[0][1]);
        console.log({ rate: rate[0][1] });
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
