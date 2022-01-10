const store = {
  locationString: "",
  country: "",
  currencyName: "",
  currencyISOCode: "",
  countryCodeISO2: "",
  countryCodeISO3: "",
  geonameId: "",
  capital: "",
  population: "",
  languages: "",
  lat: "",
  lon: "",
  symbol: "",
  exchangeRate: "",
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

  //get coordinates and data
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      //----------------declare variables-----------------------//
      // ---------------set coordinates-------------------------//
      store.lat = position.coords.latitude;
      store.lon = position.coords.longitude;
      getData(store.lat, store.lon);
    });
  }
});

//---------------------GET DATA FUNCTION------------------------------//
//--retrieves data, populates store and updates index.html------------//
const getData = (lat, lon) => {
  opencageCall(lat, lon)
    .then(() => geonamesCall(store.countryCodeISO2))
    .then(() => openExchangeRatesCall(store.currencyISOCode))
    .then(() => addToHTML())
    .then(() =>
      map.panTo([store.lat, store.lon], { animate: true, duration: 0.25 })
    )
    .then(() => {
      getGeoJSONData(store.countryCodeISO2);
    })
    .then(() => console.log(store));
};

//LEAFLET SETUP
const map = L.map("map").setView([200, 200], 14);
L.tileLayer(
  "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=I6Fjse9RiOJDIsWoxSx2",
  {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    minZoom: 5,
    maxZoom: 18,
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
      console.log(JSON.stringify(result));
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
// ----------------2. getting coordinates for geoJSON layer-----------//
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
            return { color: "rgba(60, 60, 112, 0.11)" };
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
  getGeoJSONData($("#select").val());
});

//-------------------API CALLS---------------------------------------------//
//-------------------call to opencage using geolocation lat/lon------------//
//-------------------retrieves user location: county, country, currency------------//

const opencageCall = (lat, lon) => {
  console.log("***opencageCall called***");
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
        setStore("country", result.data.results[0].components.country);
        setStore(
          "currencyName",
          result.data.results[0].annotations.currency.name
        );
        setStore(
          "currencyISOCode",
          result.data.results[0].annotations.currency.iso_code
        );
        setStore(
          "currencySymbol",
          result.data.results[0].annotations.currency.symbol
        );
        setStore(
          "countryCodeISO2",
          result.data.results[0].components["ISO_3166-1_alpha-2"]
        );
        setStore(
          "countryCodeISO3",
          result.data.results[0].components["ISO_3166-1_alpha-3"]
        );
        setStore("locationString", result.data.results[0].formatted);
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

//-----------------------geonames------------------//
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
        setStore("geonameId", result.data[0].geonameId);
        setStore("capital", result.data[0].capital);
        setStore("population", result.data[0].population);
        setStore("languages", result.data[0].languages);
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

//--------------------OPENEXCHANGERATES------------//
const openExchangeRatesCall = (currency) => {
  console.log("***openExchangeRatesCall***");
  return $.ajax({
    url: "libs/php/api-openexchangerates.php",
    type: "POST",
    dataType: "json",
    data: {},
    success: function (result) {
      // console.log(JSON.stringify(result));
      if (result.status.name == "ok") {
        const rates = Object.entries(result.data.rates);
        const rate = rates.filter((rate) => rate[0] === currency);
        setStore("exchangeRate", rate[0][1]);
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
  console.log("add to html fired");
  $("#api-location-string").html(store.locationString);
  $(".api-country").html(store.country);
  $("#api-capital").html(store.capital);
  $("#api-population").html(store.population);
  $("#api-currency").html(store.currencyName);
  $("#api-exchange-rate").html(
    `${store.currencySymbol}${store.exchangeRate.toFixed(2)}`
  );
};
