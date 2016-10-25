<?php
/**
 * Create a program to convert a decimal number to hexadecimal and binary number and print it.
 */

$num = intval(trim(fgets(STDIN)));

echo strtoupper(dechex($num)) . PHP_EOL;
echo decbin($num);