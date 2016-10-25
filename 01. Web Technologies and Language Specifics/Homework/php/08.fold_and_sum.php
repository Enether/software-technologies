<?php
/**
 * Read an array of 4*k integers, fold it like shown below,
 * and print the sum of the upper and lower two rows (each holding 2 * k integers):
 */
// convert the input to integers
$split_input = array_map('intval', explode(' ', trim(fgets(STDIN))));

$array_part_len = count($split_input) / 4;
$first_part = array_reverse(array_slice($split_input, 0, $array_part_len));
$mid_part = array_slice($split_input, $array_part_len, $array_part_len*2);
$last_part = array_reverse(array_slice($split_input, $array_part_len * 3));

$folded_arr = array_merge($first_part, $last_part);

$finished_arr = array_map(function () {
    return array_sum(func_get_args());
}, $mid_part, $folded_arr);

echo implode(' ', $finished_arr);
