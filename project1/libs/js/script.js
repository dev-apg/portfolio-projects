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
  progressModal_start();
});

//----------------------SET UP MAP

const map = L.map("map", {
  center: [50.8476, 4.3572],
  zoom: 4,
  // zoomControl: false,
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

let cameraIcon = L.icon({
  iconUrl: "libs/css/images/camera.png",
  iconSize: [38, 45],
});

//---------------------MAP LAYERS

const featureGroup1 = L.featureGroup().addTo(map);

const citiesMCG = L.markerClusterGroup();
const earthquakesMCG = L.markerClusterGroup();
const volcanoesMCG = L.markerClusterGroup();
const capitalMCG = L.markerClusterGroup();
const camerasMCG = L.markerClusterGroup();

citiesMCG.addTo(featureGroup1);
earthquakesMCG.addTo(featureGroup1);
volcanoesMCG.addTo(featureGroup1);
capitalMCG.addTo(featureGroup1);
camerasMCG.addTo(featureGroup1);

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
  cameras: camerasMCG,
};

//-------------------MAP CONTROLS/BUTTONS

// -----------------------------------------

// Create additional Control placeholders
function addControlPlaceholders(map) {
  var corners = map._controlCorners,
    l = "leaflet-",
    container = map._controlContainer;

  function createCorner(vSide, hSide) {
    var className = l + vSide + " " + l + hSide;
    corners[vSide + hSide] = L.DomUtil.create("div", className, container);
  }

  createCorner("verticalcenter", "left");
  createCorner("verticalcenter", "right");
}
addControlPlaceholders(map);

L.control
  .layers(baseLayers, overlays, {
    collapsed: true,
    position: "topright",
  })
  .addTo(map);

// Change the position of the Zoom Control to a newly created placeholder.
map.zoomControl.setPosition("verticalcenterright");

// You can also put other controls in the same placeholder.
// L.control.scale({ position: "verticalcenterright" }).addTo(map);

// --------------------------------------------------------

const generalInfoButton = L.easyButton({
  states: [
    {
      icon: "<span class='fas fa-info'></span>",
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

const weatherButton = L.easyButton({
  states: [
    {
      icon: "<span class='fa-solid fa-cloud-sun'></span>",
      onClick: function () {
        $("#weatherModal24hr").modal("show");
      },
      id: "weather-easybutton",
    },
  ],
}).addTo(map);

const datesButton = L.easyButton({
  states: [
    {
      icon: "<span class='fa-solid fa-calendar-days'></span>",
      onClick: function () {
        $("#datesModal").modal("show");
      },
      id: "dates-easybutton",
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

const covidButton = L.easyButton({
  states: [
    {
      icon: "<span class='fa-solid fa-virus'></span>",
      onClick: function () {
        $("#covidModal").modal("show");
      },
      id: "dates-easybutton",
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

//-------------------MAP FUNCTIONS

function flyToPin(e) {
  map.flyTo([e.target._latlng.lat, e.target._latlng.lng], 12, [2, 2]);
  (function openPopupOnZoomLevel12() {
    setTimeout(function () {
      if (map.getZoom() === 12) {
        e.target.openPopup();
      } else {
        openPopupOnZoomLevel12();
      }
    }, 750);
  })();
}

//---------------------NAV BAR BUTTONS/SELECT--------------

$("#select").change(function (e) {
  const select = e.target;
  const countryCodeISO2 = select.value;
  prvsSelected_CountryCodeISO2 = select.value;
  const countryName = select.item(select.selectedIndex).textContent;

  ll.getData(countryCodeISO2, countryName);
});

$(".nav-flag-div").on("click", function () {
  const select = document.getElementById("select");
  const countryCodeISO2 = select.value;
  const countryName = select.item(select.selectedIndex).textContent;
  ll.getData(countryCodeISO2, countryName);
});

//launch "about" modal
$("#globe-icon").on("click", function () {
  $("#aboutModal").modal("show");
});

$("#logo").on("click", function () {
  $("#aboutModal").modal("show");
});

//--------------------------Progress Modal -------------------------//

let countriesArr = [];
let selected_CountryCodeISO2 = null;
let selected_CountryName = null;
let dataMissing = false;
let errors = [];
let continueAnimation = true;

function progressModal_start() {
  const modal = document.querySelector('[data-modal="progress"]');
  const children = modal.children;
  if (children) {
    Array.from(children).forEach((child) => {
      child.remove();
    });
  }

  const welcomeDiv = document.createElement("div");
  welcomeDiv.id = "welcome-div";

  const welcomeMessage = document.createElement("h3");

  welcomeMessage.textContent = "Welcome to Gazatteer";
  welcomeMessage.id = "welcome-message";
  welcomeMessage.classList = "text-center mb-4";

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList = "d-grid gap-3";

  const getLocationBtn = document.createElement("button");
  getLocationBtn.id = "get-location-btn";
  getLocationBtn.textContent = "Get user location";
  getLocationBtn.classList = "btn btn-primary";
  getLocationBtn.type = "button";
  getLocationBtn.addEventListener("click", function () {
    getUserLocation();
  });

  const select = document.createElement("select");
  select.id = "select-start";
  select.classList = "form-select select-country-options text-center";
  const firstOption = document.createElement("option");
  firstOption.textContent = "Choose a country";
  select.append(firstOption);

  countriesArr.forEach((country) => {
    const option = document.createElement("option");
    option.textContent = country[0];
    option.value = country[1];
    select.append(option);
  });

  select.addEventListener("change", function (e) {
    const select = e.target;
    const countryCodeISO2 = select.value;
    prvsSelected_CountryCodeISO2 = select.value;
    const countryName = select.item(select.selectedIndex).textContent;
    ll.getData(countryCodeISO2, countryName);
  });

  modal.append(welcomeDiv, buttonsContainer);
  buttonsContainer.append(getLocationBtn, select);
  welcomeDiv.append(welcomeMessage);
  progressModal.show();
}

function progressModal_gettingData(data) {
  const modal = document.querySelector('[data-modal="progress"]');
  continueAnimation = true;
  const children = modal.children;
  if (children) {
    Array.from(children).forEach((child) => {
      child.remove();
    });
  }

  const messageDiv = document.createElement("div");
  messageDiv.id = "loading-message-div";

  const progressBarContainer = document.createElement("div");
  progressBarContainer.classList = "progress";
  progressBarContainer.id = "loading-progress-bar-container";

  const progressBar = document.createElement("div");
  progressBar.id = "progress-bar";
  progressBar.classList = "progress-bar-striped progress-bar-animated bg-dark";

  const loadingMessage = document.createElement("h3");
  loadingMessage.id = "loading-message";
  const messageTextArr = ["With you shortly...", "Comin' up!", "One second..."];
  const messageText =
    messageTextArr[Math.floor(Math.random() * messageTextArr.length)];
  loadingMessage.innerHTML = messageText;

  const footprints = document.createElement("p");
  footprints.classList = "text-center d-flex justify-content-evenly";
  footprints.id = "footprints";

  for (let i = 0; i < 7; i++) {
    const span = document.createElement("span");
    span.classList = "mx-1 fa-solid fa-shoe-prints";
    footprints.append(span);
  }

  const para = document.createElement("p");
  para.id = "retrieving-data-for";
  !data.countryName
    ? (para.innerText = `Retrieving data for your location`)
    : (para.innerText = `Retrieving data for ${data.countryName}`);

  modal.append(messageDiv, progressBarContainer);
  messageDiv.append(footprints, loadingMessage, para);
  progressBarContainer.append(progressBar);
  progressModal.show();
}

//---------------ProgressModal Errors

function progressModal_userLocationFailed() {
  const modal = document.querySelector('[data-modal="progress"]');

  //add alert
  const welcomeDiv = document.getElementById("welcome-div");
  const getLocationBtn = document.getElementById("get-location-btn");
  const alertDiv = document.createElement("div");
  alertDiv.classList = "alert alert-primary";
  const text = document.createElement("p");
  text.textContent = "Unable to access your location - please choose a country";
  alertDiv.append(text);
  //make button disabled
  getLocationBtn.classList.add("disabled");
  welcomeDiv.append(alertDiv);
}

function progressModal_someDataMissing() {
  const modal = document.querySelector('[data-modal="progress"]');
  const children = modal.children;
  if (children) {
    Array.from(children).forEach((child) => {
      child.remove();
    });
  }
  const messageDiv = document.createElement("div");
  messageDiv.classList = "alert alert-primary";
  const text = document.createElement("p");
  text.textContent = "Some data missing:";

  const list = document.createElement("ul");

  errors.forEach((error) => {
    const li = document.createElement("li");
    li.textContent = error;
    list.append(li);
  });

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList = "d-grid gap-3";

  const closeModalBtn = document.createElement("button");
  closeModalBtn.id = "get-location-btn";
  closeModalBtn.textContent = "Ok";
  closeModalBtn.classList = "btn btn-primary";
  closeModalBtn.type = "button";
  closeModalBtn.setAttribute("data-bs-dismiss", "modal");

  modal.append(messageDiv, buttonsContainer);
  messageDiv.append(text, list);
  buttonsContainer.append(closeModalBtn);
}

function progressModal_APIfailure(e) {
  console.log(e);
  progressModal.show();
  const modal = document.querySelector('[data-modal="progress"]');
  const children = modal.children;
  if (children) {
    Array.from(children).forEach((child) => {
      child.remove();
    });
  }

  const messageDiv = document.createElement("div");
  messageDiv.classList = "alert alert-danger";
  const text = document.createElement("p");
  text.textContent = "There was an error retrieving data";

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList = "d-grid gap-3";

  const tryAgainBtn = document.createElement("button");
  tryAgainBtn.id = "try-again-btn";
  tryAgainBtn.textContent = "Try again?";
  tryAgainBtn.classList = "btn btn-primary";
  tryAgainBtn.type = "button";
  tryAgainBtn.addEventListener("click", function () {
    ll.getData(selected_CountryCodeISO2, selected_CountryName);
  });

  const select = document.createElement("select");
  select.id = "select-start";
  select.classList = "form-select select-country-options text-center";
  const firstOption = document.createElement("option");
  firstOption.textContent = "Choose another country";
  select.append(firstOption);

  countriesArr.forEach((country) => {
    const option = document.createElement("option");
    option.textContent = country[0];
    option.value = country[1];
    select.append(option);
  });

  select.addEventListener("change", function (e) {
    const select = e.target;
    const countryCodeISO2 = select.value;
    prvsSelected_CountryCodeISO2 = select.value;
    const countryName = select.item(select.selectedIndex).textContent;
    ll.getData(countryCodeISO2, countryName);
  });

  modal.append(messageDiv, buttonsContainer);
  messageDiv.append(text);
  buttonsContainer.append(tryAgainBtn, select);
}

function modalFootprints() {
  const prints = document.querySelectorAll(".fa-shoe-prints");
  (function animateFootprints(prints) {
    prints.forEach((print) => {
      print.style.color = "white";
    });
    setTimeout(function () {
      prints[0].style.color = "black";
      prints[0].style.transform = "rotate(5deg)";
    }, 800);
    setTimeout(function () {
      prints[1].style.color = "black";
      prints[1].style.transform = "rotate(-5deg)";
    }, 1600);
    setTimeout(function () {
      prints[2].style.color = "black";
      prints[2].style.transform = "rotate(5deg)";
    }, 2400);
    setTimeout(function () {
      prints[3].style.color = "black";
      prints[3].style.transform = "rotate(-5deg)";
    }, 3200);
    setTimeout(function () {
      prints[4].style.color = "black";
      prints[4].style.transform = "rotate(-5deg)";
    }, 4800);
    setTimeout(function () {
      prints[5].style.color = "black";
      prints[5].style.transform = "rotate(-5deg)";
    }, 5600);
    setTimeout(function () {
      prints[6].style.color = "black";
      prints[6].style.transform = "rotate(-5deg)";
    }, 6400);
    setTimeout(function () {
      if (continueAnimation) {
        animateFootprints(prints);
        console.log("footprints continue");
      } else {
        console.log("footprints stop");
        prints.forEach((print) => {
          print.style.color = "white";
        });
      }
    }, 7400);
  })(prints, continueAnimation);
}

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

// ---------------------DATA NODE AND LINKED LIST-------//
// Node that contains country data for linked list
//DataNode - formerly CountryDataNode
class DataNode {
  constructor() {
    this.data = {};
    this.next = null;
    this.previous = null;
  }
}

//---------------------------------LINKED LIST------

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }

  getData(countryCodeISO2, countryName, lat, lng) {
    selected_CountryCodeISO2 = countryCodeISO2;
    selected_CountryName = countryName;

    //on first call create a head node
    if (!this.head) {
      let node = new DataNode();
      this.current = node;
      this.head = node;
      this.tail = node;
      this.current.data.lat = lat;
      this.current.data.lng = lng;
      this.current.data.countryCodeISO2 = countryCodeISO2;
      this.current.data.countryName = countryName;
      countryAPICalls(this.current.data);
      return;
    }

    let current = this.head;
    //if nodes exist, loop through to find a match
    while (current) {
      if (current.data.countryCodeISO2 === countryCodeISO2) {
        let node = new DataNode();
        node.next = current.next;
        node.previous = current.previous;
        this.current = node;
        this.current.data.countryCodeISO2 = countryCodeISO2;
        this.current.data.countryName = countryName;
        clearHTML(this.current.data);
        countryAPICalls(this.current.data);
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
    this.current.data.countryName = countryName;
    clearHTML(this.current.data);
    countryAPICalls(this.current.data);
  }

  forward() {
    if (!this.current.next) return;
    removeFocusFromSelect();
    clearHTML(this.current.data);
    this.current = this.current.next;
    this.next = this.current.next;
    this.previous = this.current.previous;
    updateHTML(this.current.data);
    setNavButtons();
    setSelected(this.current.data.countryCodeISO2);
  }
  backward() {
    if (!this.current.previous) return;
    removeFocusFromSelect();
    clearHTML(this.current.data);
    this.current = this.current.previous;
    this.next = this.current.next;
    this.previous = this.current.previous;
    updateHTML(this.current.data);
    setNavButtons();
    setSelected(this.current.data.countryCodeISO2);
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

function getUserLocation() {
  var options = {
    // enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  //on consent given
  function success(pos) {
    var crd = pos.coords;
    ll.getData(null, null, crd.latitude, crd.longitude);
  }

  //consent declined
  function error(err) {
    progressModal_userLocationFailed();
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  navigator.geolocation.getCurrentPosition(success, error, options);
}

//------------API CALLS FUNCTION
function countryAPICalls(data) {
  // data.countryCodeISO2 = "xxx";
  closeProgressModal = true;
  dataMissing = false;
  errors = [];
  progressModal_gettingData(data);
  modalFootprints();

  opencageCall(data)
    .then(() =>
      Promise.all([
        setSelected(data.countryCodeISO2),
        getGeoJSONData(data),
        geonamesCountryInfoCall(data),
        holidayAPICall(data),
        apiCovidTotalDeathsCall(data),
        apiCovidTotalConfirmedCall(data),
        apiWindyCall(data),
      ])
    )
    .then(() => restCountriesCall(data))
    .then(() => opencageCall(data))
    .then(() =>
      Promise.allSettled([
        apiVolcanoesCall(data),
        geonamesCitiesCall(data),
        //openExchangeRatesCall(data), // 1k starting from 6th of the month
        geonamesEarthquakesCall(data),
        geonamesWikiCall(data),
        apiOpenWeatherOneCall(data), // openweather 1M calls per month
        apiUnsplashCall(data),
        apiNewsCall(data),
        getDateTime(),
      ])
    )
    .then(() => console.log(data))
    .then(() => removeFocusFromSelect())
    .then(() => updateHTML(data))
    .then(() => setNavButtons())
    .then(() => (continueAnimation = false))
    .then(() =>
      dataMissing ? progressModal_someDataMissing() : progressModal.hide()
    )
    .catch((e) => {
      continueAnimation = false;
      progressModal_APIfailure(e);
    });
}

//------------------------API CALLS-----------------------//

async function opencageCall(data) {
  //don't run if lat/lng not set
  if (!data.lat && !data.lng && !data.latitude && !data.longitude) {
    // console.log("opencageCall - lat/lng not defined");
    // errors.push("general info");
    // dataMissing = true;
    // incLoadingBar(6.25);
    return;
  }
  //don't run if it's already ran
  if (data.offset_sec) return;
  const lat = data.latitude || data.lat;
  const lng = data.longitude || data.lng;
  return $.ajax({
    url: "libs/php/api-opencage.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: lat,
      lng: lng,
    },
    success: function (result) {
      incLoadingBar(6.25);
      if (result.data.results.length === 0) {
        errors.push("general information");
        dataMissing = true;
      }
      data.countryCodeISO2 =
        result.data.results[0].components["ISO_3166-1_alpha-2"];
      //time
      data.offset_string =
        result.data.results[0].annotations.timezone.offset_string;
      data.offset_sec = result.data.results[0].annotations.timezone.offset_sec;
      data.localTime = currentDayTime(ll.current.data.offset_sec);
      data.unix = Date.now();
      data.countryName = result.data.results[0].components.country;
      result.data.results[0].components.political_union
        ? (data.political_union =
            result.data.results[0].components.political_union)
        : null;
      result.data.results[0].components.county
        ? (data.county = result.data.results[0].components.county)
        : null;
      result.data.results[0].components.state_district
        ? (data.state_district =
            result.data.results[0].components.state_district)
        : null;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({ opencageCall: jqXHR, textStatus, errorThrown });
    },
  });
}

async function getGeoJSONData(data) {
  if (!data.countryCodeISO2) {
    console.log("country code not defined");
    errors.push("country outline");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/countryBorders-geoJSON.php",
    type: "GET",
    dataType: "json",
    data: { countryCodeISO2: data.countryCodeISO2 },
    success: function (result) {
      incLoadingBar(6.25);
      if (result.data.length === 0) {
        errors.push("country outline");
        dataMissing = true;
        return;
      }
      data.geoJSON = result.data;
      data.geojsonCountryOutline = L.geoJSON(result.data, {
        style: function (feature) {
          return { color: "rgba(15, 188, 249, 0.548)" };
        },
      });
      data.boundingBox = data.geojsonCountryOutline.getBounds();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({ getGeoJSONData: jqXHR, textStatus, errorThrown });
    },
  });
}

function geonamesCountryInfoCall(data) {
  if (!data.countryCodeISO2) {
    console.log("Geonames-countryInfo - ISO2 not defined");
    errors.push("country info");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/api-geonames-countryInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCodeISO2: data.countryCodeISO2,
    },
    success: function (result) {
      incLoadingBar(6.25);
      if (result.data.length === 0) {
        dataMissing = true;
        errors.push("country info");
        dataMissing = true;
        return;
      }
      data.countryName = result.data[0].countryName;
      data.capital = result.data[0].capital;
      data.population = result.data[0].population;
      data.currencyISO3Code = result.data[0].currencyCode;
      data.countryCodeISO3 = result.data[0].isoAlpha3;
      data.continent = result.data[0].continentName;
      data.geonameId = result.data[0].geonameId;
      //
      data.north = result.data[0].north;
      data.south = result.data[0].south;
      data.east = result.data[0].east;
      data.west = result.data[0].west;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({ geonamesCountryInfoCall: jqXHR, textStatus, errorThrown });
    },
  });
}

function holidayAPICall(data) {
  if (!data.countryCodeISO2) {
    console.log("holidayAPICall - ISO2 not defined");
    errors.push("dates");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/api-holidayapi.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCodeISO2: data.countryCodeISO2,
    },
    success: function (result) {
      incLoadingBar(6.25);
      data.dates = result.data;
      if (result.data.length === 0) {
        errors.push("dates");
        dataMissing = true;
        return;
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({ holidayAPICall: jqXHR, textStatus, errorThrown });
    },
  });
}

function restCountriesCall(data) {
  if (!data.countryCodeISO3) {
    console.log("restCountriesCall - ISO3 not defined");
    errors.push("general country information");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/api-restcountries.php",
    type: "POST",
    dataType: "json",
    data: { countryCodeISO3: data.countryCodeISO3 },
    success: function (result) {
      incLoadingBar(7);
      if (result.data.message === "Bad Request") {
        errors.push("general country information");
        dataMissing = true;
        return;
      }
      data.languages = result.data.languages[0].name;
      data.lat = result.data.latlng[0];
      data.lng = result.data.latlng[1];
      data.area = result.data.area;
      data.flag = result.data.flags.png;
      data.currencyName = result.data.currencies[0].name;
      data.currencySymbol = result.data.currencies[0].symbol;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log({ restCountriesCall: jqXHR, textStatus, errorThrown });
      incLoadingBar(6.25);
    },
  });
}

function apiVolcanoesCall(data) {
  if (!data.countryName) {
    console.log("apiVolcanoesCall - ISO2 not defined");
    errors.push("volcanoes");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/api-volcanoes.php",
    type: "POST",
    dataType: "json",
    data: {
      countryname: data.countryName,
    },
    success: function (result) {
      incLoadingBar(6.25);
      if (result.data.length === 0) {
        // errors.push("volcanoes");
        // dataMissing = true;
        return;
      }
      data.volcanoes = result.data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({ apiVolcanoesCall: jqXHR, textStatus, errorThrown });
    },
  });
}

function openExchangeRatesCall(data) {
  if (!data.countryCodeISO3) {
    console.log("openExchangeRatesCall - ISO2 not defined");
    errors.push("exchange rate");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/api-openexchangerates.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      incLoadingBar(6.25);
      if (Object.keys(result.data).length === 0) {
        errors.push("exchange rate");
        dataMissing = true;
        return;
      }
      data.exchangeRate = result.data[data.currencyISO3Code];
    },
    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({ openExchangeRatesCall: jqXHR, textStatus, errorThrown });
    },
  });
}

function geonamesCitiesCall(data) {
  if (!data.countryCodeISO2) {
    console.log("geonamesCitiesCall - ISO2 not defined");
    errors.push("cities");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/api-cachedCities.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCodeISO2: data.countryCodeISO2,
    },
    success: function (result) {
      incLoadingBar(6.25);
      if (result.data.length === 0) {
        errors.push("cities");
        dataMissing = true;
      }

      data.cities = result.data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({ geonamesCitiesCall: jqXHR, textStatus, errorThrown });
    },
  });
}

function geonamesEarthquakesCall(data) {
  if (!data.boundingBox) {
    console.log("geonamesEarthquakesCall - boundingBox not defined");
    errors.push("earthquakes");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/api-geonames-earthquakes.php",
    type: "POST",
    dataType: "json",
    data: {
      north: data.boundingBox._northEast.lat,
      south: data.boundingBox._southWest.lat,
      east: data.boundingBox._northEast.lng,
      west: data.boundingBox._southWest.lng,
    },
    success: function (result) {
      incLoadingBar(6.25);
      if (result.data === null) {
        errors.push("earthquakes");
        dataMissing = true;
        return;
      }
      data.earthquakes = result.data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({ geonamesEarthquakesCall: jqXHR, textStatus, errorThrown });
    },
  });
}

function geonamesWikiCall(data) {
  if (!data.boundingBox) {
    console.log("geonamesWikiCall - boundingBox not defined");
    errors.push("wikipedia articles");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/api-geonames-wikipedia.php",
    type: "POST",
    dataType: "json",
    data: {
      north: data.boundingBox._northEast.lat,
      south: data.boundingBox._southWest.lat,
      east: data.boundingBox._northEast.lng,
      west: data.boundingBox._southWest.lng,
    },
    success: function (result) {
      incLoadingBar(6.25);
      if (result.data.length === 0) {
        errors.push("wikipedia articles");
        dataMissing = true;
        return;
      }
      data.wikipediaArticles = result.data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({ geonamesWikiCall: jqXHR, textStatus, errorThrown });
    },
  });
}

async function apiOpenWeatherOneCall(data) {
  const lat = data.latitude || data.lat;
  const lng = data.longitude || data.lng;
  if (!lat || !lng) {
    console.log("apiOpenWeatherOneCall - lat/lng not defined");
    errors.push("weather");
    dataMissing = true;
    incLoadingBar(6.25);
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
      incLoadingBar(6.25);
      if (result.data.cod) {
        errors.push("weather");
        dataMissing = true;
        return;
      }
      data.weather = result.data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({ apiOpenWeatherOneCall: jqXHR, textStatus, errorThrown });
    },
  });
}

async function apiOpenweatherAirPollution(data) {
  const lat = data.latitude || data.lat;
  const lng = data.longitude || data.lng;
  if (!lat || !lng) {
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
      if (result.data.cod) {
        return;
      }
      data.airPollution = result.data.list[0].main.aqi;
    },

    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({
        apiOpenweatherAirPollution: jqXHR,
        textStatus,
        errorThrown,
      });
    },
  });
}

