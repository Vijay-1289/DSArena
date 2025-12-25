# Practice Problems Implementation Plan

## Task Overview
Create a new "Practice Problems" page that includes 5 specific programming problems with pattern printing, number theory, and series problems. The page should have similar UI to DailyChallenge but without the lives system.

## Problems to Implement
1. **Pattern Printing (4 variants)**
   - Ascending numbers: 1, 1 2, 1 2 3, etc.
   - Descending numbers: 5 4 3 2 1, 4 3 2 1, etc.
   - Left-aligned stars: *, * *, * * *, etc.
   - Right-aligned stars: * * * * *, * * *, etc.

2. **Prime Numbers**: Print all prime numbers before the nth number
3. **Fibonacci Series**: Generate Fibonacci series up to Nth number
4. **Palindrome Check**: Check if a number is palindrome
5. **Armstrong Check**: Check if a number is Armstrong number

## Implementation Steps

### Step 1: Create Practice Problems Data Structure
- Create `practiceProblemsData.ts` with all 5 problems
- Define test cases, input/output formats, starter code in Python
- Include problem descriptions and constraints

### Step 2: Create Practice Problems Page
- Create `src/pages/PracticeProblems.tsx`
- Similar UI to DailyChallenge but without lives system
- Use existing components: CodeEditor, TestCasePanel, etc.
- Remove lives-related components and logic

### Step 3: Add Navigation
- Update Navbar.tsx to include "Practice Problems" link
- Update App.tsx routing to include PracticeProblems route

### Step 4: Code Templates
- Provide Python starter code for each problem
- Include input/output handling
- Provide helper functions where needed

## Technical Details

### File Structure
```
src/
├── pages/
│   └── PracticeProblems.tsx (NEW)
├── lib/
│   └── practiceProblemsData.ts (NEW)
```

### Key Differences from DailyChallenge
- No lives system integration
- No streak tracking
- No time restrictions
- Simpler problem descriptions
- Focus on basic programming concepts

### UI Components to Reuse
- CodeEditor
- TestCasePanel  
- LanguageSelector
- Resizable panels
- Button, Card, Badge components

### UI Components to Remove
- LivesDisplay
- Lives-related logic
- Time tracking
- Streak functionality

## Success Criteria
- [ ] Practice Problems page loads successfully
- [ ] All 5 problems are accessible and functional
- [ ] Code editor works with Python syntax highlighting
- [ ] Test cases execute and show results
- [ ] Navigation link appears in navbar
- [ ] No lives system integration
- [ ] Responsive design works on mobile/desktop

## Testing Plan
1. Test navigation to Practice Problems page
2. Test each problem individually
3. Verify code execution for all test cases
4. Check mobile responsiveness
5. Verify no lives system remnants
