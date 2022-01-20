<?php

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    
	$today = date("Y-m-d");
	$country = urlencode($_REQUEST['countryname']);


// $url = "https://newsapi.org/v2/everything?q=france&from=2022-01-19&sortBy=popularity&apiKey=5a1e8fc66a7545a19da5af17cdb9e12a";
$url = "https://newsapi.org/v2/everything?q={$country}&from={$today}&sortBy=popularity&apiKey=5a1e8fc66a7545a19da5af17cdb9e12a";
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');



	echo json_encode($output); 
?>