function apiUnsplashCall(data) {
  const countryName = data.countryName;
  if (!countryName) {
    console.log("apiUnsplashCall - ISO2 not defined");
    errors.push("dates");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/api-unsplash.php",
    type: "POST",
    dataType: "json",
    data: {
      countryname: data.countryName,
    },
    success: function (result) {
      incLoadingBar(6.25);
      if (result.data.length === 0) {
        errors.push("dates");
        dataMissing = true;
        return;
      }
      data.countryImages = [];
      result.data.forEach((result) => {
        let obj = {};
        obj.url = result.urls.small;
        obj.description = result.description;
        obj.alt_description = result.alt_description;
        data.countryImages.push(obj);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({ apiUnsplashCall: jqXHR, textStatus, errorThrown });
    },
  });
}

function apiCovidTotalDeathsCall(data) {
  if (!data.countryCodeISO2) {
    console.log("ISO2 not defined");
    console.log("apiCovidTotalDeathsCall - ISO2 not defined");
    errors.push("Covid information (confirmed deaths)");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/api-covidTotalDeaths.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCodeISO2: data.countryCodeISO2,
    },
    success: function (result) {
      incLoadingBar(6.25);
      if (result.data.message === "Not Found") {
        errors.push("Covid information (total deaths)");
        dataMissing = true;
        return;
      }
      data.covidTotalDeaths = result.data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({ apiCovidTotalDeathsCall: jqXHR, textStatus, errorThrown });
    },
  });
}

