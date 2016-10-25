<?php
/**
 * Compare two char arrays lexicographically (letter by letter).
 * Print the them in alphabetical order, each on separate line.
 */

// array with the words
$words = [str_replace(' ', '', trim(fgets(STDIN))), str_replace(' ', '', trim(fgets(STDIN)))];
// sort the array
natsort($words);
// print the array, each value on a new line
echo implode(PHP_EOL, $words);