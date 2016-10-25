<?php
/**
 * Write a program that generate random fake advertisement message to extol some product. The messages must consist of 4 parts: laudatory phrase + event + author + city. Use the following predefined parts:
    Phrases – {“Excellent product.”, “Such a great product.”, “I always use that product.”, “Best product of its category.”,
 * “Exceptional product.”, “I can’t live without this product.”}
    Events – {“Now I feel good.”, “I have succeeded with this product.”, “Makes miracles. I am happy of the results!”,
 * “I cannot believe but now I feel awesome.”, ”Try it yourself, I am very satisfied.”, “I feel great!”}
    Author – {“Diana”, “Petya”, “Stella”, “Elena”, “Katya”, “Iva”, “Annie”, “Eva”}
    Cities – {“Burgas”, “Sofia”, “Plovdiv”, “Varna”, “Ruse”}
    The format of the output message is: {phrase} {event} {author} – {city}.
    As an input you take the number of messages to be generated. Print each random message at a separate line.
 */

$phrases = ["Excellent product.", "Such a great product.", "I always use that product.", "Best product of its category.",
            "Exceptional product.", "I can't live without this product."];
$events = ["Now I feel good.", "I have succeeded with this product.", "Makes miracles. I am happy of the results!",
            "I cannot believe but now I feel awesome.", "Try it yourself, I am very satisfied", "I feel great!"];
$authors = ["Diana", "Petya", "Stella", "Elena", "Katya", "Iva", "Annie", "Eva"];
$cities = ["Burgas", "Sofia", "Plovdiv", "Varna", "Ruse"];

$phrases_idx = rand(0, count($phrases) - 1);
$events_idx = rand(0, count($events) - 1);
$authors_idx = rand(0, count($authors) - 1);
$cities_idx = rand(0, count($cities) - 1);

echo sprintf("%s %s %s - %s", $phrases[$phrases_idx], $events[$events_idx], $authors[$authors_idx], $cities[$cities_idx]);