function apiCovidTotalConfirmedCall(data) {
  if (!data.countryCodeISO2) {
    console.log("ISO2 not defined");
    console.log("apiCovidTotalConfirmedCall - ISO2 not defined");
    errors.push("Covid information (confirmed cases)");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/api-covidTotalConfirmed.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCodeISO2: data.countryCodeISO2,
    },
    success: function (result) {
      incLoadingBar(6.25);
      if (result.data.message === "Not Found") {
        errors.push("Covid information (total cases)");
        dataMissing = true;
        return;
      }
      data.covidTotalConfirmed = result.data;
    },

    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({
        apiCovidTotalConfirmedCall: jqXHR,
        textStatus,
        errorThrown,
      });
    },
  });
}

function apiNewsCall(data) {
  if (!data.countryName) {
    console.log("apiNewsCall - country name not defined");
    errors.push("news articles");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/api-apinews.php",
    type: "POST",
    dataType: "json",
    data: {
      countryname: data.countryName,
    },
    success: function (result) {
      incLoadingBar(6.25);
      if (result.data.articles.length === 0) {
        errors.push("news articles");
        dataMissing = true;
      }
      data.newsArticles = result.data.articles;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({ apiNewsCall: jqXHR, textStatus, errorThrown });
    },
  });
}

function apiWindyCall(data) {
  if (!data.countryCodeISO2) {
    console.log("ISO2 not defined");
    console.log("apiWindyCall - ISO2 not defined");
    errors.push("webcams");
    dataMissing = true;
    incLoadingBar(6.25);
    return;
  }
  return $.ajax({
    url: "libs/php/api-windy.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCodeISO2: data.countryCodeISO2,
    },
    success: function (result) {
      incLoadingBar(6.25);
      if (result.data.result.webcams === 0) {
        errors.push("webcams");
        dataMissing = true;
        return;
      }
      data.cameras = result.data.result.webcams;
    },

    error: function (jqXHR, textStatus, errorThrown) {
      incLoadingBar(6.25);
      console.log({
        apiWindyCall: jqXHR,
        textStatus,
        errorThrown,
      });
    },
  });
}

function apiYelpCall(data) {
  if (!data.lat && !data.lng) {
    return;
  }
  return $.ajax({
    url: "libs/php/api-yelp.php",
    type: "GET",
    dataType: "json",
    data: {
      latitude: data.lat,
      longitude: data.lng,
    },
    success: function (result) {
      incLoadingBar(6.25);
      if (result.data.length === 0) {
        return;
      }
      data.yelp = result.data.businesses;
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log({ apiYelpCall: jqXHR, textStatus, errorThrown });
    },
  });
}

//----------------------------------UPDATE HTML--------------------------------------//

function updateHTML(data) {
  //recenter
  // ll.recenter();

  addGeoJSONOutline(data.geoJSON);

  addVolcanoes(data);

  //searchbar flag
  document.querySelector(
    ".nav-flag-div"
  ).style.backgroundImage = `url(${data.flag})`;

  //modals
  // ALL MODALS
  const modalFlags = document.querySelectorAll(".api-flag");
  modalFlags.forEach((flag) => (flag.src = data.flag));
  dataCapturedAtText(data);

  //GENERAL INFO TABLE
  addGeneralInfoData(data);

  //COUNTRY IMAGES CAROUSEL
  addCarouselImages(data);

  addCameras(data);

  // weather modal
  createCurrentForecast(data.weather, data.offset_sec);
  create48hrForecast(data.weather, data.offset_sec);
  create8DayForecast(data.weather, data.offset_sec);

  // dates modal
  createDatesTable(data.dates);
  createDateTypeCheckBoxes(data.dates);

  //covid modal
  //deaths
  createCovidDeathsTable(data);
  addCovidChart_deathsPerDay(data);
  addCovidChart_deathsPerYear(data);

  // cases
  createCovidCasesTable(data);
  addCovidChart_dailyInfections(data);

  //wikipedia modal
  addWikipediaArticles(data.wikipediaArticles);

  //news modal
  addNewsArticles(data.newsArticles);

  //earthquakes
  addEarthquakes(data);

  ll.recenter();

  // cities modal
  addCities(data);
}

function addEarthquakes(data) {
  if (!data.earthquakes) return;
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
        `<h6><strong>Earthquake</strong><br><strong>Date</strong> ${date}<br><strong>Magnitude</strong> ${earthquake.magnitude}</h6>`
      )
      .addEventListener("click", (e) => flyToPin(e));
  });
}

