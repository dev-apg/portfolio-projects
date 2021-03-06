<?php

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    
	$url = "http://api.geonames.org/wikipediaBoundingBox?north={$_REQUEST['north']}&south={$_REQUEST['south']}&east={$_REQUEST['east']}&west={$_REQUEST['west']}&username=apglynn";

	$ch = curl_init();

	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$result = simplexml_load_string($result);

	$array = array();

	foreach($result as $xml) {
		$tempArray=array();
		foreach($xml->children() as $child) {
			array_push($tempArray,$child->__toString());
		}
		array_push($array, $tempArray);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $array;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>
