// Python Learning Track - 30 questions from beginner to advanced

import { ProblemData } from './problemsData';

export const pythonProblemsData: ProblemData[] = [
  // 🟢 Beginner Level (1-10)
  {
    id: "python-sum-two-numbers",
    slug: "sum-two-numbers",
    title: "Print the Sum of Two Numbers",
    category: "Python Track",
    difficulty: "easy",
    description: `Given two integers, return their sum.

**Example:** Given a = 5 and b = 3, return 8 because 5 + 3 = 8.

This is a basic problem to get started with Python programming. Simply add the two numbers together.`,
    inputFormat: "def sumTwoNumbers(a: int, b: int) -> int:",
    outputFormat: "Return the sum of a and b.",
    constraints: "-10^9 <= a, b <= 10^9",
    starterCode: `def sumTwoNumbers(a: int, b: int) -> int:
    # Your code here
    pass

# Read input
a, b = map(int, input().split())
print(sumTwoNumbers(a, b))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "5 3", expectedOutput: "8" },
      { input: "10 20", expectedOutput: "30" },
      { input: "-5 5", expectedOutput: "0" }
    ],
    hiddenTestCases: [
      { input: "0 0", expectedOutput: "0" },
      { input: "1000000000 1000000000", expectedOutput: "2000000000" },
      { input: "-100 -200", expectedOutput: "-300" },
      { input: "1 -1", expectedOutput: "0" },
      { input: "999 1", expectedOutput: "1000" }
    ]
  },
  {
    id: "python-even-odd",
    slug: "check-even-odd",
    title: "Check Even or Odd",
    category: "Python Track",
    difficulty: "easy",
    description: `Determine whether a number is even or odd.

**Example:** Given n = 4, return "Even" because 4 is divisible by 2.

Use the modulo operator (%) to check if a number is divisible by 2.`,
    inputFormat: "def checkEvenOdd(n: int) -> str:",
    outputFormat: "Return 'Even' if n is even, 'Odd' otherwise.",
    constraints: "-10^9 <= n <= 10^9",
    starterCode: `def checkEvenOdd(n: int) -> str:
    # Your code here
    pass

# Read input
n = int(input())
print(checkEvenOdd(n))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "4", expectedOutput: "Even" },
      { input: "7", expectedOutput: "Odd" },
      { input: "0", expectedOutput: "Even" }
    ],
    hiddenTestCases: [
      { input: "-2", expectedOutput: "Even" },
      { input: "-3", expectedOutput: "Odd" },
      { input: "1000000000", expectedOutput: "Even" },
      { input: "999999999", expectedOutput: "Odd" },
      { input: "1", expectedOutput: "Odd" }
    ]
  },
  {
    id: "python-largest-of-three",
    slug: "largest-of-three",
    title: "Find the Largest of Three Numbers",
    category: "Python Track",
    difficulty: "easy",
    description: `Return the maximum among three integers.

**Example:** Given a = 5, b = 9, c = 3, return 9 because 9 is the largest.

You can use conditional statements or Python's built-in max() function.`,
    inputFormat: "def largestOfThree(a: int, b: int, c: int) -> int:",
    outputFormat: "Return the largest of the three numbers.",
    constraints: "-10^9 <= a, b, c <= 10^9",
    starterCode: `def largestOfThree(a: int, b: int, c: int) -> int:
    # Your code here
    pass

# Read input
a, b, c = map(int, input().split())
print(largestOfThree(a, b, c))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "5 9 3", expectedOutput: "9" },
      { input: "1 1 1", expectedOutput: "1" },
      { input: "-5 -2 -8", expectedOutput: "-2" }
    ],
    hiddenTestCases: [
      { input: "100 200 150", expectedOutput: "200" },
      { input: "0 0 1", expectedOutput: "1" },
      { input: "-1 -1 -1", expectedOutput: "-1" },
      { input: "999 1000 998", expectedOutput: "1000" },
      { input: "5 5 3", expectedOutput: "5" }
    ]
  },
  {
    id: "python-count-vowels",
    slug: "count-vowels",
    title: "Count Vowels in a String",
    category: "Python Track",
    difficulty: "easy",
    description: `Return the number of vowels (a, e, i, o, u) in a given string.

**Example:** Given s = "hello", return 2 because there are 2 vowels (e, o).

Iterate through each character and check if it's a vowel. Remember to handle both uppercase and lowercase.`,
    inputFormat: "def countVowels(s: str) -> int:",
    outputFormat: "Return the count of vowels in s.",
    constraints: "1 <= len(s) <= 10^5\ns contains only printable ASCII characters",
    starterCode: `def countVowels(s: str) -> int:
    # Your code here
    pass

# Read input
s = input()
print(countVowels(s))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "hello", expectedOutput: "2" },
      { input: "AEIOU", expectedOutput: "5" },
      { input: "xyz", expectedOutput: "0" }
    ],
    hiddenTestCases: [
      { input: "Programming", expectedOutput: "3" },
      { input: "aaa", expectedOutput: "3" },
      { input: "bcdfg", expectedOutput: "0" },
      { input: "AeIoU", expectedOutput: "5" },
      { input: "Hello World", expectedOutput: "3" }
    ]
  },
  {
    id: "python-reverse-string",
    slug: "reverse-string-manual",
    title: "Reverse a String Without Using Reverse Function",
    category: "Python Track",
    difficulty: "easy",
    description: `Implement manual string reversal without using the built-in reverse() or [::-1].

**Example:** Given s = "hello", return "olleh".

Use a loop to build the reversed string character by character.`,
    inputFormat: "def reverseString(s: str) -> str:",
    outputFormat: "Return the reversed string.",
    constraints: "1 <= len(s) <= 10^5",
    starterCode: `def reverseString(s: str) -> str:
    # Your code here - don't use reverse() or [::-1]
    pass

# Read input
s = input()
print(reverseString(s))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "Python", expectedOutput: "nohtyP" },
      { input: "a", expectedOutput: "a" }
    ],
    hiddenTestCases: [
      { input: "abcdef", expectedOutput: "fedcba" },
      { input: "12345", expectedOutput: "54321" },
      { input: "aa", expectedOutput: "aa" },
      { input: "racecar", expectedOutput: "racecar" },
      { input: "Hello World", expectedOutput: "dlroW olleH" }
    ]
  },
  {
    id: "python-sum-of-digits",
    slug: "sum-of-digits",
    title: "Sum of Digits of a Number",
    category: "Python Track",
    difficulty: "easy",
    description: `Given an integer, return the sum of its digits.

**Example:** Given n = 123, return 6 because 1 + 2 + 3 = 6.

Handle negative numbers by taking the absolute value first.`,
    inputFormat: "def sumOfDigits(n: int) -> int:",
    outputFormat: "Return the sum of digits of n.",
    constraints: "-10^9 <= n <= 10^9",
    starterCode: `def sumOfDigits(n: int) -> int:
    # Your code here
    pass

# Read input
n = int(input())
print(sumOfDigits(n))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "123", expectedOutput: "6" },
      { input: "999", expectedOutput: "27" },
      { input: "-456", expectedOutput: "15" }
    ],
    hiddenTestCases: [
      { input: "0", expectedOutput: "0" },
      { input: "1000000000", expectedOutput: "1" },
      { input: "111111111", expectedOutput: "9" },
      { input: "-1", expectedOutput: "1" },
      { input: "5", expectedOutput: "5" }
    ]
  },
  {
    id: "python-factorial-iterative",
    slug: "factorial-iterative",
    title: "Factorial of a Number (Iterative)",
    category: "Python Track",
    difficulty: "easy",
    description: `Compute factorial using loops (not recursion).

**Example:** Given n = 5, return 120 because 5! = 5 × 4 × 3 × 2 × 1 = 120.

Use a loop to multiply numbers from 1 to n.`,
    inputFormat: "def factorial(n: int) -> int:",
    outputFormat: "Return n! (factorial of n).",
    constraints: "0 <= n <= 20",
    starterCode: `def factorial(n: int) -> int:
    # Your code here - use loops, not recursion
    pass

# Read input
n = int(input())
print(factorial(n))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "5", expectedOutput: "120" },
      { input: "0", expectedOutput: "1" },
      { input: "10", expectedOutput: "3628800" }
    ],
    hiddenTestCases: [
      { input: "1", expectedOutput: "1" },
      { input: "3", expectedOutput: "6" },
      { input: "7", expectedOutput: "5040" },
      { input: "12", expectedOutput: "479001600" },
      { input: "15", expectedOutput: "1307674368000" }
    ]
  },
  {
    id: "python-fibonacci",
    slug: "fibonacci-series",
    title: "Fibonacci Series up to N Terms",
    category: "Python Track",
    difficulty: "easy",
    description: `Print Fibonacci sequence until N terms.

**Example:** Given n = 7, print "0 1 1 2 3 5 8".

Each number is the sum of the two preceding ones, starting from 0 and 1.`,
    inputFormat: "def fibonacci(n: int) -> str:",
    outputFormat: "Return a space-separated string of the first n Fibonacci numbers.",
    constraints: "1 <= n <= 30",
    starterCode: `def fibonacci(n: int) -> str:
    # Your code here
    pass

# Read input
n = int(input())
print(fibonacci(n))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "7", expectedOutput: "0 1 1 2 3 5 8" },
      { input: "1", expectedOutput: "0" },
      { input: "5", expectedOutput: "0 1 1 2 3" }
    ],
    hiddenTestCases: [
      { input: "2", expectedOutput: "0 1" },
      { input: "10", expectedOutput: "0 1 1 2 3 5 8 13 21 34" },
      { input: "3", expectedOutput: "0 1 1" },
      { input: "8", expectedOutput: "0 1 1 2 3 5 8 13" },
      { input: "15", expectedOutput: "0 1 1 2 3 5 8 13 21 34 55 89 144 233 377" }
    ]
  },
  {
    id: "python-palindrome-check",
    slug: "string-palindrome-check",
    title: "Check if a String is Palindrome",
    category: "Python Track",
    difficulty: "easy",
    description: `Return True if the string reads the same forward and backward.

**Example:** Given s = "racecar", return True because it's the same forwards and backwards.

Compare characters from both ends moving towards the center.`,
    inputFormat: "def isPalindrome(s: str) -> bool:",
    outputFormat: "Return True if s is a palindrome, False otherwise.",
    constraints: "1 <= len(s) <= 10^5\ns contains only lowercase letters",
    starterCode: `def isPalindrome(s: str) -> bool:
    # Your code here
    pass

# Read input
s = input()
print(isPalindrome(s))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "racecar", expectedOutput: "True" },
      { input: "hello", expectedOutput: "False" },
      { input: "a", expectedOutput: "True" }
    ],
    hiddenTestCases: [
      { input: "madam", expectedOutput: "True" },
      { input: "ab", expectedOutput: "False" },
      { input: "aa", expectedOutput: "True" },
      { input: "abcba", expectedOutput: "True" },
      { input: "abcd", expectedOutput: "False" }
    ]
  },
  {
    id: "python-second-largest",
    slug: "second-largest-number",
    title: "Find the Second Largest Number in a List",
    category: "Python Track",
    difficulty: "easy",
    description: `Find the second largest number in a list, handling duplicates properly.

**Example:** Given nums = [3, 5, 5, 2, 1], return 3 because 5 is the largest and 3 is the second largest unique value.

First find unique values, then find the second maximum.`,
    inputFormat: "def secondLargest(nums: List[int]) -> int:",
    outputFormat: "Return the second largest unique number.",
    constraints: "2 <= len(nums) <= 10^5\n-10^9 <= nums[i] <= 10^9\nThere are at least 2 distinct values",
    starterCode: `from typing import List

def secondLargest(nums: List[int]) -> int:
    # Your code here
    pass

# Read input
nums = list(map(int, input().split()))
print(secondLargest(nums))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "3 5 5 2 1", expectedOutput: "3" },
      { input: "10 20 30", expectedOutput: "20" },
      { input: "1 2", expectedOutput: "1" }
    ],
    hiddenTestCases: [
      { input: "5 5 5 4", expectedOutput: "4" },
      { input: "-1 -2 -3", expectedOutput: "-2" },
      { input: "100 99 100 98", expectedOutput: "99" },
      { input: "1 1 2 2 3 3", expectedOutput: "2" },
      { input: "0 1", expectedOutput: "0" }
    ]
  },

  // 🟡 Intermediate Level (11-20)
  {
    id: "python-remove-duplicates",
    slug: "remove-duplicates-no-set",
    title: "Remove Duplicates from a List Without Using Set",
    category: "Python Track",
    difficulty: "medium",
    description: `Remove duplicates from a list while preserving order, without using set().

**Example:** Given nums = [1, 2, 2, 3, 1, 4], return [1, 2, 3, 4].

Iterate through the list and only add elements not already in the result.`,
    inputFormat: "def removeDuplicates(nums: List[int]) -> List[int]:",
    outputFormat: "Return a list with duplicates removed, preserving order.",
    constraints: "1 <= len(nums) <= 10^4\n-10^9 <= nums[i] <= 10^9",
    starterCode: `from typing import List

def removeDuplicates(nums: List[int]) -> List[int]:
    # Your code here - don't use set()
    pass

# Read input
nums = list(map(int, input().split()))
result = removeDuplicates(nums)
print(" ".join(map(str, result)))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "1 2 2 3 1 4", expectedOutput: "1 2 3 4" },
      { input: "5 5 5 5", expectedOutput: "5" },
      { input: "1 2 3", expectedOutput: "1 2 3" }
    ],
    hiddenTestCases: [
      { input: "1", expectedOutput: "1" },
      { input: "1 1", expectedOutput: "1" },
      { input: "3 2 1 3 2 1", expectedOutput: "3 2 1" },
      { input: "0 0 0 1 1 1", expectedOutput: "0 1" },
      { input: "-1 -1 0 0 1 1", expectedOutput: "-1 0 1" }
    ]
  },
  {
    id: "python-char-frequency",
    slug: "character-frequency",
    title: "Count Frequency of Each Character in a String",
    category: "Python Track",
    difficulty: "medium",
    description: `Output dictionary of char → frequency.

**Example:** Given s = "hello", return h:1 e:1 l:2 o:1.

Use a dictionary to count occurrences of each character.`,
    inputFormat: "def charFrequency(s: str) -> dict:",
    outputFormat: "Return frequency count, output sorted alphabetically.",
    constraints: "1 <= len(s) <= 10^5\ns contains only lowercase letters",
    starterCode: `def charFrequency(s: str) -> dict:
    # Your code here
    pass

# Read input
s = input()
freq = charFrequency(s)
for char in sorted(freq.keys()):
    print(f"{char}:{freq[char]}")`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "hello", expectedOutput: "e:1\nh:1\nl:2\no:1" },
      { input: "aaa", expectedOutput: "a:3" },
      { input: "abc", expectedOutput: "a:1\nb:1\nc:1" }
    ],
    hiddenTestCases: [
      { input: "abba", expectedOutput: "a:2\nb:2" },
      { input: "programming", expectedOutput: "a:1\ng:2\ni:1\nm:2\nn:1\no:1\np:1\nr:2" },
      { input: "zzz", expectedOutput: "z:3" },
      { input: "a", expectedOutput: "a:1" },
      { input: "mississippi", expectedOutput: "i:4\nm:1\np:2\ns:4" }
    ]
  },
  {
    id: "python-list-intersection",
    slug: "list-intersection",
    title: "Find the Intersection of Two Lists",
    category: "Python Track",
    difficulty: "medium",
    description: `Find common elements between two lists without using built-in set intersection.

**Example:** Given list1 = [1, 2, 3, 4] and list2 = [3, 4, 5, 6], return [3, 4].

Iterate through one list and check if each element exists in the other.`,
    inputFormat: "def intersection(list1: List[int], list2: List[int]) -> List[int]:",
    outputFormat: "Return sorted list of common elements without duplicates.",
    constraints: "1 <= len(list1), len(list2) <= 10^4",
    starterCode: `from typing import List

def intersection(list1: List[int], list2: List[int]) -> List[int]:
    # Your code here - don't use set intersection
    pass

# Read input
list1 = list(map(int, input().split()))
list2 = list(map(int, input().split()))
result = intersection(list1, list2)
print(" ".join(map(str, result)) if result else "empty")`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "1 2 3 4\n3 4 5 6", expectedOutput: "3 4" },
      { input: "1 2 3\n4 5 6", expectedOutput: "empty" },
      { input: "1 1 2 2\n2 2 3 3", expectedOutput: "2" }
    ],
    hiddenTestCases: [
      { input: "5\n5", expectedOutput: "5" },
      { input: "1 2 3\n1 2 3", expectedOutput: "1 2 3" },
      { input: "10 20 30\n15 25 35", expectedOutput: "empty" },
      { input: "-1 0 1\n0 1 2", expectedOutput: "0 1" },
      { input: "1 1 1 1\n1 1 1 1", expectedOutput: "1" }
    ]
  },
  {
    id: "python-anagram-check",
    slug: "anagram-check",
    title: "Check if Two Strings are Anagrams",
    category: "Python Track",
    difficulty: "medium",
    description: `Check if two strings are anagrams (case-insensitive comparison).

**Example:** Given s1 = "Listen" and s2 = "Silent", return True.

Two strings are anagrams if they contain the same characters with the same frequencies.`,
    inputFormat: "def areAnagrams(s1: str, s2: str) -> bool:",
    outputFormat: "Return True if s1 and s2 are anagrams, False otherwise.",
    constraints: "1 <= len(s1), len(s2) <= 10^5\nStrings contain only letters",
    starterCode: `def areAnagrams(s1: str, s2: str) -> bool:
    # Your code here - case insensitive
    pass

# Read input
s1 = input()
s2 = input()
print(areAnagrams(s1, s2))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "Listen\nSilent", expectedOutput: "True" },
      { input: "Hello\nWorld", expectedOutput: "False" },
      { input: "Dormitory\nDirtyroom", expectedOutput: "True" }
    ],
    hiddenTestCases: [
      { input: "a\nA", expectedOutput: "True" },
      { input: "ab\nba", expectedOutput: "True" },
      { input: "abc\nabc", expectedOutput: "True" },
      { input: "abc\nab", expectedOutput: "False" },
      { input: "AABB\nbbaa", expectedOutput: "True" }
    ]
  },
  {
    id: "python-move-zeroes",
    slug: "move-zeroes",
    title: "Move All Zeroes to End of List",
    category: "Python Track",
    difficulty: "medium",
    description: `Move all zeroes to the end while preserving relative order of non-zero elements.

**Example:** Given nums = [0, 1, 0, 3, 12], return [1, 3, 12, 0, 0].

Use two-pointer technique to efficiently swap elements.`,
    inputFormat: "def moveZeroes(nums: List[int]) -> List[int]:",
    outputFormat: "Return the list with zeroes moved to the end.",
    constraints: "1 <= len(nums) <= 10^4\n-10^9 <= nums[i] <= 10^9",
    starterCode: `from typing import List

def moveZeroes(nums: List[int]) -> List[int]:
    # Your code here
    pass

# Read input
nums = list(map(int, input().split()))
result = moveZeroes(nums)
print(" ".join(map(str, result)))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "0 1 0 3 12", expectedOutput: "1 3 12 0 0" },
      { input: "0 0 0", expectedOutput: "0 0 0" },
      { input: "1 2 3", expectedOutput: "1 2 3" }
    ],
    hiddenTestCases: [
      { input: "0", expectedOutput: "0" },
      { input: "1", expectedOutput: "1" },
      { input: "0 1", expectedOutput: "1 0" },
      { input: "1 0", expectedOutput: "1 0" },
      { input: "4 0 5 0 6 0", expectedOutput: "4 5 6 0 0 0" }
    ]
  },
  {
    id: "python-pair-sum",
    slug: "unique-pairs-sum",
    title: "Find All Unique Pairs That Sum to Target",
    category: "Python Track",
    difficulty: "medium",
    description: `Return all unique pairs (a, b) where a + b = target.

**Example:** Given nums = [1, 2, 3, 4, 5] and target = 6, return [(1,5), (2,4)].

Use a hash set to find complements efficiently.`,
    inputFormat: "def findPairs(nums: List[int], target: int) -> List[tuple]:",
    outputFormat: "Return sorted list of unique pairs, each pair sorted (smaller, larger).",
    constraints: "1 <= len(nums) <= 10^4\n-10^9 <= nums[i], target <= 10^9",
    starterCode: `from typing import List

def findPairs(nums: List[int], target: int) -> List[tuple]:
    # Your code here
    pass

# Read input
nums = list(map(int, input().split()))
target = int(input())
result = findPairs(nums, target)
for pair in result:
    print(pair[0], pair[1])
if not result:
    print("none")`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "1 2 3 4 5\n6", expectedOutput: "1 5\n2 4" },
      { input: "1 1 1 1\n2", expectedOutput: "1 1" },
      { input: "1 2 3\n10", expectedOutput: "none" }
    ],
    hiddenTestCases: [
      { input: "0 0\n0", expectedOutput: "0 0" },
      { input: "-1 1 0\n0", expectedOutput: "-1 1" },
      { input: "5 5 5 5\n10", expectedOutput: "5 5" },
      { input: "1 2\n3", expectedOutput: "1 2" },
      { input: "1 2 3 4 5 6 7 8 9 10\n11", expectedOutput: "1 10\n2 9\n3 8\n4 7\n5 6" }
    ]
  },
  {
    id: "python-rotate-list",
    slug: "rotate-list-right",
    title: "Rotate a List K Steps to the Right",
    category: "Python Track",
    difficulty: "medium",
    description: `Rotate a list k steps to the right, handling k > length properly.

**Example:** Given nums = [1, 2, 3, 4, 5] and k = 2, return [4, 5, 1, 2, 3].

Use k % len(nums) to handle large k values.`,
    inputFormat: "def rotateRight(nums: List[int], k: int) -> List[int]:",
    outputFormat: "Return the rotated list.",
    constraints: "1 <= len(nums) <= 10^5\n0 <= k <= 10^9",
    starterCode: `from typing import List

def rotateRight(nums: List[int], k: int) -> List[int]:
    # Your code here
    pass

# Read input
nums = list(map(int, input().split()))
k = int(input())
result = rotateRight(nums, k)
print(" ".join(map(str, result)))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "1 2 3 4 5\n2", expectedOutput: "4 5 1 2 3" },
      { input: "1 2 3\n0", expectedOutput: "1 2 3" },
      { input: "1 2\n3", expectedOutput: "2 1" }
    ],
    hiddenTestCases: [
      { input: "1\n100", expectedOutput: "1" },
      { input: "1 2 3 4 5\n5", expectedOutput: "1 2 3 4 5" },
      { input: "1 2 3 4 5\n7", expectedOutput: "4 5 1 2 3" },
      { input: "1 2 3\n1", expectedOutput: "3 1 2" },
      { input: "5 4 3 2 1\n3", expectedOutput: "3 2 1 5 4" }
    ]
  },
  {
    id: "python-longest-word",
    slug: "longest-word",
    title: "Find the Longest Word in a Sentence",
    category: "Python Track",
    difficulty: "medium",
    description: `Return the longest word in a sentence along with its length.

**Example:** Given s = "The quick brown fox", return "quick 5".

Split the sentence by spaces and find the word with maximum length.`,
    inputFormat: "def longestWord(s: str) -> tuple:",
    outputFormat: "Return the longest word and its length (word, length). If tie, return first occurrence.",
    constraints: "1 <= len(s) <= 10^5\nSentence contains letters and spaces only",
    starterCode: `def longestWord(s: str) -> tuple:
    # Your code here
    pass

# Read input
s = input()
word, length = longestWord(s)
print(f"{word} {length}")`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "The quick brown fox", expectedOutput: "quick 5" },
      { input: "Hello", expectedOutput: "Hello 5" },
      { input: "a bb ccc", expectedOutput: "ccc 3" }
    ],
    hiddenTestCases: [
      { input: "I am", expectedOutput: "am 2" },
      { input: "abc abc abc", expectedOutput: "abc 3" },
      { input: "Programming is fun", expectedOutput: "Programming 11" },
      { input: "a", expectedOutput: "a 1" },
      { input: "one two six", expectedOutput: "one 3" }
    ]
  },
  {
    id: "python-perfect-number",
    slug: "perfect-number",
    title: "Check if a Number is a Perfect Number",
    category: "Python Track",
    difficulty: "medium",
    description: `A perfect number equals the sum of its proper divisors (excluding itself).

**Example:** 6 is perfect because 1 + 2 + 3 = 6.

Find all divisors up to sqrt(n) and check if their sum equals n.`,
    inputFormat: "def isPerfectNumber(n: int) -> bool:",
    outputFormat: "Return True if n is a perfect number, False otherwise.",
    constraints: "1 <= n <= 10^8",
    starterCode: `def isPerfectNumber(n: int) -> bool:
    # Your code here
    pass

# Read input
n = int(input())
print(isPerfectNumber(n))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "6", expectedOutput: "True" },
      { input: "28", expectedOutput: "True" },
      { input: "12", expectedOutput: "False" }
    ],
    hiddenTestCases: [
      { input: "1", expectedOutput: "False" },
      { input: "496", expectedOutput: "True" },
      { input: "8128", expectedOutput: "True" },
      { input: "100", expectedOutput: "False" },
      { input: "2", expectedOutput: "False" }
    ]
  },
  {
    id: "python-pascal-triangle",
    slug: "pascal-triangle",
    title: "Generate Pascal's Triangle (First N Rows)",
    category: "Python Track",
    difficulty: "medium",
    description: `Generate the first N rows of Pascal's Triangle.

**Example:** Given n = 5, output:
1
1 1
1 2 1
1 3 3 1
1 4 6 4 1

Each number is the sum of the two numbers above it.`,
    inputFormat: "def pascalTriangle(n: int) -> List[List[int]]:",
    outputFormat: "Return list of rows, each row as a list of integers.",
    constraints: "1 <= n <= 20",
    starterCode: `from typing import List

def pascalTriangle(n: int) -> List[List[int]]:
    # Your code here
    pass

# Read input
n = int(input())
triangle = pascalTriangle(n)
for row in triangle:
    print(" ".join(map(str, row)))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "5", expectedOutput: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1" },
      { input: "1", expectedOutput: "1" },
      { input: "3", expectedOutput: "1\n1 1\n1 2 1" }
    ],
    hiddenTestCases: [
      { input: "2", expectedOutput: "1\n1 1" },
      { input: "4", expectedOutput: "1\n1 1\n1 2 1\n1 3 3 1" },
      { input: "6", expectedOutput: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n1 5 10 10 5 1" },
      { input: "7", expectedOutput: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n1 5 10 10 5 1\n1 6 15 20 15 6 1" },
      { input: "8", expectedOutput: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n1 5 10 10 5 1\n1 6 15 20 15 6 1\n1 7 21 35 35 21 7 1" }
    ]
  },

  // 🔴 Advanced Level (21-30)
  {
    id: "python-binary-search",
    slug: "binary-search-iterative",
    title: "Implement Binary Search (Iterative)",
    category: "Python Track",
    difficulty: "hard",
    description: `Implement binary search to find target in a sorted array. Return index or -1.

**Example:** Given nums = [1, 2, 3, 4, 5] and target = 3, return 2.

Maintain left and right pointers, checking the middle element each iteration.`,
    inputFormat: "def binarySearch(nums: List[int], target: int) -> int:",
    outputFormat: "Return index of target or -1 if not found.",
    constraints: "1 <= len(nums) <= 10^5\nArray is sorted in ascending order",
    starterCode: `from typing import List

def binarySearch(nums: List[int], target: int) -> int:
    # Your code here - use iterative approach
    pass

# Read input
nums = list(map(int, input().split()))
target = int(input())
print(binarySearch(nums, target))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "1 2 3 4 5\n3", expectedOutput: "2" },
      { input: "1 2 3 4 5\n6", expectedOutput: "-1" },
      { input: "1\n1", expectedOutput: "0" }
    ],
    hiddenTestCases: [
      { input: "1 3 5 7 9\n1", expectedOutput: "0" },
      { input: "1 3 5 7 9\n9", expectedOutput: "4" },
      { input: "2 4 6 8 10\n5", expectedOutput: "-1" },
      { input: "1 1 1 1 1\n1", expectedOutput: "2" },
      { input: "-5 -3 -1 0 2 4\n-1", expectedOutput: "2" }
    ]
  },
  {
    id: "python-missing-number",
    slug: "missing-number-sequence",
    title: "Find the Missing Number in 1 to N Sequence",
    category: "Python Track",
    difficulty: "hard",
    description: `Given a list of numbers from 1 to N with one missing, find the missing number.

**Example:** Given nums = [1, 2, 4, 5], return 3.

Use the formula n*(n+1)/2 to find expected sum, then subtract actual sum.`,
    inputFormat: "def findMissing(nums: List[int]) -> int:",
    outputFormat: "Return the missing number.",
    constraints: "1 <= len(nums) <= 10^5\nExactly one number is missing",
    starterCode: `from typing import List

def findMissing(nums: List[int]) -> int:
    # Your code here
    pass

# Read input
nums = list(map(int, input().split()))
print(findMissing(nums))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "1 2 4 5", expectedOutput: "3" },
      { input: "2 3 4 5", expectedOutput: "1" },
      { input: "1 2 3 4", expectedOutput: "5" }
    ],
    hiddenTestCases: [
      { input: "1", expectedOutput: "2" },
      { input: "2", expectedOutput: "1" },
      { input: "1 3", expectedOutput: "2" },
      { input: "1 2 3 5 6 7 8 9 10", expectedOutput: "4" },
      { input: "2 3 4 5 6 7 8 9 10", expectedOutput: "1" }
    ]
  },
  {
    id: "python-valid-brackets",
    slug: "valid-brackets",
    title: "Check if Brackets Are Valid",
    category: "Python Track",
    difficulty: "hard",
    description: `Determine if a string of brackets is valid using stack logic.

**Example:** Given s = "()[]{}", return True. Given s = "([)]", return False.

Use a stack to match opening and closing brackets.`,
    inputFormat: "def isValidBrackets(s: str) -> bool:",
    outputFormat: "Return True if brackets are valid, False otherwise.",
    constraints: "1 <= len(s) <= 10^4\ns contains only ()[]{}",
    starterCode: `def isValidBrackets(s: str) -> bool:
    # Your code here
    pass

# Read input
s = input()
print(isValidBrackets(s))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "()[]{}", expectedOutput: "True" },
      { input: "([)]", expectedOutput: "False" },
      { input: "{[]}", expectedOutput: "True" }
    ],
    hiddenTestCases: [
      { input: "(", expectedOutput: "False" },
      { input: ")", expectedOutput: "False" },
      { input: "(())", expectedOutput: "True" },
      { input: "((()))", expectedOutput: "True" },
      { input: "([]{})", expectedOutput: "True" }
    ]
  },
  {
    id: "python-first-non-repeating",
    slug: "first-non-repeating-char",
    title: "Find the First Non-Repeating Character in a String",
    category: "Python Track",
    difficulty: "hard",
    description: `Return the index of the first character that doesn't repeat, or -1.

**Example:** Given s = "leetcode", return 0 ('l' is first non-repeating).

Count frequencies, then find the first character with count 1.`,
    inputFormat: "def firstNonRepeating(s: str) -> int:",
    outputFormat: "Return index of first non-repeating character or -1.",
    constraints: "1 <= len(s) <= 10^5\ns contains only lowercase letters",
    starterCode: `def firstNonRepeating(s: str) -> int:
    # Your code here
    pass

# Read input
s = input()
print(firstNonRepeating(s))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "leetcode", expectedOutput: "0" },
      { input: "loveleetcode", expectedOutput: "2" },
      { input: "aabb", expectedOutput: "-1" }
    ],
    hiddenTestCases: [
      { input: "a", expectedOutput: "0" },
      { input: "aa", expectedOutput: "-1" },
      { input: "abcabc", expectedOutput: "-1" },
      { input: "abcab", expectedOutput: "4" },
      { input: "z", expectedOutput: "0" }
    ]
  },
  {
    id: "python-longest-common-prefix",
    slug: "longest-common-prefix",
    title: "Longest Common Prefix Among Strings",
    category: "Python Track",
    difficulty: "hard",
    description: `Find the longest common prefix among an array of strings.

**Example:** Given strs = ["flower", "flow", "flight"], return "fl".

Compare characters position by position across all strings.`,
    inputFormat: "def longestCommonPrefix(strs: List[str]) -> str:",
    outputFormat: "Return the longest common prefix or empty string.",
    constraints: "1 <= len(strs) <= 200\n0 <= len(strs[i]) <= 200",
    starterCode: `from typing import List

def longestCommonPrefix(strs: List[str]) -> str:
    # Your code here
    pass

# Read input
strs = input().split()
result = longestCommonPrefix(strs)
print(result if result else "empty")`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "flower flow flight", expectedOutput: "fl" },
      { input: "dog racecar car", expectedOutput: "empty" },
      { input: "abc abc abc", expectedOutput: "abc" }
    ],
    hiddenTestCases: [
      { input: "a", expectedOutput: "a" },
      { input: "a b c", expectedOutput: "empty" },
      { input: "prefix prefixes pre", expectedOutput: "pre" },
      { input: "aa aaa aaaa", expectedOutput: "aa" },
      { input: "interspecies interstellar interstate", expectedOutput: "inters" }
    ]
  },
  {
    id: "python-bubble-sort",
    slug: "bubble-sort",
    title: "Sort a List Using Bubble Sort",
    category: "Python Track",
    difficulty: "hard",
    description: `Implement bubble sort manually.

**Example:** Given nums = [5, 3, 8, 1, 2], return [1, 2, 3, 5, 8].

Repeatedly swap adjacent elements if they're in wrong order.`,
    inputFormat: "def bubbleSort(nums: List[int]) -> List[int]:",
    outputFormat: "Return the sorted list.",
    constraints: "1 <= len(nums) <= 10^3\n-10^9 <= nums[i] <= 10^9",
    starterCode: `from typing import List

def bubbleSort(nums: List[int]) -> List[int]:
    # Your code here - implement bubble sort
    pass

# Read input
nums = list(map(int, input().split()))
result = bubbleSort(nums)
print(" ".join(map(str, result)))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "5 3 8 1 2", expectedOutput: "1 2 3 5 8" },
      { input: "1 2 3", expectedOutput: "1 2 3" },
      { input: "3 2 1", expectedOutput: "1 2 3" }
    ],
    hiddenTestCases: [
      { input: "1", expectedOutput: "1" },
      { input: "2 1", expectedOutput: "1 2" },
      { input: "-3 -1 -2", expectedOutput: "-3 -2 -1" },
      { input: "5 5 5", expectedOutput: "5 5 5" },
      { input: "9 7 5 3 1", expectedOutput: "1 3 5 7 9" }
    ]
  },
  {
    id: "python-power-recursive",
    slug: "power-recursive",
    title: "Calculate Power (x^n) Using Recursion",
    category: "Python Track",
    difficulty: "hard",
    description: `Calculate x raised to power n using recursion. No built-in power allowed.

**Example:** Given x = 2, n = 10, return 1024.

Use the property: x^n = x^(n/2) * x^(n/2) for even n.`,
    inputFormat: "def power(x: float, n: int) -> float:",
    outputFormat: "Return x^n as float.",
    constraints: "-100 <= x <= 100\n-30 <= n <= 30",
    starterCode: `def power(x: float, n: int) -> float:
    # Your code here - use recursion, not ** or pow()
    pass

# Read input
x = float(input())
n = int(input())
result = power(x, n)
print(f"{result:.5f}")`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "2.0\n10", expectedOutput: "1024.00000" },
      { input: "2.0\n-2", expectedOutput: "0.25000" },
      { input: "3.0\n3", expectedOutput: "27.00000" }
    ],
    hiddenTestCases: [
      { input: "2.0\n0", expectedOutput: "1.00000" },
      { input: "1.0\n100", expectedOutput: "1.00000" },
      { input: "0.5\n2", expectedOutput: "0.25000" },
      { input: "5.0\n1", expectedOutput: "5.00000" },
      { input: "-2.0\n3", expectedOutput: "-8.00000" }
    ]
  },
  {
    id: "python-majority-element",
    slug: "majority-element",
    title: "Find Majority Element (> n/2 Times)",
    category: "Python Track",
    difficulty: "hard",
    description: `Find the element that appears more than n/2 times.

**Example:** Given nums = [3, 2, 3], return 3.

Use Boyer-Moore voting algorithm for O(1) space.`,
    inputFormat: "def majorityElement(nums: List[int]) -> int:",
    outputFormat: "Return the majority element.",
    constraints: "1 <= len(nums) <= 5 * 10^4\nMajority element always exists",
    starterCode: `from typing import List

def majorityElement(nums: List[int]) -> int:
    # Your code here
    pass

# Read input
nums = list(map(int, input().split()))
print(majorityElement(nums))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "3 2 3", expectedOutput: "3" },
      { input: "2 2 1 1 1 2 2", expectedOutput: "2" },
      { input: "1", expectedOutput: "1" }
    ],
    hiddenTestCases: [
      { input: "1 1", expectedOutput: "1" },
      { input: "5 5 5 1 2", expectedOutput: "5" },
      { input: "1 1 1 1", expectedOutput: "1" },
      { input: "2 1 2 1 2", expectedOutput: "2" },
      { input: "-1 -1 -1 2 2", expectedOutput: "-1" }
    ]
  },
  {
    id: "python-permutations",
    slug: "list-permutations",
    title: "Generate All Permutations of a List",
    category: "Python Track",
    difficulty: "hard",
    description: `Generate all permutations of a list using recursion.

**Example:** Given nums = [1, 2, 3], return all 6 permutations.

Use backtracking to swap elements and explore all possibilities.`,
    inputFormat: "def permutations(nums: List[int]) -> List[List[int]]:",
    outputFormat: "Return all permutations sorted lexicographically.",
    constraints: "1 <= len(nums) <= 6\nAll elements are unique",
    starterCode: `from typing import List

def permutations(nums: List[int]) -> List[List[int]]:
    # Your code here - use recursion
    pass

# Read input
nums = list(map(int, input().split()))
result = permutations(nums)
result.sort()
for perm in result:
    print(" ".join(map(str, perm)))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "1 2 3", expectedOutput: "1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1" },
      { input: "1", expectedOutput: "1" },
      { input: "1 2", expectedOutput: "1 2\n2 1" }
    ],
    hiddenTestCases: [
      { input: "0 1", expectedOutput: "0 1\n1 0" },
      { input: "3 2 1", expectedOutput: "1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1" },
      { input: "5", expectedOutput: "5" },
      { input: "1 2 3 4", expectedOutput: "1 2 3 4\n1 2 4 3\n1 3 2 4\n1 3 4 2\n1 4 2 3\n1 4 3 2\n2 1 3 4\n2 1 4 3\n2 3 1 4\n2 3 4 1\n2 4 1 3\n2 4 3 1\n3 1 2 4\n3 1 4 2\n3 2 1 4\n3 2 4 1\n3 4 1 2\n3 4 2 1\n4 1 2 3\n4 1 3 2\n4 2 1 3\n4 2 3 1\n4 3 1 2\n4 3 2 1" },
      { input: "0", expectedOutput: "0" }
    ]
  },
  {
    id: "python-max-subarray",
    slug: "max-subarray-sum",
    title: "Find the Maximum Sum Subarray (Kadane's Algorithm)",
    category: "Python Track",
    difficulty: "hard",
    description: `Find the contiguous subarray with the largest sum using Kadane's algorithm.

**Example:** Given nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4], return 6 (subarray [4, -1, 2, 1]).

