<?php
/**
 * Write a Boolean method IsPrime(n) that check whether a given integer number n is prime. Examples:
 */

function IsPrime($num) {
    if ($num == 0 || $num == 1)
        return false;

    for ($i = 2; $i <= sqrt($num); $i++) {
        if ($num % $i == 0)
            return false;
    }

    return true;
}
$is_prime = IsPrime(intval(trim(fgets(STDIN))));
echo ($is_prime ? "True" : "False");
