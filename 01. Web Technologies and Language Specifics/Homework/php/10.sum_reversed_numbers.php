<?php
/**
 * Write a program that reads sequence of numbers, reverses their digits, and prints their sum.
 */
echo array_sum(array_map('intval', array_map('strrev', explode(' ', trim(fgets(STDIN))))));