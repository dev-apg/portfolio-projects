<?php

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    
$url = "https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GVP-VOTW:Smithsonian_VOTW_Pleistocene_Volcanoes&maxFeatures=1000&outputFormat=application%2Fjson";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$json_data = json_decode($result,true);	

//Declare array to add values to
$array = array();

$country = $_REQUEST['countryname'];

//loop through JSON file to get required data
//pass data to array 
foreach($json_data['features'] as $volcano) {
   if ($volcano['properties']['Country'] == $country) {
	   array_push($array, $volcano);
   }
}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $array;

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
?>
