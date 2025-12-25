// Practice Problems Data Structure
export interface PracticeProblemData {
  id: string;
  slug: string;
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  starterCode: string;
  visibleTestCases: { input: string; expectedOutput: string }[];
  hiddenTestCases: { input: string; expectedOutput: string }[];
}

// Pattern 1: Ascending Numbers
export const patternAscendingNumbers: PracticeProblemData = {
  id: "pattern-ascending-numbers",
  slug: "ascending-numbers",
  title: "Print Ascending Numbers Pattern",
  description: `Print the following number pattern:

1
1 2
1 2 3
1 2 3 4
1 2 3 4 5

For a given number n, print n rows where the i-th row contains numbers from 1 to i.

This pattern helps you understand nested loops and sequence printing.`,
  inputFormat: "n (number of rows)",
  outputFormat: "Pattern with n rows, each row i containing numbers from 1 to i",
  constraints: "1 <= n <= 10",
  starterCode: `def print_pattern(n):
    # Your code here to print the ascending numbers pattern
    pass

# Read input
n = int(input())
print_pattern(n)`,
  visibleTestCases: [
    { input: "3", expectedOutput: "1\n1 2\n1 2 3" },
    { input: "5", expectedOutput: "1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5" }
  ],
  hiddenTestCases: [
    { input: "1", expectedOutput: "1" },
    { input: "2", expectedOutput: "1\n1 2" },
    { input: "4", expectedOutput: "1\n1 2\n1 2 3\n1 2 3 4" }
  ]
};

// Pattern 2: Descending Numbers
export const patternDescendingNumbers: PracticeProblemData = {
  id: "pattern-descending-numbers",
  slug: "descending-numbers",
  title: "Print Descending Numbers Pattern",
  description: `Print the following number pattern:

5 4 3 2 1
4 3 2 1
3 2 1
2 1
1

For a given number n, print n rows where the i-th row contains numbers from n-i+1 down to 1.

This pattern helps you understand reverse iteration and nested loops.`,
  inputFormat: "n (largest number to start with)",
  outputFormat: "Pattern with n rows, each row i containing numbers from n-i+1 down to 1",
  constraints: "1 <= n <= 10",
  starterCode: `def print_pattern(n):
    # Your code here to print the descending numbers pattern
    pass

# Read input
n = int(input())
print_pattern(n)`,
  visibleTestCases: [
    { input: "3", expectedOutput: "3 2 1\n2 1\n1" },
    { input: "5", expectedOutput: "5 4 3 2 1\n4 3 2 1\n3 2 1\n2 1\n1" }
  ],
  hiddenTestCases: [
    { input: "1", expectedOutput: "1" },
    { input: "2", expectedOutput: "2 1\n1" },
    { input: "4", expectedOutput: "4 3 2 1\n3 2 1\n2 1\n1" }
  ]
};

// Pattern 3: Left Aligned Stars
export const patternLeftStars: PracticeProblemData = {
  id: "pattern-left-stars",
  slug: "left-stars",
  title: "Print Left Aligned Stars Pattern",
  description: `Print the following star pattern:

*
* *
* * *
* * * *
* * * * *

For a given number n, print n rows where the i-th row contains i stars separated by spaces.

This pattern is perfect for understanding basic loop structures and formatting output.`,
  inputFormat: "n (number of rows)",
  outputFormat: "Pattern with n rows, each row i containing i stars separated by spaces",
  constraints: "1 <= n <= 10",
  starterCode: `def print_pattern(n):
    # Your code here to print the left aligned stars pattern
    pass

# Read input
n = int(input())
print_pattern(n)`,
  visibleTestCases: [
    { input: "3", expectedOutput: "*\n* *\n* * *" },
    { input: "5", expectedOutput: "*\n* *\n* * *\n* * * *\n* * * * *" }
  ],
  hiddenTestCases: [
    { input: "1", expectedOutput: "*" },
    { input: "2", expectedOutput: "*\n* *" },
    { input: "4", expectedOutput: "*\n* *\n* * *\n* * * *" }
  ]
};

// Pattern 4: Right Aligned Stars
export const patternRightStars: PracticeProblemData = {
  id: "pattern-right-stars",
  slug: "right-stars",
  title: "Print Right Aligned Stars Pattern",
  description: `Print the following star pattern:

* * * * *
* * * *
* * *
* *
*

For a given number n, print n rows where the i-th row contains n-i+1 stars separated by spaces.

This pattern helps you understand spacing, padding, and formatting output in different ways.`,
  inputFormat: "n (number of stars in the first row)",
  outputFormat: "Pattern with n rows, each row i containing n-i+1 stars separated by spaces",
  constraints: "1 <= n <= 10",
  starterCode: `def print_pattern(n):
    # Your code here to print the right aligned stars pattern
    pass

# Read input
n = int(input())
print_pattern(n)`,
  visibleTestCases: [
    { input: "3", expectedOutput: "* * *\n* *\n*" },
    { input: "5", expectedOutput: "* * * * *\n* * * *\n* * *\n* *\n*" }
  ],
  hiddenTestCases: [
    { input: "1", expectedOutput: "*" },
    { input: "2", expectedOutput: "* *\n*" },
    { input: "4", expectedOutput: "* * * *\n* * *\n* *\n*" }
  ]
};

