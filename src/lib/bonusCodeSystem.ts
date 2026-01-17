// Bonus code system for consecutive fast solves
import { supabase } from '@/integrations/supabase/client';

const FAST_SOLVE_THRESHOLD_SECONDS = 300; // 5 minutes
const BREAK_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes
const CONSECUTIVE_REQUIRED = 3;

interface FastSolveStatus {
  consecutiveFastSolves: number;
  lastFastSolveAt: Date | null;
  qualifiesForBonus: boolean;
}

// Check if user qualifies for bonus code
export async function checkBonusEligibility(userId: string): Promise<boolean> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('consecutive_fast_solves, last_fast_solve_at')
    .eq('id', userId)
    .single() as { data: any; error: any };

  if (error || !profile) return false;

  const consecutiveSolves = profile.consecutive_fast_solves || 0;
  const lastSolveAt = profile.last_fast_solve_at ? new Date(profile.last_fast_solve_at) : null;

  // Check if break was too long (resets the streak)
  if (lastSolveAt) {
    const timeSinceLastSolve = Date.now() - lastSolveAt.getTime();
    if (timeSinceLastSolve > BREAK_THRESHOLD_MS) {
      // Reset streak due to long break
      await resetFastSolveStreak(userId);
      return false;
    }
  }

  return consecutiveSolves >= CONSECUTIVE_REQUIRED;
}

// Record a fast solve
export async function recordFastSolve(userId: string, solveTimeSeconds: number): Promise<FastSolveStatus> {
  const isFastSolve = solveTimeSeconds <= FAST_SOLVE_THRESHOLD_SECONDS;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('consecutive_fast_solves, last_fast_solve_at')
    .eq('id', userId)
    .single() as { data: any; error: any };

  if (error || !profile) {
    return { consecutiveFastSolves: 0, lastFastSolveAt: null, qualifiesForBonus: false };
  }

  let consecutiveSolves = profile.consecutive_fast_solves || 0;
  const lastSolveAt = profile.last_fast_solve_at ? new Date(profile.last_fast_solve_at) : null;

  // Check if break was too long (resets the streak)
  if (lastSolveAt) {
    const timeSinceLastSolve = Date.now() - lastSolveAt.getTime();
    if (timeSinceLastSolve > BREAK_THRESHOLD_MS) {
      consecutiveSolves = 0;
    }
  }

  if (isFastSolve) {
    consecutiveSolves++;
  } else {
    consecutiveSolves = 0;
  }

  // Update profile (using any cast due to column not in generated types)
  await supabase
    .from('profiles')
    .update({
      consecutive_fast_solves: consecutiveSolves,
      last_fast_solve_at: new Date().toISOString(),
    } as any)
    .eq('id', userId);

  const qualifiesForBonus = consecutiveSolves >= CONSECUTIVE_REQUIRED;

  return {
    consecutiveFastSolves: consecutiveSolves,
    lastFastSolveAt: new Date(),
    qualifiesForBonus,
  };
}

// Reset fast solve streak (called when bonus is used)
export async function resetFastSolveStreak(userId: string): Promise<void> {
  await supabase
    .from('profiles')
    .update({
      consecutive_fast_solves: 0,
    } as any)
    .eq('id', userId);
}

