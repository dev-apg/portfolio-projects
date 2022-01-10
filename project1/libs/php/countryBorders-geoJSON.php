<?php
// Read the JSON file 
$json = file_get_contents('../resources/countryBorders.geo.json');
  
// Decode the JSON file
$json_data = json_decode($json,true);

// get array length
$array_length = count($json_data['features']);

    for ($i = 0; $i < $array_length; $i++) {
        if ($_REQUEST['countryCode'] == $json_data['features'][$i]['properties']['iso_a2']) {
            // echo json_encode($json_data['features'][$i]['geometry']['coordinates']);
            echo json_encode($json_data['features'][$i]);
        }   
        }
?>