// Prime Numbers Problem
export const primeNumbersProblem: PracticeProblemData = {
  id: "prime-numbers",
  slug: "prime-numbers",
  title: "Print Prime Numbers Before N",
  description: `Print all prime numbers before the given number n.

A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

For example:
- n = 10 → primes: 2, 3, 5, 7
- n = 15 → primes: 2, 3, 5, 7, 11, 13

Print the prime numbers separated by spaces.`,
  inputFormat: "n (find primes less than n)",
  outputFormat: "All prime numbers less than n, separated by spaces",
  constraints: "2 <= n <= 100",
  starterCode: `def is_prime(num):
    # Your code here to check if a number is prime
    pass

def print_primes(n):
    # Your code here to print all primes less than n
    pass

# Read input
n = int(input())
print_primes(n)`,
  visibleTestCases: [
    { input: "10", expectedOutput: "2 3 5 7" },
    { input: "15", expectedOutput: "2 3 5 7 11 13" }
  ],
  hiddenTestCases: [
    { input: "2", expectedOutput: "" },
    { input: "3", expectedOutput: "2" },
    { input: "5", expectedOutput: "2 3" },
    { input: "20", expectedOutput: "2 3 5 7 11 13 17 19" }
  ]
};

// Fibonacci Series Problem
export const fibonacciSeriesProblem: PracticeProblemData = {
  id: "fibonacci-series",
  slug: "fibonacci-series",
  title: "Generate Fibonacci Series",
  description: `Generate the Fibonacci series up to the nth number.

The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding ones.

For example:
- n = 5 → 0, 1, 1, 2, 3
- n = 8 → 0, 1, 1, 2, 3, 5, 8, 13

Print the series separated by spaces.`,
  inputFormat: "n (number of terms to generate)",
  outputFormat: "First n numbers of the Fibonacci series, separated by spaces",
  constraints: "1 <= n <= 20",
  starterCode: `def generate_fibonacci(n):
    # Your code here to generate the first n Fibonacci numbers
    pass

# Read input
n = int(input())
fib_series = generate_fibonacci(n)
print(" ".join(map(str, fib_series)))`,
  visibleTestCases: [
    { input: "5", expectedOutput: "0 1 1 2 3" },
    { input: "8", expectedOutput: "0 1 1 2 3 5 8 13" }
  ],
  hiddenTestCases: [
    { input: "1", expectedOutput: "0" },
    { input: "2", expectedOutput: "0 1" },
    { input: "3", expectedOutput: "0 1 1" },
    { input: "10", expectedOutput: "0 1 1 2 3 5 8 13 21 34" }
  ]
};

// Palindrome Check Problem
export const palindromeCheckProblem: PracticeProblemData = {
  id: "palindrome-check",
  slug: "palindrome-check",
  title: "Check Palindrome Number",
  description: `Check whether the given number is a palindrome or not.

A palindrome number reads the same forwards and backwards.

For example:
- 121 → True (reads the same forwards and backwards)
- 123 → False (reads differently: 123 vs 321)
- 7 → True (single digit numbers are palindromes)

Print "True" if palindrome, "False" otherwise.`,
  inputFormat: "n (number to check)",
  outputFormat: "True if the number is palindrome, False otherwise",
  constraints: "0 <= n <= 1000000",
  starterCode: `def is_palindrome(n):
    # Your code here to check if number is palindrome
    pass

# Read input
n = int(input())
print(is_palindrome(n))`,
  visibleTestCases: [
    { input: "121", expectedOutput: "True" },
    { input: "123", expectedOutput: "False" },
    { input: "7", expectedOutput: "True" }
  ],
  hiddenTestCases: [
    { input: "0", expectedOutput: "True" },
    { input: "11", expectedOutput: "True" },
    { input: "12", expectedOutput: "False" },
    { input: "1001", expectedOutput: "True" },
    { input: "12321", expectedOutput: "True" }
  ]
};

// Armstrong Number Problem
export const armstrongCheckProblem: PracticeProblemData = {
  id: "armstrong-check",
  slug: "armstrong-check",
  title: "Check Armstrong Number",
  description: `Check whether the given number is an Armstrong number or not.

An Armstrong number is a number that is equal to the sum of its digits raised to the power of the number of digits.

For example:
- 153 → 1³ + 5³ + 3³ = 1 + 125 + 27 = 153 ✓
- 370 → 3³ + 7³ + 0³ = 27 + 343 + 0 = 370 ✓
- 123 → 1³ + 2³ + 3³ = 1 + 8 + 27 = 36 ≠ 123 ✗

Print "True" if Armstrong number, "False" otherwise.`,
  inputFormat: "n (number to check)",
  outputFormat: "True if the number is Armstrong number, False otherwise",
  constraints: "0 <= n <= 1000000",
  starterCode: `def is_armstrong(n):
    # Your code here to check if number is Armstrong number
    pass

# Read input
n = int(input())
print(is_armstrong(n))`,
  visibleTestCases: [
    { input: "153", expectedOutput: "True" },
    { input: "370", expectedOutput: "True" },
    { input: "123", expectedOutput: "False" }
  ],
  hiddenTestCases: [
    { input: "0", expectedOutput: "True" },
    { input: "1", expectedOutput: "True" },
    { input: "407", expectedOutput: "True" },
    { input: "9474", expectedOutput: "True" },
    { input: "100", expectedOutput: "False" }
  ]
};

// Complete practice problems array
export const practiceProblemsData: PracticeProblemData[] = [
  patternAscendingNumbers,
  patternDescendingNumbers,
  patternLeftStars,
  patternRightStars,
  primeNumbersProblem,
  fibonacciSeriesProblem,
  palindromeCheckProblem,
  armstrongCheckProblem
];

// Get problem by slug
export const getPracticeProblemBySlug = (slug: string): PracticeProblemData | undefined => {
  return practiceProblemsData.find(problem => problem.slug === slug);
};

// Get problem by ID
export const getPracticeProblemById = (id: string): PracticeProblemData | undefined => {
  return practiceProblemsData.find(problem => problem.id === id);
};