Track current sum and reset when it goes negative.`,
    inputFormat: "def maxSubarraySum(nums: List[int]) -> int:",
    outputFormat: "Return the maximum sum of any contiguous subarray.",
    constraints: "1 <= len(nums) <= 10^5\n-10^4 <= nums[i] <= 10^4",
    starterCode: `from typing import List

def maxSubarraySum(nums: List[int]) -> int:
    # Your code here - use Kadane's algorithm
    pass

# Read input
nums = list(map(int, input().split()))
print(maxSubarraySum(nums))`,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    visibleTestCases: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { input: "1", expectedOutput: "1" },
      { input: "5 4 -1 7 8", expectedOutput: "23" }
    ],
    hiddenTestCases: [
      { input: "-1", expectedOutput: "-1" },
      { input: "-2 -1", expectedOutput: "-1" },
      { input: "1 2 3 4 5", expectedOutput: "15" },
      { input: "-1 -2 -3 -4", expectedOutput: "-1" },
      { input: "1 -1 1 -1 1", expectedOutput: "1" }
    ]
  }
];

// Get all Python track problem IDs for certificate generation
export const getPythonTrackIds = (): string[] => {
  return pythonProblemsData.map(p => p.id);
};

export const PYTHON_TRACK_TOTAL = pythonProblemsData.length;
