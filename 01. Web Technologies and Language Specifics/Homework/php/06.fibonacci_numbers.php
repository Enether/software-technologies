<?php
/**
 * Define a method Fib(n) that calculates the nth Fibonacci number. Examples:
 */

function Fib($num) {
    if ($num == 0 || $num == 1){
        return 1;
    }
    return Fib($num - 1) + Fib($num - 2);
}

echo Fib(intval(trim(fgets(STDIN))));