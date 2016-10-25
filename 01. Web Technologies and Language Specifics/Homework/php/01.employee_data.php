<?php
/*
 * A marketing company wants to keep record of its employees. Each record would have the following characteristics:
First name
Last name
Age (0...100)
Gender (m or f)
Personal ID number (e.g. 8306112507)
Unique employee number (27560000…27569999)
Declare the variables needed to keep the information for a single employee using appropriate primitive data types. Use descriptive names. Print the data at the console.
 * */
$first_name = trim(fgets(STDIN));
$last_name = trim(fgets(STDIN));
$age = intval(trim(fgets(STDIN)));
$gender = trim(fgets(STDIN));
$id_num = trim(fgets(STDIN));
$employee_num = trim(fgets(STDIN));

$format =
'First name: %s
Last name: %s
Age: %d
Gender: %s
Personal ID number: %s
Unique employee number: %s';

echo sprintf($format, $first_name, $last_name, $age, $gender, $id_num, $employee_num);
