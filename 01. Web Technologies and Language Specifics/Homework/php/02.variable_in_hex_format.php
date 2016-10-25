<?php
/*
 * Write a program that reads a number in hexadecimal format (0x##) convert it to decimal format and prints it.
 */

$hex_str = trim(fgets(STDIN));
$num = hexdec($hex_str);

echo $num;
?>