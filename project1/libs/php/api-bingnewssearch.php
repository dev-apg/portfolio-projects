<?php

// remove for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$today = date("Y-m-d");
$country = urlencode($_REQUEST['countryname']);
$url = "https://bing-news-search1.p.rapidapi.com/news/search?q={$country}&count=20&freshness=Week&textFormat=Raw&safeSearch=Moderate";
$headers = array("X-BingApis-SDK: true",
"X-RapidAPI-Host: bing-news-search1.p.rapidapi.com",
"X-RapidAPI-Key: f5ca45876bmshb7c392f2aed5607p133d90jsnf97cb03d1862");
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');



echo json_encode($output);
