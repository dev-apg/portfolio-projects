<?php
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

//encode array for return
$encoded = json_encode($array);

//return encoded data
echo $encoded;

?>