function addVolcanoes(data) {
  if (!data.volcanoes) return;
  const volcanoes = data.volcanoes;

  volcanoes.forEach((volcano) => {
    L.marker([volcano.properties.Latitude, volcano.properties.Longitude], {
      icon: volcanoIcon,
      riseOnHover: true,
    })
      .addTo(volcanoesMCG)
      .bindPopup(
        `<h6><strong>Volcano</strong><br>${volcano.properties.Volcano_Name}</h6>`
      )
      .addEventListener("click", (e) => flyToPin(e));
  });
}

function addGeneralInfoData(data) {
  const modal = document.querySelector('[data-modal="general-info"]');

  if (data.flag && data.countryName) {
    const flagContainer = document.createElement("div");
    flagContainer.classList = "container mt-2 mb-4";
    modal.appendChild(flagContainer);
    const flag = document.createElement("img");
    flag.classList = "mx-auto d-block img-fluid";
    flag.id = "country-flag";
    flag.src = data.flag;
    flag.alt = `Flag of ${data.countryName}`;
    flag.title = `Flag of ${data.countryName}`;
    flagContainer.appendChild(flag);
  }

  const table = document.createElement("table");
  modal.appendChild(table);
  table.classList = "table table-borderless blue-striped";
  table.id = "general-info-table";

  addLatLngRow("Latitude/Longitude", data.latitude, data.longitude, table);
  addAreaRow("Land Area", data.area.toLocaleString(), table);
  // addWeatherRow("Current Weather", data.weather.current.temp, data.weather.current.weather[0].icon, table);
  addRow("GMT offset", data.offset_string, table);
  addLocalTimeRow("Local date and Time", data.localTime, table);
  data.exchangeRate && addRow("$1 USD", data.exchangeRate.toFixed(2), table);
  addRowWithUnits(
    "Currency",
    data.currencyName,
    ` (${data.currencySymbol})`,
    table
  );

  data.political_union
    ? addRow("Politcal Union", data.political_union, table)
    : null;
  addRow("Continent", data.continent, table);
  addRow("Language", data.languages, table);
  addRow("Population", makeNumberReadable(data.population), table);
  addRow("Capital", data.capital, table);
  addRow("Country", data.countryName, table);
}

function addNewsArticles(newsArticles) {
  if (!newsArticles) return;
  const modal = document.querySelector('[data-modal="news"]');
  let floatClass = "float-start";
  let marginClass = "me-2";
  newsArticles.forEach((article) => {
    const container = document.createElement("div");
    container.classList = "container rounded pt-1 pb-1 mb-2 articles-container";
    modal.appendChild(container);
    const link = document.createElement("a");
    container.appendChild(link);
    link.href = article.url;
    link.target = "_blank";
    link.classList = "text-dark";
    const title = document.createElement("h5");
    title.textContent = article.title;
    link.appendChild(title);
    const dateContainer = document.createElement("p");
    dateContainer.classList = "fst-italic news-story-date";
    link.appendChild(dateContainer);
    dateContainer.textContent = readableDate(article.publishedAt);
    if (article.urlToImage) {
      const img = document.createElement("img");
      img.classList = `news-image ${floatClass} ${marginClass}`;
      img.src = article.urlToImage;
      img.title = article.description;
      img.alt = article.description;
      link.appendChild(img);
    }
    floatClass === "float-start"
      ? (floatClass = "float-end")
      : (floatClass = "float-start");
    marginClass === "me-2" ? (marginClass = "ms-2") : (marginClass = "me-2");
    const articleDesc = document.createElement("p");
    articleDesc.textContent = stripHTMLFromString(article.description);
    link.appendChild(articleDesc);
  });
}

function addWikipediaArticles(wikipediaArticles) {
  if (!wikipediaArticles) return;
  const modal = document.querySelector('[data-modal="wiki"]');
  let floatClass = "float-start";
  let marginClass = "me-2";
  wikipediaArticles.forEach((article) => {
    const articleContainer = document.createElement("div");
    articleContainer.classList =
      "container rounded pt-1 pb-1 articles-container";
    modal.appendChild(articleContainer);
    const link = document.createElement("a");
    link.href = article[8];
    link.target = "_blank";
    link.classList = "text-dark";
    articleContainer.appendChild(link);
    const title = document.createElement("h5");
    title.textContent = article[1];
    link.appendChild(title);
    const img = document.createElement("img");
    img.classList = `wiki-thumbnail ${floatClass} ${marginClass}`;
    img.src = article[9] ? article[9] : "";
    link.appendChild(img);
    floatClass === "float-start"
      ? (floatClass = "float-end")
      : (floatClass = "float-start");
    marginClass === "me-2" ? (marginClass = "ms-2") : (marginClass = "me-2");
    const para = document.createElement("p");
    para.textContent = article[2];
    link.appendChild(para);
  });
}

function addGeoJSONOutline(geoJSON) {
  if (!geoJSON) return;
  const outline = L.geoJSON(geoJSON, {
    style: function (feature) {
      return { color: "rgba(13, 110, 253, 0.5)" };
    },
  }).addTo(featureGroup1);
}

function createCurrentForecast(data, offset) {
  if (!data) return;
  const modal = document.querySelector('[data-modal="weather"]');
  const accordion = document.createElement("div");
  accordion.id = "weather-accordion";
  accordion.classList = "accordion accordion-flush";
  modal.appendChild(accordion);
  //outer div one
  const accordionContainer = document.getElementById("weather-accordion");
  //outer div two
  const accordionItemDiv = document.createElement("div");
  accordionContainer.appendChild(accordionItemDiv);
  accordionItemDiv.classList = "accordion-item";

  // h2 header
  const header = document.createElement("h2");
  accordionItemDiv.appendChild(header);
  header.classList = "accordion-header";
  header.id = "currentWeather-accordion-header";

  const button = document.createElement("button");
  header.appendChild(button);
  const buttonName = document.createTextNode("Current Weather");
  button.appendChild(buttonName);
  button.setAttribute("class", "accordion-button");
  button.setAttribute("type", "button");
  button.setAttribute("data-bs-toggle", "collapse");
  button.setAttribute("data-bs-target", `#currentWeather-accordion`);
  button.setAttribute("aria-expanded", "true");
  button.setAttribute("aria-controls", `currentWeather-accordion`);

  const accordionCollapseDiv = document.createElement("div");
  accordionItemDiv.appendChild(accordionCollapseDiv);
  accordionCollapseDiv.classList = "accordion-collapse collapse show";
  accordionCollapseDiv.id = `currentWeather-accordion`;
  accordionCollapseDiv.setAttribute(
    "aria-labelledby",
    `currentWeather-accordion-header`
  );
  accordionCollapseDiv.setAttribute("data-bs-parent", `#weather-accordion`);

  const accordionBody = document.createElement("div");
  accordionBody.classList = "accordion-body";
  accordionCollapseDiv.appendChild(accordionBody);

  //card body
  const cardBody = document.createElement("div");
  cardBody.classList = "shadow-sm d-flex justify-content-evenly";
  accordionBody.appendChild(cardBody);

  // const div = document.createElement("div");
  // div.classList = "container pt-3 d-flex justify-content-center";
  // cardBody.appendChild(div);

  const iconDiv = document.createElement("div");
  iconDiv.id = "icon-div";
  iconDiv.classList =
    "px-2 border flex-grow-1 d-flex flex-column align-items-center justify-content-evenly";
  cardBody.append(iconDiv);

  const title = document.createElement("em");
  title.textContent = data.current.weather[0].description;
  title.classList = "mt-1 lead text-center text-capitalize";
  iconDiv.appendChild(title);

  const span = document.createElement("span");
  span.id = "current-weather-icon";
  iconDiv.appendChild(span);
  span.classList = `mt-2 mb-3 ${getWeatherIcon(data.current.weather[0].icon)}`;

  const textDiv = document.createElement("div");
  textDiv.id = "text-div";
  textDiv.classList =
    "border flex-grow-1 d-flex flex-column justify-content-center";
  cardBody.append(textDiv);

  const cardText = document.createElement("p");
  cardText.classList = "text-center";
  textDiv.appendChild(cardText);

  //temp, wind speed, feels like, humidity

  let innerHTML = `<span class="fw-bold blue-text">Temperature </span>${data.current.temp}<span class="text-muted">°C</span><br>`;
  innerHTML += `<span class="fw-bold blue-text">Wind speed </span>${data.current.wind_speed}<span class="text-muted">m/s</span><br>`;
  innerHTML += `<span class="fw-bold blue-text">Feels like </span>${data.current.feels_like}<span class="text-muted">°C</span><br>`;
  innerHTML += `<span class="fw-bold blue-text">Humidity </span>${data.current.humidity}<span class="text-muted">%</span>`;
  cardText.innerHTML = innerHTML;

  //-------------table
  const table = document.createElement("table");
  table.classList = "table table-borderless table-sm";
  let colspan = 0;
  let classList = "w-50";
  addRowWithUnits(
    "Humidity",
    `${data.current.humidity}`,
    "%",
    table,
    colspan,
    classList
  );
  addRowWithUnits("Feels like", `${data.current.feels_like}`, "°C", table);
  addRowWithUnits("Wind speed", `${data.current.wind_speed}`, `m/s`, table);
  addRowWithUnits("Temperature", `${data.current.temp}`, `°C`, table);

  const caption = document.createElement("caption");
  caption.textContent = data.current.weather[0].description;
  caption.classList = "text-center text-capitalize";
  table.prepend(caption);
}

