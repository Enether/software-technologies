<?php
/**
 * Write a method that returns the English name of the last digit of a given number.
 * Write a program that reads an integer and prints the returned value from this method.
 */

$DIGITS_TO_STRING = [
    "0" => "zero",
    "1" => "one",
    "2" => "two",
    "3" => "three",
    "4" => "four",
    "5" => "five",
    "6" => "six",
    "7" => "seven",
    "8" => "eight",
    "9" => "nine"
];
$num = trim(fgets(STDIN));
$last_digit = $num[strlen($num) - 1];

echo $DIGITS_TO_STRING[$last_digit];