// Get bonus code based on language and problem type
export function getBonusCode(language: string, problemType?: string): string {
  const bonusCodes: Record<string, string> = {
    python: `# 🎁 BONUS CODE! Here's a head start for being fast!
import sys

# region Input Helpers
# Read all input at once and tokenize by any whitespace
tokens = sys.stdin.read().split()
idx = 0

def read_next():
    """Get the next token from input (handles spaces, tabs, newlines)"""
    global idx
    if idx < len(tokens):
        val = tokens[idx]
        idx += 1
        return val
    return None

def read_int():
    """Read next token as integer"""
    val = read_next()
    return int(val) if val is not None else None

def read_float():
    """Read next token as float"""
    val = read_next()
    return float(val) if val is not None else None
# endregion

# ========== YOUR SOLUTION BELOW ==========

def solution():
    # Example: Read two integers
    # a = read_int()
    # b = read_int()
    # return a + b
    
    # YOUR LOGIC HERE
    return None

# Run and print result
if __name__ == "__main__":
    result = solution()
    if result is not None:
        print(result)
`,
    javascript: `// 🎁 BONUS CODE! Here's a head start for being fast!
const fs = require('fs');

// #region Input Helpers
// Read all input at once and tokenize by any whitespace
const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
let idx = 0;

function readNext() {
    // Get the next token from input (handles spaces, tabs, newlines)
    return idx < tokens.length ? tokens[idx++] : null;
}

function readInt() {
    // Read next token as integer
    const val = readNext();
    return val !== null ? parseInt(val, 10) : null;
}

function readFloat() {
    // Read next token as float
    const val = readNext();
    return val !== null ? parseFloat(val) : null;
}
// #endregion

// ========== YOUR SOLUTION BELOW ==========

function solution() {
    // Example: Read two integers
    // const a = readInt();
    // const b = readInt();
    // return a + b;
    
    // YOUR LOGIC HERE
    return null;
}

// Run and print result
const result = solution();
if (result !== null && result !== undefined) {
    console.log(result);
}
`,
    java: `// 🎁 BONUS CODE! Here's a head start for being fast!
import java.util.*;
import java.io.*;

public class Solution {
    static Scanner scanner = new Scanner(System.in);
    
    // Scanner.next() and nextInt() are already whitespace-agnostic!
    // They automatically skip spaces, tabs, and newlines.
    
    public static void main(String[] args) {
        // #region Input Helpers
        // Example: Read two integers
        // int a = scanner.nextInt();
        // int b = scanner.nextInt();
        // System.out.println(a + b);
        
        // ========== YOUR SOLUTION BELOW ==========
        
        // YOUR LOGIC HERE
        // #endregion
        
    }
}
`,
    cpp: `// 🎁 BONUS CODE! Here's a head start for being fast!
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

int main() {
    // #region Input Helpers
    // Fast I/O (optional but recommended)
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    
    // C++ cin >> is already whitespace-agnostic by default!
    // It automatically skips spaces, tabs, and newlines.
    
    // Example: Read two integers
    // int a, b;
    // cin >> a >> b;
    // cout << a + b << endl;
    
    // ========== YOUR SOLUTION BELOW ==========
    
    // YOUR LOGIC HERE
    // #endregion
    
    return 0;
}
`,
    go: `// 🎁 BONUS CODE! Here's a head start for being fast!
package main

import (
    "fmt"
    "os"
)

func main() {
    // #region Input Helpers
    // Standard fmt.Scan is whitespace-agnostic (skips newlines/spaces)
    
    // Example: Read two integers
    // var a, b int
    // fmt.Scan(&a, &b)
    // fmt.Println(a + b)
    
    // YOUR LOGIC HERE
    // #endregion
    
}
`,
    rust: `// 🎁 BONUS CODE! Here's a head start for being fast!
use std::io::{self, Read};

fn main() {
    // #region Input Helpers
    let mut buffer = String::new();
    io::stdin().read_to_string(&mut buffer).unwrap();
    
    // Split by any whitespace for agnostic reading
    let mut tokens = buffer.split_whitespace();
    
    // Example: Read two integers
    // let a: i32 = tokens.next().unwrap().parse().unwrap();
    // let b: i32 = tokens.next().unwrap().parse().unwrap();
    // println!("{}", a + b);
    
    // YOUR LOGIC HERE
    // #endregion
    
}
`,
  };

  return bonusCodes[language] || bonusCodes.python;
}

// Check if user should see bonus notification
export async function shouldShowBonusNotification(userId: string): Promise<boolean> {
  return await checkBonusEligibility(userId);
}