function create48hrForecast(data, offset) {
  if (!data) return;
  //outer div one
  const accordionContainer = document.getElementById("weather-accordion");
  //outer div two
  const accordionItemDiv = document.createElement("div");
  accordionContainer.appendChild(accordionItemDiv);
  accordionItemDiv.classList = "accordion-item";

  // h2 header
  const header = document.createElement("h2");
  accordionItemDiv.appendChild(header);
  header.classList = "accordion-header";
  header.id = "48hr-accordion-header";

  //create button
  const button = document.createElement("button");
  header.appendChild(button);
  const buttonName = document.createTextNode("48hr Forecast");
  button.appendChild(buttonName);
  button.setAttribute("class", "accordion-button collapsed");
  button.setAttribute("type", "button");
  button.setAttribute("data-bs-toggle", "collapse");
  button.setAttribute("data-bs-target", `#weather48hr-accordion`);
  button.setAttribute("aria-expanded", "true");
  button.setAttribute("aria-controls", `weather48hr-accordion`);

  const accordionCollapseDiv = document.createElement("div");
  accordionItemDiv.appendChild(accordionCollapseDiv);
  accordionCollapseDiv.classList = "accordion-collapse collapse";
  accordionCollapseDiv.id = `weather48hr-accordion`;
  accordionCollapseDiv.setAttribute(
    "aria-labelledby",
    `weather48hr-accordion-header`
  );
  accordionCollapseDiv.setAttribute("data-bs-parent", `#weather-accordion`);

  const accordionBody = document.createElement("div");
  accordionBody.classList = "accordion-body";
  accordionCollapseDiv.appendChild(accordionBody);

  // const container = document.getElementById("weather-data");
  const table = document.createElement("table");
  table.classList = "table table-borderless blue-striped";
  table.style.color = "blue-text";
  accordionBody.appendChild(table);

  for (let i = 0; i < data.hourly.length; i++) {
    const hour = data.hourly[i];
    let day = forecastDay(hour.dt, offset);
    if (i > 0) {
      const yesterday = forecastDay(data.hourly[i - 1].dt, offset);
      if (day === yesterday) {
        day = "";
      }
    }
    let textEnd = false;
    addWeatherRow(
      day,
      textEnd,
      forecastTime(hour.dt, offset),
      hour.temp,
      hour.weather[0].description,
      hour.weather[0].icon,
      table
    );
  }

  // const caption = document.createElement("caption");
  // caption.textContent = "48hr forecast";
  // caption.classList = "text-center";
  // table.prepend(caption);
}

function create8DayForecast(data, offset) {
  if (!data) return;
  //outer div one
  const accordionContainer = document.getElementById("weather-accordion");
  //outer div two
  const accordionItemDiv = document.createElement("div");
  accordionContainer.appendChild(accordionItemDiv);
  accordionItemDiv.classList = "accordion-item";

  // h2 header
  const header = document.createElement("h2");
  accordionItemDiv.appendChild(header);
  header.classList = "accordion-header";
  header.id = "currentWeather-accordion-header";

  const button = document.createElement("button");
  header.appendChild(button);
  const buttonName = document.createTextNode("Eight Day Forecast");
  button.appendChild(buttonName);
  button.setAttribute("class", "accordion-button collapsed");
  button.setAttribute("type", "button");
  button.setAttribute("data-bs-toggle", "collapse");
  button.setAttribute("data-bs-target", `#eightDay-accordion`);
  button.setAttribute("aria-expanded", "true");
  button.setAttribute("aria-controls", `eightDay-accordion`);

  const accordionCollapseDiv = document.createElement("div");
  accordionItemDiv.appendChild(accordionCollapseDiv);
  accordionCollapseDiv.classList = "accordion-collapse collapse";
  accordionCollapseDiv.id = `eightDay-accordion`;
  accordionCollapseDiv.setAttribute(
    "aria-labelledby",
    `eightDay-accordion-header`
  );
  accordionCollapseDiv.setAttribute("data-bs-parent", `#weather-accordion`);

  const accordionBody = document.createElement("div");
  accordionBody.classList = "accordion-body";
  accordionCollapseDiv.appendChild(accordionBody);

  const table = document.createElement("table");
  table.classList = "table table-borderless blue-striped";
  accordionBody.appendChild(table);
  data.daily.forEach((dayForecast) => {
    let textEnd = false;
    let day = forecastDay(dayForecast.dt, offset);
    addWeatherRow(
      day,
      textEnd,
      "",
      dayForecast.temp.day,
      dayForecast.weather[0].description,
      dayForecast.weather[0].icon,
      table
    );
  });

  // const caption = document.createElement("caption");
  // caption.textContent = `8 day forecast`;
  // caption.classList = "text-center";
  // table.prepend(caption);
}

function createCovidDeathsTable(data) {
  if (!data.covidTotalDeaths) return;

  const modal = document.querySelector('[data-modal="covid"]');

  const title = document.createElement("h3");
  title.classList = "mt-3 text-center lead";
  title.textContent = "Confirmed Deaths";
  modal.appendChild(title);

  const table = document.createElement("table");
  table.id = "covid-deaths-table";
  table.classList = "table table-borderless blue-striped";
  modal.appendChild(table);

  const deathsArr = data.covidTotalDeaths;
  const latestDeaths = deathsArr[deathsArr.length - 1];
  const popdividedByMillion = parseInt(data.population) / 1000000;
  const deathsPerMillion = (latestDeaths.Cases / popdividedByMillion).toFixed();

  let lastSevenDaysDeaths = 0;
  let prvSevenDaysAvgDeaths = 0;

  const arrLength = deathsArr.length;

  for (let i = arrLength - 7; i < arrLength; i++) {
    lastSevenDaysDeaths += deathsArr[i].Cases - deathsArr[i - 1].Cases;
  }

  for (let i = arrLength - 14; i < arrLength - 7; i++) {
    prvSevenDaysAvgDeaths += deathsArr[i].Cases - deathsArr[i - 1].Cases;
  }

  lastSevenDaysDeaths = (lastSevenDaysDeaths / 7).toFixed();
  prvSevenDaysAvgDeaths = (prvSevenDaysAvgDeaths / 7).toFixed();

  addRow(
    "Avg (prev. 7 days)",
    `${prvSevenDaysAvgDeaths.toLocaleString()} per day`,
    table
  );
  addRow(
    `Avg (of 7 days)`,
    `${lastSevenDaysDeaths.toLocaleString()} per day`,
    table
  );

  addRow("Per million", parseInt(deathsPerMillion).toLocaleString(), table);
  addRow("Total", latestDeaths.Cases.toLocaleString(), table, "", "w-50");
}

function createCovidCasesTable(data) {
  if (!data.covidTotalConfirmed) return;
  const modal = document.querySelector('[data-modal="covid"]');

  const title = document.createElement("h3");
  title.classList = "text-center lead mt-5";
  title.textContent = "Confirmed Cases";
  modal.appendChild(title);

  const table = document.createElement("table");
  table.id = "covid-cases-table";
  table.classList = "table table-borderless blue-striped";
  modal.appendChild(table);

  // const caption = document.createElement("caption");
  // caption.textContent = "Confirmed Infections";
  // caption.classList = "text-center";
  // table.appendChild(caption);

  const confirmedArr = data.covidTotalConfirmed;
  const latestConfirmed = confirmedArr[confirmedArr.length - 1];

  const arrLength = confirmedArr.length;

  //average of last seven days
  let dailyAvglast7 = 0;

  for (let i = arrLength - 8; i < arrLength; i++) {
    dailyAvglast7 += confirmedArr[i].Cases - confirmedArr[i - 1].Cases;
  }

  dailyAvglast7 = (dailyAvglast7 / 7).toFixed();
  //average of previous seven days
  let dailyAvgPrv7 = 0;

  for (let i = arrLength - 15; i < arrLength - 8; i++) {
    dailyAvgPrv7 += confirmedArr[i].Cases - confirmedArr[i - 1].Cases;
  }

  dailyAvgPrv7 = (dailyAvgPrv7 / 7).toFixed();

  addRow(
    "Avg (prev. 7 days)",
    `${parseInt(dailyAvgPrv7).toLocaleString()} per day`,
    table
  );
  addRow(
    "Avg (of 7 days)",
    `${parseInt(dailyAvglast7).toLocaleString()} per day`,
    table
  );
  addRow("Total", latestConfirmed.Cases.toLocaleString(), table, "", "w-50");
}

function addCovidChart_deathsPerDay(data) {
  if (!data.covidTotalDeaths) return;

  const modal = document.querySelector('[data-modal="covid"]');

  const canvas = document.createElement("canvas");
  canvas.getContext("2d");
  canvas.id = "confirmed-deaths-per-day";

  const chart = new Chart(canvas, {
    type: "line",
    data: {},
    options: {
      scales: {
        x: {},
        y: {
          beginAtZero: false,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Confirmed Deaths per Day",
        },
        legend: {
          display: true,
          labels: {
            color: "rgba(54, 162, 235, 1)",
          },
        },
      },
    },
  });

  modal.appendChild(canvas);

  const deathsArr = data.covidTotalDeaths.filter(
    (item) => item.Date.slice(5, 10) !== "02-29"
  );
  //get years
  //for each year - add labels to labels array
  //for each year - add data to the yearData array at matching index
  //for each year - add a new object to chart dataset
  let labels = []; //dates
  const chartData = []; //newDeaths
  const years = [];

  //fill years array
  deathsArr.forEach((item) => {
    const year = item.Date.slice(0, 4);
    if (!years.includes(year)) {
      years.push(year);
    }
  });

  // add labels to labels array
  deathsArr.forEach((item) => {
    labels.push(item.Date.slice(5, 10));
  });

  //sort and remove duplicates
  labels.sort();
  const uniqueSet = new Set(labels);
  labels = [...uniqueSet];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  //add month
  labels = labels.map((label) => {
    label = label.split("-");
    label = `${label[1]}-${months[parseInt(label[0] - 1)]}`;
    return label;
  });

  //set up data with arrays for each year
  years.forEach((year) => {
    chartData.push([]);
  });

  //calculate new deaths
  deathsArr[0].newDeaths = deathsArr[0].Cases;

  for (let i = 1; i < deathsArr.length; i++) {
    deathsArr[i].newDeaths = deathsArr[i].Cases - deathsArr[i - 1].Cases;
  }

  //for each year - add data to the yearData array at matching index
  //remove from array to make next time quicker
  while (deathsArr.length > 0) {
    years.forEach((year, index) => {
      if (deathsArr[0].Date.slice(0, 4) === year) {
        chartData[index].push(deathsArr[0].newDeaths);
        deathsArr.shift();
      }
    });
  }

  while (chartData[0].length < 365) {
    chartData[0].unshift(0);
  }

  const backgroundColors = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
  ];

  const borderColors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ];

  const datasets = [];
  years.forEach((year, index) => {
    const bgColLength = backgroundColors.length;
    const borderColLength = borderColors.length;
    const bgcolorIndex = index - Math.floor(index / bgColLength) * bgColLength;
    const bordercolorIndex =
      index - Math.floor(index / borderColLength) * borderColLength;
    const obj = {
      label: year,
      data: chartData[index],
      backgroundColor: backgroundColors[bgcolorIndex],
      borderColor: borderColors[bordercolorIndex],
      fill: "origin",
    };
    datasets.push(obj);
  });

  chart.data = {
    labels: labels,
    datasets: datasets,
  };
  chart.update();
}

