<?php
/**
 * You are given a sequence of strings, each on a new line. Every odd line on the console is representing a resource (e.g. Gold, Silver, Copper, and so on), and every even – quantity. Your task is to collect the resources and print them each on a new line.
    Print the resources and their quantities in format:
    {resource} –> {quantity}
    The quantities inputs will be in the range [1 … 2 000 000 000]
 */

$resources = [];
while (true) {
    $resource = trim(fgets(STDIN));

    if ($resource == "stop")
        break;

    $quantity = trim(fgets(STDIN));

    $resources[$resource] = bcadd($resources[$resource], $quantity);
}

foreach ($resources as $res => $quant) {
    echo sprintf("%s -> %s", $res, $quant) . PHP_EOL;
}