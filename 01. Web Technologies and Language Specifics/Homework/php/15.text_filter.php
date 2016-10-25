<?php
/*
 * Write a program that takes a text and a string of banned words.
 * All words included in the ban list should be replaced with asterisks "*", equal to the word's length.
 *  The entries in the ban list will be separated by a comma and space ", ".
 * The ban list should be entered on the first input line and the text on the second input line.
 * */
$banned_words = explode(', ', trim(fgets(STDIN)));
$text = trim(fgets(STDIN));

foreach ($banned_words as $word) {
    $text = str_replace($word, str_repeat('*', strlen($word)), $text);
}

echo $text;