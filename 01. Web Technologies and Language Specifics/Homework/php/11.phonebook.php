<?php
/**
 * Write a program that receives some info from the console about people and their phone numbers.
 * Each entry should have just one name and one number (both of them strings).
 * On each line you will receive some of the following commands:
 * A {name} {phone} – adds entry to the phonebook. In case of trying to add a name that is already in
 * the phonebook you should change the existing phone number with the new one provided.
 * S {name} – searches for a contact by given name and prints it in format "{name} -> {number}".
 * In case the contact isn't found, print "Contact {name} does not exist.".
 * END – stop receiving more commands
 */


$phonebook = [];

while (true) {
    $command = trim(fgets(STDIN));

    if ($command == "END")
        break;

    $command_params = explode(' ', $command);
    $name = $command_params[1];

    if ($command[0] == "A"){
        // add
        $phone = $command_params[2];
        $phonebook[$name] = $phone;
    }
    else {
        // search
        if (array_key_exists($name, $phonebook)) {
            echo sprintf("%s -> %s", $name, $phonebook[$name]) . PHP_EOL;
        }
        else {
            echo sprintf("Contact %s does not exist.", $name) . PHP_EOL;
        }
    }
}