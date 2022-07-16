<?php

$executionStartTime = microtime(true);

function get_volcanoes_data() {

	$executionStartTime = microtime(true);
    
	$url = "https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GVP-VOTW:Smithsonian_VOTW_Pleistocene_Volcanoes&maxFeatures=1000&outputFormat=application%2Fjson";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decoded_result = json_decode($result,true);

	return $decoded_result;
}



function filter_volcanoes_data($volcanoes, $country) {

$array = array();
foreach($volcanoes['features'] as $volcano) {
   if ($volcano['properties']['Country'] == $country) {
	   array_push($array, $volcano);
   }
}

return $array;

}

function get_volcanoes($country) {
	global $executionStartTime;
//get file name
$cache_file = '../resources/volcanoes-cache.json';

//define expiry time (180 days)
$expires = time() - 180*24*60*60;

if (!file_exists($cache_file)) {
	$results = get_volcanoes_data();
	$encoded_results = json_encode($results, true);
	file_put_contents($cache_file, $encoded_results);
} else if ( filectime($cache_file) < $expires || file_get_contents($cache_file)  == '') {
	$results = get_volcanoes_data();
	$encoded_results = json_encode($results, true);
	file_put_contents($cache_file, $encoded_results);
} 

$results = file_get_contents($cache_file);

$decoded_results = json_decode($results,true);

$filtered_results = filter_volcanoes_data($decoded_results, $country);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $filtered_results;

	header('Content-Type: application/json; charset=UTF-8');

	$encoded_output = json_encode($output,true);

	echo $encoded_output;
}

	get_volcanoes($_REQUEST['countryname']);

?>
