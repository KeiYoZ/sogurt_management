<?php

$data = $_GET['data'];

//file_put_contents('data.json', json_encode($data, JSON_FORCE_OBJECT));
file_put_contents('data.json', $data);
?>