# Regex Tester

A real-time regular expression testing tool with match highlighting and capture group extraction.

## Purpose

The Regex Tester solves common problems developers face when working with regular expressions:

1. **Pattern Validation** - Quickly verify that your regex pattern is syntactically correct before using it in code
2. **Match Visualization** - See exactly which parts of your text match the pattern with clear highlighting
3. **Capture Group Inspection** - Extract and view capture groups to ensure your pattern captures the right data
4. **Flag Experimentation** - Easily toggle between different regex flags to understand their effects
5. **Debugging** - Identify why a pattern isn't matching by seeing real-time results as you type
6. **Learning** - Experiment with regex patterns in a safe, visual environment to learn regex syntax

Common use cases:

- Validating email, URL, or phone number patterns
- Extracting data from structured text (log files, CSV, etc.)
- Finding and replacing text patterns
- Validating input formats before implementing in production code
- Understanding how different flags affect pattern matching behavior

## Features

- Real-time regex pattern testing with instant feedback
- Support for all JavaScript regex flags (g, i, m, s, u, y)
- Interactive flag toggles with clear descriptions
- Match details table showing full matches, indices, and capture groups
- Visual match highlighting in output using ⟪⟫ delimiters
- Error messages for invalid regex patterns
- Copy all matches to clipboard functionality
- Match count display
- Client-side processing for privacy and speed

## Test Plan

### Test Case 1: Email Validation

**Input Pattern:**

```
[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
```

**Flags:** `g`

**Test String:**

```
Contact us at support@example.com or sales@company.co.uk
You can also reach admin@test.org for technical issues.
Invalid emails: user@, @domain.com, nodomain
```

**Expected Output:**

- **Match Count:** 3
- **Matches:**
  1. `support@example.com` (index: 14)
  2. `sales@company.co.uk` (index: 37)
  3. `admin@test.org` (index: 68)
- **Highlighted Text:** Shows ⟪support@example.com⟫ and other matches highlighted

---

### Test Case 2: Extracting Dates with Capture Groups

**Input Pattern:**

```
(\d{4})-(\d{2})-(\d{2})
```

**Flags:** `g`

**Test String:**

```
Important dates:
- Project start: 2024-01-15
- Milestone 1: 2024-03-22
- Launch date: 2024-12-01
```

**Expected Output:**

- **Match Count:** 3
- **Match 1:**
  - Full Match: `2024-01-15` (index: 35)
  - Group 1: `2024` (year)
  - Group 2: `01` (month)
  - Group 3: `15` (day)
- **Match 2:**
  - Full Match: `2024-03-22` (index: 62)
  - Group 1: `2024`
  - Group 2: `03`
  - Group 3: `22`
- **Match 3:**
  - Full Match: `2024-12-01` (index: 88)
  - Group 1: `2024`
  - Group 2: `12`
  - Group 3: `01`

---

### Test Case 3: Case-Insensitive Search

**Input Pattern:**

```
error
```

**Flags:** `gi` (global + case insensitive)

**Test String:**

```
ERROR: Connection failed
Warning: error in line 42
System error detected
No issues found
```

**Expected Output:**

- **Match Count:** 3
- **Matches:**
  1. `ERROR` (index: 0)
  2. `error` (index: 33)
  3. `error` (index: 58)

---

### Test Case 4: Multiline Mode

**Input Pattern:**

```
^Start
```

**Flags:** `gm` (global + multiline)

**Test String:**

```
Start of document
Some content here
Start of new section
More content
Start again
```

**Expected Output:**

- **Match Count:** 3
- **Matches:** All three instances of "Start" at the beginning of lines
  1. `Start` (index: 0)
  2. `Start` (index: 37)
  3. `Start` (index: 71)

Without the `m` flag, only the first "Start" would match.

---

### Test Case 5: Extracting URLs

**Input Pattern:**

```
https?://[^\s]+
```

**Flags:** `g`

**Test String:**

```
Visit https://example.com for more info.
Our API: https://api.example.com/v1/users
HTTP site: http://legacy.site.com
```

**Expected Output:**

- **Match Count:** 3
- **Matches:**
  1. `https://example.com` (index: 6)
  2. `https://api.example.com/v1/users` (index: 46)
  3. `http://legacy.site.com` (index: 91)

---

### Test Case 6: Phone Number Extraction with Groups

**Input Pattern:**

```
\((\d{3})\)\s*(\d{3})-(\d{4})
```

**Flags:** `g`

**Test String:**

```
Call us at (555) 123-4567 or (800) 555-0199
Contact: (415) 867-5309
```

**Expected Output:**

- **Match Count:** 3
- **Match 1:**
  - Full Match: `(555) 123-4567` (index: 11)
  - Group 1: `555` (area code)
  - Group 2: `123` (prefix)
  - Group 3: `4567` (line number)
- **Match 2:**
  - Full Match: `(800) 555-0199` (index: 29)
  - Group 1: `800`
  - Group 2: `555`
  - Group 3: `0199`
- **Match 3:**
  - Full Match: `(415) 867-5309` (index: 54)
  - Group 1: `415`
  - Group 2: `867`
  - Group 3: `5309`

---

### Test Case 7: Word Boundary Matching

**Input Pattern:**

```
\bcat\b
```

**Flags:** `g`

**Test String:**

```
The cat sat on the catalog.
A catastrophe for the cat.
```

**Expected Output:**

- **Match Count:** 2
- **Matches:**
  1. `cat` (index: 4) - standalone word
  2. `cat` (index: 51) - standalone word

Note: "cat" in "catalog" and "catastrophe" should NOT match due to word boundaries.

---

### Test Case 8: Invalid Regex Pattern

**Input Pattern:**

```
[unclosed
```

**Flags:** `g`

**Test String:**

```
Any text here
```

**Expected Output:**

- **Error Message:** "Invalid regular expression: /[unclosed/g: Unterminated character class"
- **Match Count:** 0
- **No matches displayed**

---

### Test Case 9: Dotall Mode (. matches newlines)

**Input Pattern:**

```
start.*end
```

**Flags:** `gs` (global + dotall)

**Test String:**

```
start
middle content
end
```

**Expected Output:**

- **Match Count:** 1
- **Match:** Entire text from "start" to "end" including newlines

Without the `s` flag, this would not match because `.` doesn't match newlines by default.

---

### Test Case 10: Unicode Mode

**Input Pattern:**

```
\p{Emoji}+
```

**Flags:** `gu` (global + unicode)

**Test String:**

```
Great work! 👍 🎉
Feeling happy 😊
```

**Expected Output:**

- **Match Count:** 3
- **Matches:**
  1. `👍` (index: 12)
  2. `🎉` (index: 15)
  3. `😊` (index: 31)

---

## Edge Cases to Test

1. **Empty Pattern** - Should show no matches
2. **Empty Test String** - Should show no matches
3. **Global Flag Off** - Should only show first match
4. **Zero-length Matches** - Pattern like `\b` should handle without infinite loops
5. **Very Long Text** - Performance with large inputs (10,000+ characters)
6. **Special Characters** - Patterns with `\`, `$`, `^`, etc.
7. **Unicode Characters** - Emoji, accented characters, non-Latin scripts

## Implementation Notes

- Uses JavaScript's native `RegExp` object
- `useMemo` hook for performance optimization on pattern/text changes
- Prevents infinite loops on zero-length matches by incrementing `lastIndex`
- Error handling with try/catch for invalid patterns
- Visual match highlighting using ⟪⟫ delimiters (easier to spot than background colors in text)
- All processing happens client-side for privacy and speed
