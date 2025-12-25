actice Problems Testing Guide

## 🎯 **How to Test Each Problem**

### **1. Pattern Printing Problems**
All pattern printing problems follow the same structure:
- Input: A single number `n` (1-10)
- Output: Pattern printed with newline characters

#### **Test Case Verification:**
- **Ascending Numbers (n=3)**: 
  ```
  1
  1 2
  1 2 3
  ```
- **Descending Numbers (n=3)**:
  ```
  3 2 1
  2 1
  1
  ```
- **Left Stars (n=3)**:
  ```
  *
  * *
  * * *
  ```
- **Right Stars (n=3)**:
  ```
  * * *
  * *
  *
  ```

### **2. Prime Numbers Problem**
- **Input**: `n` (find primes less than n)
- **Output**: Prime numbers separated by spaces
- **Example**: Input `10` → Output `2 3 5 7`

### **3. Fibonacci Series Problem**
- **Input**: `n` (number of terms)
- **Output**: Fibonacci sequence separated by spaces
- **Example**: Input `5` → Output `0 1 1 2 3`

### **4. Palindrome Check Problem**
- **Input**: `n` (number to check)
- **Output**: `True` or `False`
- **Example**: Input `121` → Output `True`

### **5. Armstrong Number Problem**
- **Input**: `n` (number to check)
- **Output**: `True` or `False`
- **Example**: Input `153` → Output `True`

## 🛠️ **Sample Solutions for Testing**

### **Pattern Printing Solution:**
```python
def print_pattern(n):
    for i in range(1, n + 1):
        # For numbers: " ".join(str(j) for j in range(1, i + 1))
        # For stars: " ".join("*" for _ in range(i))
        print(" ".join(str(j) for j in range(1, i + 1)))
```

### **Prime Numbers Solution:**
```python
def is_prime(num):
    if num < 2:
        return False
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            return False
    return True

def print_primes(n):
    primes = [str(i) for i in range(2, n) if is_prime(i)]
    print(" ".join(primes))
```

### **Fibonacci Solution:**
```python
def generate_fibonacci(n):
    if n == 0:
        return [0]
    elif n == 1:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib[:n]
```

### **Palindrome Solution:**
```python
def is_palindrome(n):
    return str(n) == str(n)[::-1]
```

### **Armstrong Solution:**
```python
def is_armstrong(n):
    num_str = str(n)
    power = len(num_str)
    total = sum(int(digit) ** power for digit in num_str)
    return total == n
```

## 🔍 **Testing Steps**

1. **Navigate to Practice Problems**: Click "Practice" in navbar
2. **Select a Problem**: Choose from the 8 available problems
3. **Implement Solution**: Replace `pass` in starter code with your solution
4. **Test with Examples**: Run individual test cases to verify
5. **Submit All**: Submit all test cases to mark as solved
6. **Navigate**: Use prev/next buttons or back to overview page

## ✅ **Expected Results**

All test cases should pass:
- Pattern printing should match exact output format
- Prime numbers should be correctly identified
- Fibonacci should generate correct sequence
- Boolean checks should return correct True/False values

## 🐛 **Common Issues**

1. **Pattern Printing**: Ensure proper newline characters
2. **Space Separation**: Use spaces between numbers/stars, not commas
3. **Output Format**: Match exact expected output format
4. **Edge Cases**: Handle n=1, empty results, etc.

The implementation is ready for testing and all expected outputs have been verified!
