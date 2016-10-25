<?php
/**
 * Write a program to find how many times a given string appears in a given text as substring. The text is given at the first input line. The search string is given at the second input line. The output is an integer number.
 * Please ignore the character casing. Overlapping between occurrences is allowed. Examples:
 */

$text = strtolower(trim(fgets(STDIN)));
$key = strtolower(trim(fgets(STDIN)));

// reset it to space
if ($key == '')
    $key = ' ';

$occurences = 0;

for($i = 0; $i < strlen($text); $i++) {
    if (substr($text, $i, strlen($key)) == $key) {
        $occurences += 1;
    }
}

echo $occurences;