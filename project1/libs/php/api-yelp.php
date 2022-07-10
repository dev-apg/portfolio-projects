<?php

// remove for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$url = "https://api.yelp.com/v3/businesses/search?latitude={$_REQUEST['latitude']}&longitude={$_REQUEST['longitude']}";
$authorization = "Authorization: Bearer SXe8gaPZS5uVYvYnQd8luT2F6xjkD6523FjJSmBqRlnlFYcZ2ahICZZCtxWmHJ7uOm-7b4loW2HpK9yNfZkhmldC5-xw1jvooTV-FWUoc6SHB4vW38qbL4ssv5rqYXYx";
$ch = curl_init();
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', $authorization));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

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