function addCovidChart_deathsPerYear(data) {
  if (!data.covidTotalDeaths) return;
  const modal = document.querySelector('[data-modal="covid"]');
  const canvas = document.createElement("canvas");
  canvas.getContext("2d");

  modal.appendChild(canvas);

  const chart = new Chart(canvas, {
    type: "bar",
    data: {},
    options: {
      indexAxis: "y",
      scales: {
        x: {},
        y: {
          beginAtZero: false,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Confirmed Deaths per Year",
        },
        legend: {
          display: false,
          labels: {
            color: "rgb(255, 99, 132)",
          },
        },
      },
    },
  });

  const deathsArr = data.covidTotalDeaths;
  const years = [];
  const endOfYearFigures = [];
  const deathsData = [];
  let total = 0;

  deathsArr.forEach((item) => {
    total += item.Cases;
  });

  deathsArr.forEach((item) => {
    const year = item.Date.slice(0, 4);
    if (!years.includes(year)) {
      years.push(year);
    }
  });

  deathsArr.reverse();

  years.forEach((year, index) => {
    endOfYearFigures[index] = deathsArr.find(
      (item) => item.Date.slice(0, 4) === year
    );
  });

  deathsArr.reverse();

  for (let i = 0; i < endOfYearFigures.length; i++) {
    if (i === 0) {
      deathsData[i] = endOfYearFigures[i].Cases;
    } else {
      deathsData[i] = endOfYearFigures[i].Cases - endOfYearFigures[i - 1].Cases;
    }
  }

  chart.data = {
    labels: years,
    datasets: [
      {
        // label: "Confirmed Deaths Per Year",
        data: deathsData,
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
      },
    ],
  };
  chart.update();
}

function addCovidChart_dailyInfections(data) {
  if (!data.covidTotalConfirmed) return;
  const modal = document.querySelector('[data-modal="covid"]');
  const canvas = document.createElement("canvas");
  canvas.getContext("2d");
  canvas.id = "covid-infections-per-day";
  modal.appendChild(canvas);

  const chart = new Chart(canvas, {
    type: "line",
    data: {},
    options: {
      scales: {
        x: {},
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Confirmed Infections per Day",
        },
        legend: {
          display: false,
          labels: {
            color: "rgba(54, 162, 235, 0.2)",
          },
        },
      },
    },
  });

  const confirmedArr = data.covidTotalConfirmed;
  let dates = [];
  let newInfections = [];

  for (let i = 0; i < confirmedArr.length; i++) {
    if (i === 0) {
      newInfections.push(confirmedArr[i].Cases);
    } else {
      newInfections.push(confirmedArr[i].Cases - confirmedArr[i - 1].Cases);
    }
  }

  for (let i = 0; i < confirmedArr.length; i++) {
    dates.push(confirmedArr[i].Date);
  }

  dates = dates.map((date) => {
    date = date.slice(0, 10);
    date = date.split("-");
    date = `${date[2]}-${date[1]}-${date[0]}`;
    return date;
  });

  chart.data = {
    labels: dates,
    datasets: [
      {
        // label: "Daily Confirmed Deaths",
        data: newInfections,
        backgroundColor: ["rgba(54, 162, 235, 1)"],
        borderColor: ["rgba(54, 162, 235, 1)"],
      },
    ],
  };
  chart.update();
}

function createDateTypeCheckBoxes(datesArray) {
  if (!datesArray) return;
  const types = [];
  datesArray.forEach((holiday) => {
    if (!types.includes(holiday.type)) {
      types.push(holiday.type);
    }
  });

  types.forEach((type, index) => {
    createDateCheckboxes(type, index);
  });

  createDatesUpcomingOnlyCheckbox();
}

function createDateCheckboxes(type, index) {
  // const container = document.getElementById("date-options-container");
  const container1 = document.getElementById("date-options-col-one");
  const container2 = document.getElementById("date-options-col-two");
  const div = document.createElement("div");
  if (index % 2 === 0) {
    container1.appendChild(div);
  } else {
    container2.appendChild(div);
  }
  div.classList = "form-check";
  const input = document.createElement("input");
  div.appendChild(input);
  input.type = "checkbox";
  input.name = "date-type";
  input.id = type;
  input.value = type;
  input.checked = true;
  input.classList = "form-check-input";
  const label = document.createElement("label");
  div.appendChild(label);
  label.htmlFor = type;
  label.classList = "form-check-label";
  label.textContent = formatType(type);
  input.addEventListener("change", datesCheckboxesEvent);
}

function datesCheckboxesEvent() {
  const dates = ll.current.data.dates;
  const boxes = document.querySelectorAll("[name=date-type]");
  const checkedBoxes = [];
  let filteredDates = [];
  boxes.forEach((box) => {
    if (box.checked) {
      checkedBoxes.push(box.value);
    }
  });
  checkedBoxes.forEach((type) => {
    const filter = dates.filter((date) => date.type === type);
    filteredDates = filteredDates.concat(filter);
    filteredDates.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });
  });

  //get date in string format
  const date = new Date();
  let [month, day, year] = [
    date.getMonth(),
    date.getDate(),
    date.getFullYear(),
  ];
  month = String(month + 1);
  month.length === 1 ? (month = "0" + month) : month;
  day.length === 1 ? (day = "0" + month) : day;

  const dateString = `${year}-${month}-${day}`;

  //if upcoming is checked: filter according to date
  const upcomingOnly = document.getElementById("upcoming-only");
  if (upcomingOnly.checked) {
    filteredDates = filteredDates.filter((date) => date.date >= dateString);
  }
  createDatesTable(filteredDates);
}

function createDatesUpcomingOnlyCheckbox() {
  const upcomingOnly = "upcoming-only";
  const container = document.getElementById("date-options-col-two");
  const div = document.createElement("div");
  container.appendChild(div);
  div.classList = "form-check";
  const input = document.createElement("input");
  div.appendChild(input);
  input.type = "checkbox";
  input.name = upcomingOnly;
  input.id = upcomingOnly;
  input.value = upcomingOnly;
  input.checked = false;
  input.classList = "form-check-input";
  const label = document.createElement("label");
  div.appendChild(label);
  label.htmlFor = upcomingOnly;
  label.classList = "form-check-label";
  label.textContent = "Upcoming only";
  input.addEventListener("change", datesCheckboxesEvent);
}

function createDatesTable(dates) {
  if (!dates) return;
  const modal = document.querySelector('[data-modal="dates"]');
  let table = document.getElementById("dates-table");
  table && table.remove();
  table = document.createElement("table");
  table.classList = "table table-borderless blue-striped";
  table.id = "dates-table";
  modal.appendChild(table);

  // sort holidays
  dates.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const filteredHolidays = dates.filter(
    (date) => date.country === ll.current.data.countryName
  );

  //convert date
  filteredHolidays.forEach((holiday) => {
    const newDate = new Date(holiday.date);
    const day = newDate.getDate();
    const month = months[newDate.getMonth()];
    holiday.readableDate = day + " " + month;
  });

  filteredHolidays.forEach((holiday) => {
    const row = table.insertRow();
    const th = document.createElement("th");
    th.classList = "text-end w-50";
    row.appendChild(th);
    th.textContent = holiday.name;
    let cell1 = row.insertCell();
    cell1.classList = "text-muted";
    cell1.textContent = formatType(holiday.type);
    let cell2 = row.insertCell();
    cell2.classList = "w-25 fw-bold";
    cell2.textContent = holiday.readableDate;
  });
}

function clearHTML(data) {
  console.log("clear HTML");
  const modals = document.querySelectorAll("[data-modal]");
  Array.from(modals).forEach((modal) => {
    const children = modal.children;
    if (children) {
      Array.from(children).forEach((child) => {
        child.remove();
      });
    }
  });

  //clear map pins
  featureGroup1.eachLayer((layer) => layer.clearLayers());

  //remove chart
  // const twentyFourHourChart = document.getElementById("twentyFourHourChart");
  // twentyFourHourChart && twentyFourHourChart.remove();

  //close options accordion
  const optionsButton = document.getElementById("dates-options-button");
  if (!optionsButton.classList.value.includes("collapsed")) {
    optionsButton.click();
  }
}

//---------------------OTHER FUNCTIONS
//increase loading bar size
function incLoadingBar(input) {
  const progressBar = document.getElementById("progress-bar");
  if (!progressBar) return;
  let width = parseInt(progressBar.style.width)
    ? parseInt(progressBar.style.width)
    : 0;
  width += input;
  progressBar.style.width = `${width}%`;
}

function getDateTime() {
  let date = Date();
  const printDate = date.split(" ").slice(0, 5).join(" ");
  ll.current.data.dataCapturedAt = printDate;
}

