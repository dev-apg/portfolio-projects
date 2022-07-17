<?php


    $expires = time() - 24*60*60;
    $cache_file = '../resources/cities15000.txt';
    echo filectime($cache_file);
    echo "<br>";
    echo filemtime($cache_file);


    if (!file_exists($cache_file)) {
    //    cache_data();
       echo "file does not exist";
    } else if ( filectime($cache_file) < $expires || file_get_contents($cache_file)  == '') {
        // cache_data();
        unlink($cache_file);
        echo "file too old - deleted";
    } else {
        echo "all ok";
    }
