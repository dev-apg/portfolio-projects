$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

// FIRST API - ISO COUNTRY CODE
$("#btnRun1").click(function () {
  $.ajax({
    url: "libs/php/api1.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: $("#lat").val(),
      lng: $("#lng").val(),
    },
    success: function (result) {
      console.log(JSON.stringify(result));
      if (result.status.name == "ok") {
        $("#txtCountryName").html(result["data"]["countryName"]);
        $("#txtCountryCode").html(result["data"]["countryCode"]);
        // $("#txtLang").html(result["data"]["languages"]);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});

// SECOND API - WEATHER
$("#btnRun2").click(function () {
  $.ajax({
    url: "libs/php/api2.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: $("#api-2-lat").val(),
      lng: $("#api-2-lng").val(),
    },
    success: function (result) {
      console.log(JSON.stringify(result));

      if (result.status.name == "ok") {
        $("#api-2-countryCode").html(result["data"]["countryCode"]);
        $("#api-2-temperature").html(result["data"]["temperature"]);
        $("#api-2-humidity").html(result["data"]["humidity"]);
        $("#api-2-windSpeed").html(result["data"]["windSpeed"]);
        $("#api-2-clouds").html(result["data"]["clouds"]);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});

//THIRD API - HIERARCHIES

$("#btnRun3").click(function () {
  $.ajax({
    url: "libs/php/api3.php",
    type: "POST",
    dataType: "json",
    data: {
      geonameId: $("#api-3-select-country").val(),
    },
    success: function (result) {
      console.log(JSON.stringify(result));
      if (result.status.name == "ok") {
        // console.log(result);
        $("#api-3-continent").html(result["data"][1]["name"]);
        $("#api-3-country").html(result["data"][2]["name"]);
        $("#api-3-city").html(result["data"][3]["name"]);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});