function setSelected(countryCodeISO2) {
  const select = document.getElementById("select");
  select.value = countryCodeISO2;
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

function removeFocusFromSelect() {
  // const mapDiv = document.getElementById("map");
  const select = document.getElementById("select");
  select.blur();
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
        countriesArr = result;
        result.forEach((country) => {
          // $("#select").append(
          //   $("<option>", {
          //     value: [country[1]],
          //     text: [country[0]],
          //   })
          // );
          $(".select-country-options").append(
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

function addCities(data) {
  if (!data.cities) return;
  data.cityMarkers = {};

  const modal = document.querySelector('[data-modal="cities"]');

  //outer div one
  const citiesList = document.createElement("div");
  citiesList.classList = "accordion accordion-flush";
  citiesList.id = "cities-list";
  modal.appendChild(citiesList);

  data.cities.forEach((city, index) => {
    //set cityName also used for storing marker names
    let cityName = cityNameValidCharactersOnly(city.name);

    if (city.name !== data.capital) {
      data.cityMarkers[cityName] = L.marker([city.lat, city.lng], {
        icon: cityIcon,
        riseOnHover: true,
      })
        .addTo(citiesMCG)
        .bindPopup(
          `<h6><strong id="" class="">
          ${city.name}</strong><br>Pop. ${makeNumberReadable(
            city.population
          )}</h6>`
        )
        .addEventListener("click", (e) => flyToPin(e));
    } else {
      data.cityMarkers[cityName] = L.marker([city.lat, city.lng], {
        icon: capitalCityIcon,
        riseOnHover: true,
      })
        .addTo(capitalMCG)
        .bindPopup(
          `<h6><strong id="" class="">${
            city.name
          }</strong><br>Capital City<br>Pop. ${makeNumberReadable(
            city.population
          )}</h6>`
        )
        .addEventListener("click", (e) => flyToPin(e));
      data.cityMarkers[cityName].openPopup();
    }

    //outer div two
    const accordionItemDiv = document.createElement("div");
    citiesList.appendChild(accordionItemDiv);
    accordionItemDiv.classList = "accordion-item";

    //h2 header
    const header = document.createElement("h2");
    accordionItemDiv.appendChild(header);
    header.classList = "accordion-header";
    header.id = `${city.name}-accordion-header`;

    //create button
    const button = document.createElement("button");
    header.appendChild(button);
    const buttonName = document.createTextNode(`${city.name}`);
    button.appendChild(buttonName);
    button.setAttribute("class", "accordion-button collapsed");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#${cityName}-accordion`);
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", `${city.name}-accordion`);
    button.addEventListener("click", function (e) {
      const targetCity = data.cities.find(
        (city) => city.name === e.target.textContent
      );

      //if there is data already just remove the unclickable
      if (!targetCity.clickedAlready) {
        document.body.classList.add("unclickable");
        cityAPICalls(targetCity, data.offset_sec);
        setTimeout(function () {
          document.body.classList.remove("unclickable");
        }, 1000);
      }
    });

    const accordionCollapseDiv = document.createElement("div");
    accordionItemDiv.appendChild(accordionCollapseDiv);
    accordionCollapseDiv.classList = "accordion-collapse collapse";
    if (index === 0) {
      accordionCollapseDiv.classList.add("open");
    }
    accordionCollapseDiv.id = `${cityNameValidCharactersOnly(
      city.name
    )}-accordion`;
    accordionCollapseDiv.setAttribute(
      "aria-labelledby",
      `${city.name}-accordion-header`
    );

    const accordionBody = document.createElement("div");
    accordionBody.classList = "accordion-body p-1";
    accordionCollapseDiv.appendChild(accordionBody);

    const cityNameAccBody = document.createElement("h3");
    cityNameAccBody.id = "city-name-accordion-body";
    cityNameAccBody.textContent = city.name;
    cityNameAccBody.classList =
      "shadow-sm bg-white sticky-top text-center py-3";
    accordionBody.append(cityNameAccBody);

    //create table
    const table = document.createElement("table");
    accordionBody.appendChild(table);
    table.id = `${cityNameValidCharactersOnly(cityName)}-table`;
    table.classList = "table table-borderless mt-3 blue-striped";

    //findCityOnMap
    const findOnMapDiv = document.createElement("div");
    accordionBody.appendChild(findOnMapDiv);
    findOnMapDiv.classList = "my-2 container d-flex justify-content-end";

    const findOnMapbtn = document.createElement("button");
    findOnMapbtn.textContent = `Go to ${city.name}  `;
    findOnMapbtn.classList = "btn btn-sm btn-primary";
    findOnMapDiv.appendChild(findOnMapbtn);

    const iconSpan = document.createElement("span");
    findOnMapbtn.appendChild(iconSpan);
    iconSpan.classList = "fa-solid fa-arrow-right-long";

    //set zoom to city function
    findOnMapbtn.addEventListener("click", function (e) {
      const innerHTML =
        e.target.parentElement.parentElement.parentElement.previousElementSibling.querySelector(
          "button"
        ).textContent;

      // console.log(innerHTML);
      data.cities.find((city) => {
        citiesModal.hide();
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
        }
      });
    });
  });
}

function addCameras(data) {
  if (!data.cameras) return;
  data.cameras.forEach((camera) => {
    const marker = L.marker(
      [camera.location.latitude, camera.location.longitude],
      {
        icon: cameraIcon,
        riseOnHover: true,
      }
    )
      .addTo(camerasMCG)
      .addEventListener("click", (e) => flyToPin(e));

    const popup = L.DomUtil.create("div", "camera-popup");

    popup.innerHTML = `<div><h6><strong>${
      camera.title
    }</strong></h6><iframe src=${
      camera.player.day.embed
    }></iframe><select id="camera-${
      camera.id
    }" class="form-select camera-select">${
      camera.player.day.available
        ? `<option value=${camera.player.day.embed}>Day</option>`
        : null
    }${
      camera.player.month.available
        ? `<option value=${camera.player.month.embed}>Month</option>`
        : null
    }${
      camera.player.year.available
        ? `<option value=${camera.player.year.embed}>Year</option>`
        : null
    }${
      camera.player.lifetime.available
        ? `<option value=${camera.player.lifetime.embed}>Lifetime</option>`
        : null
    }${
      camera.player.live.available
        ? `<option value=${camera.player.live.embed}>Live</option>`
        : null
    }<select></div>`;

    marker.bindPopup(popup);

    const selectBar = popup.querySelector(`#camera-${camera.id}`);

    if (selectBar) {
      selectBar.addEventListener("change", function (e) {
        const parent = e.target.parentElement;
        const iframe = parent.querySelector("iframe");
        iframe.src = e.target.value;
        // console.log(e.target.value);
      });
    } else {
      console.log("can't find it sorry");
    }
  });
}

//IMAGES CAROUSEL FUNCTION
function addCarouselImages(data) {
  if (!data.countryImages) return;
  const modal = document.querySelector('[data-modal="images"]');

  // const carousel = document.getElementById("country-images-carousel");
  const carousel = document.createElement("div");
  carousel.id = "country-images-carousel";
  carousel.classList = "carousel slide carousel-fade";
  carousel.setAttribute("data-bs-ride", "carousel");
  modal.appendChild(carousel);
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
    // img.classList = "d-block w-100";
    img.classList = "carousel-img-size";
    img.src = image.url;
    img.alt = image.alt_description
      ? image.alt_description
      : `Image from ${data.countryName}`;
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
    title.textContent = reduceText(image.description, 60, "...");
    //alt_description
    const altDescription = document.createElement("p");
    captionDiv.appendChild(altDescription);
    altDescription.textContent = reduceText(image.alt_description, 60, "...");
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

//---------------TABLE ROW FUNCTIONS-----------//
function addRow(cellTitle, cellInfo, table, colSpan = "", classList = "") {
  if (cellInfo === undefined) return;

  const row = table.insertRow(0);
  const cell1 = document.createElement("th");
  cell1.classList = `text-end ${classList}`;
  row.appendChild(cell1);
  const cell2 = row.insertCell();
  cell2.colSpan = colSpan;
  let text1 = document.createTextNode(cellTitle);
  let text2 = document.createTextNode(cellInfo);
  cell1.appendChild(text1);
  cell2.appendChild(text2);
}

function addRowWithUnits(
  cellTitle,
  cellInfo,
  units,
  table,
  colSpan = "",
  classList = ""
) {
  if (!cellInfo) return;
  const row = table.insertRow(0);
  const cell1 = document.createElement("th");
  cell1.classList = `text-end ${classList}`;
  row.appendChild(cell1);
  const cell2 = row.insertCell();
  let text1 = document.createTextNode(cellTitle);
  let text2 = document.createTextNode(cellInfo);
  cell1.appendChild(text1);
  cell2.appendChild(text2);
  const span = document.createElement("span");
  const currencySymbol = document.createTextNode(`${units}`);
  span.appendChild(currencySymbol);
  span.classList = "text-muted";
  cell2.appendChild(span);
}

function addLocalTimeRow(cellTitle, cellInfo, table) {
  if (!cellInfo) return;
  // const table = document.querySelector("#general-info-table");
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

function addWeatherRow(
  day,
  textEnd,
  time,
  cellInfo,
  description,
  icon,
  table,
  position = undefined
) {
  if (!cellInfo) return;
  const row = table.insertRow(position);
  row.classList = "text-center";

  const cell1 = document.createElement("th");
  cell1.textContent = day;
  textEnd === true ? (cell1.classList = "text-end") : null;
  row.appendChild(cell1);

  const cell2 = document.createElement("td");
  cell2.classList = "";
  row.appendChild(cell2);
  const em = document.createElement("em");
  let text1 = document.createTextNode(time);
  em.appendChild(text1);
  cell2.appendChild(em);

  const cell3 = row.insertCell();
  const tempContainer = document.createElement("strong");
  cell3.appendChild(tempContainer);
  const temp = document.createTextNode(cellInfo);
  tempContainer.appendChild(temp);
  const span1 = document.createElement("span");
  cell3.appendChild(span1);
  const spanText = document.createTextNode("°C");
  span1.classList = "text-muted";
  span1.appendChild(spanText);

  const cell4 = row.insertCell();

  // const weatherIcon = getWeatherIcon(icon);
  const span2 = document.createElement("span");
  // span2.classList = weatherIcon.classList;
  span2.classList = getWeatherIcon(icon);
  // span2.style.color = weatherIcon.color;
  cell4.appendChild(span2);
  const cell5 = row.insertCell();
  cell5.textContent = description;
}

function addAreaRow(cellTitle, cellInfo, table) {
  if (!cellInfo) return;
  // const table = document.querySelector("#general-info-table");
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

function addLatLngRow(cellTitle, lat, lng, table) {
  if (!lat || !lng) return;
  // const table = document.querySelector("#general-info-table");
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
  span2.classList.add("text-muted");

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
  span5.classList.add("text-muted");
}

function dataCapturedAtText(data) {
  const capturedAtArray = document.querySelectorAll(".data-captured-at-text");
  capturedAtArray.forEach((element) => {
    element.textContent = data.dataCapturedAt;
  });
}

function addUVIRow(cellTitle, cellInfo, table, colSpan = 0) {
  if (cellInfo === undefined) return;
  const row = table.insertRow(0);
  const cell1 = document.createElement("th");
  cell1.classList = "text-end";
  row.appendChild(cell1);
  const cell2 = row.insertCell();
  cell2.colSpan = colSpan;
  let text1 = document.createTextNode(cellTitle);
  let text2 = cellInfo;
  cell1.appendChild(text1);

  if (cellInfo < 3) {
    cell2.classList.add("text-success");
    text2 = text2 + " (Low)";
  } else if (cellInfo < 6) {
    cell2.classList.add("text-yellow");
    text2 = text2 + " (Moderate)";
  } else if (cellInfo < 8) {
    cell2.classList.add("text-orange");
    text2 = text2 + " (High)";
  } else if (cellInfo < 11) {
    cell2.classList.add("text-danger");
    text2 = text2 + " (Very High)";
  } else if (cellInfo >= 11) {
    cell2.classList.add("text-violet");
    text2 = text2 + " (Extreme)";
  }

  cell2.textContent = text2;
}

function addAirPollutionRow(cellTitle, cellInfo, table, colSpan = 0) {
  if (cellInfo === undefined) return;

  const row = table.insertRow(0);
  const cell1 = document.createElement("th");
  cell1.classList = "text-end";
  row.appendChild(cell1);
  const cell2 = row.insertCell();
  cell2.colSpan = colSpan;
  let text1 = document.createTextNode(cellTitle);
  cell1.appendChild(text1);

  switch (cellInfo) {
    case 1:
      cell2.textContent = `${cellInfo} (Good)`;
      cell2.classList = "text-success";
      break;
    case 2:
      cell2.textContent = `${cellInfo} (Fair)`;
      cell2.classList = "text-success";
      break;
    case 3:
      cell2.textContent = `${cellInfo} (Moderate)`;
      cell2.classList = "text-warning";
      break;
    case 4:
      cell2.textContent = `${cellInfo} (Poor)`;
      cell2.classList = "text-danger";
      break;
    case 5:
      cell2.textContent = `${cellInfo} (Very Poor)`;
      cell2.classList = "text-danger";
      break;
    default:
      cell2.classList = "";
  }
}

//----------------------------CITY API CALLS

function cityAPICalls(data, offset) {
  if (data.clickedAlready) return;
  let cityName = cityNameValidCharactersOnly(data.name);
  const table = document.querySelector(`#${cityName}-table`);

  const outerDiv = document.createElement("div");
  outerDiv.id = "spinner";
  outerDiv.classList = "d-flex justify-content-center";
  document.body.append(outerDiv);
  const innerDiv = document.createElement("div");
  innerDiv.classList = "spinner-border";
  outerDiv.append(innerDiv);

  table.after(outerDiv);
  Promise.all([
    apiOpenWeatherOneCall(data),
    apiOpenweatherAirPollution(data),
    opencageCall(data),
    apiYelpCall(data),
  ])
    .then(() => {
      updateCityInfoHTML(data, offset);
    })
    .catch((e) => console.log(e));
}

//---------------------------CITY  UPDATE HTML
function updateCityInfoHTML(data, offset) {
  let cityName = cityNameValidCharactersOnly(data.name);
  const table = document.querySelector(`#${cityName}-table`);

  const spinner = document.getElementById("spinner");
  spinner.remove();

  data.county ? addRow("County", data.county, table, 0) : null;

  addAirPollutionRow("Air Quality Index", data.airPollution, table, 4);
  addUVIRow("UVI", data.weather.current.uvi, table, 0);
  data.state_district
    ? addRow("State District", data.state_district, table, 0)
    : null;
  addRow("Population", makeNumberReadable(data.population), table, 0, "w-50");
  data.clickedAlready = true;

  const weatherTable = document.createElement("table");
  weatherTable.classList = "table table-borderless blue-striped";
  table.after(weatherTable);
  const hourlyForecastArr = data.weather.hourly;

  data.weather.hourly.forEach((item) => {
    item.localisedTime = forecastTime(item.dt, offset);
    item.localisedDay = forecastDay(item.dt, offset);
  });

  const weatherArr = hourlyForecastArr.filter(
    (forecast) =>
      forecast.localisedTime === "12pm" ||
      forecast.localisedTime === "3pm" ||
      forecast.localisedTime === "6pm" ||
      forecast.localisedTime === "9pm" ||
      forecast.localisedTime === "12am" ||
      forecast.localisedTime === "3am" ||
      forecast.localisedTime === "6am" ||
      forecast.localisedTime === "9am"
  );

  const reducedWeatherArr = [];

  for (let i = 0; i < 4; i++) {
    reducedWeatherArr.push(weatherArr[i]);
  }

  let day = "";
  for (let i = reducedWeatherArr.length - 1; i > -1; i--) {
    if (i === 0 || reducedWeatherArr[i].localisedTime === "12am") {
      day = reducedWeatherArr[i].localisedDay;
    } else {
      day = "";
    }

    let textEnd = true;

    addWeatherRow(
      day,
      textEnd,
      reducedWeatherArr[i].localisedTime,
      reducedWeatherArr[i].temp,
      reducedWeatherArr[i].weather[0].description,
      reducedWeatherArr[i].weather[0].icon,
      weatherTable,
      0
    );
  }
  if (data.yelp) {
    const yelpContainer = document.createElement("div");
    weatherTable.after(yelpContainer);
    if (data.yelp.length > 0) {
      data.yelp.forEach((business) => addYelpBusiness(business, yelpContainer));
    } else {
      const noBusinessesText = document.createElement("small");
      noBusinessesText.textContent = "(No Yelp suggestions for this location)";
      noBusinessesText.classList = "ms-2 text-primary";
      yelpContainer.append(noBusinessesText);
    }
  }
}

function addYelpBusiness(business, yelpContainer) {
  const businessContainer = document.createElement("div");
  businessContainer.classList =
    "yelp-businesses mx-0 my-1 d-flex p-2 bg-light rounded";

  const link = document.createElement("a");
  link.target = "_blank";
  link.href = business.url;

  const imgDiv = document.createElement("div");
  imgDiv.classList =
    "yelp-image-div flex-shrink-0 d-flex justify-content-center";
  const img = document.createElement("img");
  img.src = business.image_url;
  img.classList = "yelp-image w-100";
  img.alt = business.name;
  imgDiv.append(img);

  const textDiv = document.createElement("div");
  textDiv.classList =
    "text-div ms-1 flex-grow-1 d-flex flex-column justify-content-between text-dark";

  const nameDiv = document.createElement("div");
  nameDiv.classList = "name-div ms-2 d-flex flex-column";
  const name = document.createElement("h5");
  name.classList = "ms-1";
  name.textContent = reduceText(business.name, 20);

  const categoriesPara = document.createElement("small");
  categoriesPara.classList = "ms-1 text-muted";
  let catText = "";
  business.categories.forEach((category) => {
    catText += category.title + " | ";
  });

  catText = catText.slice(0, -2);

  categoriesPara.textContent = catText;

  const ratingDiv = document.createElement("div");
  ratingDiv.classList = "rating-div ms-1 d-flex align-items-center";
  const ratingImg = document.createElement("img");
  ratingImg.src = getYelpRatingImg(business.rating);
  ratingDiv.append(ratingImg);

  textDiv.append(name, ratingDiv, categoriesPara);
  businessContainer.append(imgDiv, textDiv);
  link.append(businessContainer);
  yelpContainer.append(link);
}

//-------------formatting functions--------------------//

function formatType(type) {
  type = type.toLowerCase();
  const upperCaseLetter = type.charAt(0).toUpperCase();
  type = type.replace(type.charAt(0), upperCaseLetter);

  while (type.includes("_")) {
    type = type.replace("_", " ");
  }
  return type;
}

function getYelpRatingImg(rating) {
  // if (window.innerWidth < 380) {
  switch (rating) {
    case 1:
      return "libs/imgs/yelp/small_1.png";
    case 1.5:
      return "libs/imgs/yelp/small_1_half.png";
    case 2:
      return "libs/imgs/yelp/small_2.png";
    case 2.5:
      return "libs/imgs/yelp/small_2_half.png";
    case 3:
      return "libs/imgs/yelp/small_3.png";
    case 3.5:
      return "libs/imgs/yelp/small_3_half.png";
    case 4:
      return "libs/imgs/yelp/small_4.png";
    case 4.5:
      return "libs/imgs/yelp/small_4_half.png";
    case 5:
      return "libs/imgs/yelp/small_5.png";
    default:
      return "libs/imgs/yelp/small_0.png";
  }
}

function getWeatherIcon(iconRef) {
  switch (iconRef) {
    case "01d":
      //clear sky - sun
      return "fa-solid fa-sun weather-icon-light";
    case "02d":
      //few clouds - sun + cloud
      return "fa-solid fa-cloud-sun weather-icon-dark";
    case "03d":
      //scattered clouds - single cloud
      return "fa-solid fa-cloud weather-icon-dark";
    case "04d":
      //broken clouds - two clouds
      return "fa-solid fa-cloud weather-icon-dark";
    case "09d":
      //shower rain - cloud rain
      return "fa-solid fa-cloud-rain weather-icon-dark";
    case "10d":
      //rain - rain
      return "fa-solid fa-cloud-showers-heavy weather-icon-dark";
    case "11d":
      //thunderstorm - cloud/lightnight
      return "fa-solid fa-cloud-bolt weather-icon-dark";
    case "13d":
      //snow - snowflake
      return "fa-solid fa-snowflake weather-icon-blue";
    case "50d":
      //mist -
      return "fa-solid fa-bars-staggered weather-icon-dark";
    case "01n":
      //clear sky - moon
      return "fa-solid fa-moon weather-icon-dark";
    case "02n":
      //few clouds - moon + cloud
      return "fa-solid fa-cloud-moon weather-icon-dark";
    case "03n":
      //scattered clouds - single cloud
      return "fa-solid fa-cloud weather-icon-dark";
    case "04n":
      //broken clouds - two clouds
      return "fa-solid fa-cloud weather-icon-dark";
    case "09n":
      //shower rain - cloud rain
      return "fa-solid fa-cloud-rain weather-icon-dark";
    case "10n":
      //rain - rain
      return "fa-solid fa-cloud-showers-heavy weather-icon-dark";
    case "11n":
      //thunderstorm - cloud/lightnight
      return "fa-solid fa-cloud-bolt weather-icon-dark";
    case "13n":
      //snow - snowflake
      return "fa-solid fa-snowflake weather-icon-blue";
    case "50n":
      //mist -
      return "fa-solid fa-bars-staggered weather-icon-dark";
    default:
      console.log(image);
  }
}

function stripHTMLFromString(string) {
  if (!string) return;
  const strippedString = string.replace(/(<([^>]+)>)/gi, "");
  return strippedString;
}

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

function reduceText(text, maxChar, string = "") {
  if (text === null) return (text = "");
  let words = 10;
  let newText = text;
  while (newText.length > maxChar) {
    newText = newText.split(" ").slice(0, words).join(" ");
    words--;
  }

  return newText + string;
}

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
