# Test script for pattern printing problems
# This will help us verify the expected outputs are correct

def test_ascending_numbers(n):
    """Test ascending numbers pattern"""
    print(f"=== Ascending Numbers for n={n} ===")
    for i in range(1, n + 1):
        # Print numbers from 1 to i with spaces
        row = " ".join(str(j) for j in range(1, i + 1))
        print(row)

def test_descending_numbers(n):
    """Test descending numbers pattern"""
    print(f"\n=== Descending Numbers for n={n} ===")
    for i in range(n, 0, -1):
        # Print numbers from i down to 1 with spaces
        row = " ".join(str(j) for j in range(i, 0, -1))
        print(row)

def test_left_stars(n):
    """Test left aligned stars pattern"""
    print(f"\n=== Left Aligned Stars for n={n} ===")
    for i in range(1, n + 1):
        # Print i stars with spaces
        row = " ".join("*" for _ in range(i))
        print(row)

def test_right_stars(n):
    """Test right aligned stars pattern"""
    print(f"\n=== Right Aligned Stars for n={n} ===")
    for i in range(n, 0, -1):
        # Print i stars with spaces
        row = " ".join("*" for _ in range(i))
        print(row)

# Test with n=3
print("Testing with n=3:")
test_ascending_numbers(3)
test_descending_numbers(3)
test_left_stars(3)
test_right_stars(3)

print("\n" + "="*50)

# Test with n=5
print("Testing with n=5:")
test_ascending_numbers(5)
test_descending_numbers(5)
test_left_stars(5)
test_right_stars(5)
