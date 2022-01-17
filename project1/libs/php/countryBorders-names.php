<?php

ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);


// Read the JSON file 
$json = file_get_contents('../resources/countryBorders.geo.json');
  
// Decode the JSON file
$json_data = json_decode($json,true);

//Declare array to add values to
$array = array();

//loop through JSON file to get required data
//pass data to array 
foreach($json_data['features'] as $country_data) {
    $tempArray = array();
    array_push($tempArray, $country_data['properties']['name']);
    array_push($tempArray, $country_data['properties']['iso_a2']);
    array_push($array, $tempArray);
}

sort($array);

//encode array for return
$encoded = json_encode($array);

    //return encoded data
    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $encoded;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output) 

?>