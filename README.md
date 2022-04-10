# Calc sheets for markdown files

Well actually its html table evaluation, but for my usecases it is
markdown converted to html. That means that the library can be used
in plain html-projects as well.

## Figure 1: Basic Example

| r   | amount | num | result                 |
| --- | ------ | --- | ---------------------- |
| 1   | 100    | 4   | = amount() * num() + 1 | 
| ... | 200    | 3   | ...                    |
|     | 300    | 1.5 |                        |

Will generate
| r   | amount | num | result                 |
| --- | ------ | --- | ---------------------- |
| 1   | 100    | 4   | 401                    |
| 2   | 200    | 3   | 601                    |
| 3   | 300    | 1.5 | 451                    |

## Figure 2: References to previous rows

| r   | amount | difference                   |
| --- | ------ | ---------------------------- |
| 1   | 100    | 0                            |
| ... | 200    | = amount() - amount(row - 1) | 
|     | 250    | ...                          |
|     | 275    |                              |

Generates

| r   | amount | difference                   |
| --- | ------ | ---------------------------- |
| 1   | 100    | 0                            |
| 2   | 200    | 100                          | 
| 3   | 250    | 50                           |
| 4   | 275    | 25                           |

## Figure 3: Cross references between tables
| r   | copied        | 
| --- | ------------- |
| 1   | = amount(row) |
| ... | ...           |

will create

| r   | copied        | 
| --- | ------------- |
| 1   | 100           |
| 2   | 200           |

## Figure 4: Evaluate from bottom upwards

| r   | amount | difference                   |
| --- | ------ | ---------------------------- |
| 1   | 100    | = amount() - amount(row + 1) |
| ... | 200    | ...                          | 
|     | 250    |                              |
|     | 275    | 0                            |

(Note that the evaluation is done to the cell below)

This yields

| r | amount | difference                   |
| - | ------ | ---------------------------- |
| 1 | 100    | -100                         |
| 2 | 200    | -50                          | 
| 3 | 250    | -25                          |
| 4 | 275    | 0                            |


## Figure 5: Recursive formulas

| r   | down                | up               |
| --- | ------------------- | ---------------- |
| 1   | 100                 | = up(row + 1) -1 |
| ... | = down(row - 1) + 1 | ...              |
|     | ...                 |                  |
|     |                     | 200              |

Will result in the following:

| r   | down | up  |
| --- | ---- | --- |
| 1   | 100  | 197 | 
| 2   | 101  | 198 |
| 3   | 102  | 199 |
| 4   | 103  | 200 |

## Syntax

| command     | meaning                                    | 
| ----------- | ------------------------------------------ |
| "="         | start formula in cell                      |
| "..."       | auto fill cell                             |
| row         | the current row nuber                      |
| columname() | insert value from column named "columname" |


