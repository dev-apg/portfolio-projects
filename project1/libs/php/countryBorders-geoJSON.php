<?php

$executionStartTime = microtime(true);

// Read the JSON file 
$json = file_get_contents('../resources/countryBorders.geo.json');
  
// Decode the JSON file
$json_data = json_decode($json,true);

// get array length
$array_length = count($json_data['features']);
$result;

for ($i = 0; $i < $array_length; $i++) {
    if ($_REQUEST['countryCodeISO2'] == $json_data['features'][$i]['properties']['iso_a2']) {
    $result = $json_data['features'][$i];
        }
    }

        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        $output['data'] = $result;
    
        header('Content-Type: application/json; charset=UTF-8');
    
        $encoded_output = json_encode($output,true);

        echo $encoded_output;   
?>