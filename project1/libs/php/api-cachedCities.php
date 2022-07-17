<?php

// $input = json_decode(file_get_contents('php://input'), true);


function cache_data() {
    $target = "http://download.geonames.org/export/dump/cities15000.zip";

    $f = file_put_contents("my-zip.zip", fopen($target, 'r'), LOCK_EX);
    if(FALSE === $f)
        die("Couldn't write to file.");
    $zip = new ZipArchive;
    $res = $zip->open('my-zip.zip');
    if ($res === TRUE) {
      $zip->extractTo('../resources/');
      $zip->close();
      //
    //   echo("success");
    } else {
      //
      
    }
    unlink('my-zip.zip');

}

function get_cities_data () {
    $cache_file = '../resources/cities15000.txt';
    // $selected_country = $input['countryName'];
    $selected_country = $_REQUEST['countryCodeISO2'];
    // $selected_country = "GB";
    $fp = fopen($cache_file, 'r');
    
    $cities_array = array();
    
    while ( !feof($fp))
    {
        $num = 0;
        $line = fgets($fp, 2048);
        $line_array = str_getcsv($line, "\t");
        $city_array = array();
        if(array_key_exists(8, $line_array)) {
            if ($line_array[8] === $selected_country) {
                if (intval($line_array[14],10) >= 50000 ) {
                    for($i = 0; $i < 19; $i++) {
                        if ($i === 0 || $i === 1 || $i === 4 || $i === 5 || $i === 8 || $i === 14) {
                            $city_array[name_array_keys($i)] = $line_array[$i];
                        }     
                    }
                    $city_array['geonameId'] = intval($city_array['geonameId']);
                    $city_array['population'] = intval($city_array['population']);
                    $city_array['lat'] = floatval($city_array['lat']);
                    $city_array['lng'] = floatval($city_array['lng']);
                    array_push($cities_array, $city_array);
                }
        } 
    }
    
    }                              
    
    fclose($fp);
    
    //sort cities by most populous first
    usort($cities_array, function ($a, $b)
    {
        return $b['population'] <=> $a['population'];
    });
    
    //take the first most populous 200
    $results = array_slice($cities_array, 0, 200);
    
return $results;

}

function get_cities() {
    $executionStartTime = microtime(true);
    $expires = time() - 180*24*60*60;
    $cache_file = '../resources/cities15000.txt';

    if (!file_exists($cache_file)) {
       cache_data();
    } else if ( filectime($cache_file) < $expires || file_get_contents($cache_file)  == '') {
        unlink($cache_file);
        cache_data();
    } 

    $results = get_cities_data();

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $results;

	header('Content-Type: application/json; charset=UTF-8');

    $encoded_output = json_encode($output,true);
    echo $encoded_output;

}


function name_array_keys($number) {
    $key = "";
        switch ($number) {
            case 0:
                $key = "geonameId";
                break;
            case 1:
                $key = "name";
                break;
            case 2:
                break;
                $key = "toponymName";
            case 3:
                $key = "altNames";
                break;
            case 4:
                $key = "lat";
                break;
            case 5:
                $key = "lng";
                break;
            case 6:
                $key = "fcl";
                break;
            case 7:
                $key = "fcode";
                break;
            case 8:
                $key = "countrycode";
                break;
            case 9:
                $key = "";
                break;
            case 10:
                $key = "";
                break;
            case 11:
                $key = "";
                break;
            case 12:
                $key = "";
                break;
            case 13:
                $key = "";
                break;
            case 14:
                $key = "population";
                break;
            case 15:
                $key = "";
                break;
            case 16:
                $key = "";
                break;
            case 17:
                $key = "continent/city";
                break;
            case 18:
                $key = "date";
                break;
        }
    
    return $key;
}
    


get_cities();

    ?>



