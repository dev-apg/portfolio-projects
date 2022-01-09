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
    .then(() => console.log(store))
    .then(() => addToHTML())
    .then(() =>
      map.panTo([store.lat, store.lon], { animate: true, duration: 0.25 })
    )
    .then(() => youAreHere(store.lat, store.lon));
};

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

const getGeoJSONData = () => {
  $.ajax({
    url: "libs/php/countryBorders-geoJSON.php",
    type: "GET",
    dataType: "json",
    data: { countryCode: "CR" },
    success: function (result) {
      console.log(JSON.stringify(result));
      if (result) {
        console.log("you're going to do it ");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

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
  $("#api-country").html(store.country);
  $("#api-capital").html(store.capital);
  $("#api-population").html(store.population);
  $("#api-currency").html(store.currencyName);
  $("#api-exchange-rate").html(
    `${store.currencySymbol}${store.exchangeRate.toFixed(2)}`
  );
};

//LEAFLET
const map = L.map("map").setView([0, 0], 14);
L.tileLayer(
  "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=I6Fjse9RiOJDIsWoxSx2",
  {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    minZoom: 5,
    maxZoom: 18,
  }
).addTo(map);

const marker = L.marker([51.5, -0.09]).addTo(map);

function youAreHere(lat, lon) {
  const circle = L.circle([lat, lon], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 200,
  }).addTo(map);
  circle.bindPopup("Your location");
}

const polygon = L.polygon([
  [-5.661948614921897, 54.55460317648385],
  [-6.197884894220977, 53.86756500916334],
  [-6.953730231137996, 54.073702297575636],
  [-7.572167934591079, 54.05995636658599],
  [-7.366030646178785, 54.595840969452695],
  [-7.572167934591079, 55.1316222194549],
  [-6.733847011736145, 55.1728600124238],
  [-5.661948614921897, 54.55460317648385],
]).addTo(map);

//markers
//openPopup method only works for markers
marker.bindPopup("<b>Hey there</b><br>I am a marker.").openPopup();

// polygon.bindPopup("I am a polygon");
