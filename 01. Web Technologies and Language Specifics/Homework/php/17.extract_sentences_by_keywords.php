<?php
/**
 * Write a program that extracts from a text all sentences that contain a particular word (case-sensitive).
Assume that the sentences are separated from each other by the character "." or "!" or "?".
The words are separated one from another by a non-letter character.
Notе that appearance as substring is different than appearance as word. The sentence “I am a fan of Motorhead” does not contain the word “to”. It contains the substring “to” which is not what we need.
Print the result sentence text without the separators between the sentences ("." or "!" or "?")
 */

$keyword = trim(fgets(STDIN));
$text = trim(fgets(STDIN));
$pattern = '/((?<=[.!?]|^)(([^\w.?!]|^)+\w*[^\w.?!]*)*[^\w\.\?!]+(' . $keyword . ')[^\w\.\?!]+([^\w.?!]*\w*[^\w.!?]*)*)(?:[.!?]+)/';

$matches = [];
preg_match_all($pattern, $text, $matches);

foreach ($matches[1] as $match){
    echo trim($match) . PHP_EOL;
}

