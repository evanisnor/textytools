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
- Named capture group support with automatic CSV header generation
- Visual match highlighting in output with current match navigation
- Error messages for invalid regex patterns
- Copy all matches to clipboard functionality
- Convert capture groups to CSV (only shown when groups are present)
- Cross-tool integration with CSV/JSON Converter
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
  2. `error` (index: 34)
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

### Test Case 11: CSV Conversion with Named Groups

**Input Pattern:**

```
(?<name>[A-Z][a-z]+)\s+(?<age>\d+)\s+(?<city>[A-Z][a-z]+)
```

**Flags:** `g`

**Test String:**

```
Alice 30 Seattle
Bob 25 Portland
Charlie 35 Denver
Diana 28 Austin
```

**Expected Output:**

- **Match Count:** 4
- **"Convert to CSV" Button:** Should be visible (groups are present)
- **Match 1:**
  - Full Match: `Alice 30 Seattle` (index: 0)
  - name: `Alice`
  - age: `30`
  - city: `Seattle`
- **Match 2:**
  - Full Match: `Bob 25 Portland` (index: 17)
  - name: `Bob`
  - age: `25`
  - city: `Portland`
- **Match 3:**
  - Full Match: `Charlie 35 Denver` (index: 33)
  - name: `Charlie`
  - age: `35`
  - city: `Denver`
- **Match 4:**
  - Full Match: `Diana 28 Austin` (index: 52)
  - name: `Diana`
  - age: `28`
  - city: `Austin`

**CSV Conversion Output:**

Clicking "Convert to CSV" should navigate to CSV/JSON Converter with:

```
name,age,city
Alice,30,Seattle
Bob,25,Portland
Charlie,35,Denver
Diana,28,Austin
```

**Verification Steps:**

1. Enter the pattern and test string
2. Verify "Convert to CSV" button appears next to "Copy All Matches"
3. Verify button has blue styling (matching JSON Wizard integration)
4. Click "Convert to CSV" button
5. Verify navigation to `/csv-json-converter`
6. Verify CSV data is loaded in the input field
7. Verify headers use the named group names (name, age, city)
8. Verify CSV format is correct with proper escaping

---

### Test Case 12: CSV Conversion with Unnamed Groups

**Input Pattern:**

```
(\d{4})-(\d{2})-(\d{2})
```

**Flags:** `g`

**Test String:**

```
2024-01-15
2024-03-22
2024-12-01
```

**Expected Output:**

- **Match Count:** 3
- **"Convert to CSV" Button:** Should be visible (groups are present)
- **Match 1:**
  - Full Match: `2024-01-15` (index: 0)
  - Group 1: `2024`
  - Group 2: `01`
  - Group 3: `15`
- **Match 2:**
  - Full Match: `2024-03-22` (index: 11)
  - Group 1: `2024`
  - Group 2: `03`
  - Group 3: `22`
- **Match 3:**
  - Full Match: `2024-12-01` (index: 22)
  - Group 1: `2024`
  - Group 2: `12`
  - Group 3: `01`

**CSV Conversion Output:**

Clicking "Convert to CSV" should navigate to CSV/JSON Converter with:

```
2024,01,15
2024,03,22
2024,12,01
```

**Note:** No header row is included because the groups are unnamed (generic "Group 1", "Group 2" headers aren't helpful).

**Verification Steps:**

1. Enter the pattern and test string
2. Verify "Convert to CSV" button appears
3. Click "Convert to CSV" button
4. Verify navigation to `/csv-json-converter`
5. Verify CSV data has NO header row (starts directly with data)
6. Verify three rows of data are present

---

### Test Case 13: CSV Conversion with Special Characters

**Input Pattern:**

```
(?<product>[^,]+),\s*(?<price>\$[\d.]+),\s*(?<description>.+)
```

**Flags:** `g`

**Test String:**

```
Widget A, $19.99, "High quality, durable"
Gadget B, $49.99, Contains "special" features
Tool C, $29.99, Made with care
```

**Expected Output:**

- **Match Count:** 3
- **"Convert to CSV" Button:** Should be visible
- **CSV Output Should Properly Escape:**
  - Commas in descriptions
  - Quotes in descriptions
  - Values should be wrapped in quotes when necessary

**CSV Conversion Output:**

```
product,price,description
Widget A,$19.99,"""High quality, durable"""
Gadget B,$49.99,"Contains ""special"" features"
Tool C,$29.99,Made with care
```

**Verification Steps:**

1. Enter the pattern and test string
2. Click "Convert to CSV" button
3. Verify CSV properly escapes commas and quotes per RFC 4180
4. Verify values with commas or quotes are wrapped in double quotes
5. Verify quotes are escaped by doubling them

---

### Test Case 14: No Groups - CSV Button Hidden

**Input Pattern:**

```
\b[A-Z][a-z]+\b
```

**Flags:** `g`

**Test String:**

```
Alice and Bob went to Seattle
```

**Expected Output:**

- **Match Count:** 4 (Alice, Bob, Seattle)
- **"Convert to CSV" Button:** Should NOT be visible (no capture groups)
- Only "Copy All Matches" button should appear

**Verification Steps:**

1. Enter the pattern and test string without capture groups
2. Verify matches are displayed correctly
3. Verify "Convert to CSV" button does NOT appear
4. Verify "Copy All Matches" button still works

---

## Edge Cases to Test

1. **Empty Pattern** - Should show no matches, CSV button should not appear
2. **Empty Test String** - Should show no matches, CSV button should not appear
3. **Global Flag Off** - Should only show first match, CSV button appears if that match has groups
4. **Zero-length Matches** - Pattern like `\b` should handle without infinite loops
5. **Very Long Text** - Performance with large inputs (10,000+ characters)
6. **Special Characters** - Patterns with `\`, `$`, `^`, etc.
7. **Unicode Characters** - Emoji, accented characters, non-Latin scripts
8. **CSV with Newlines in Groups** - Groups containing `\n` should be properly escaped in CSV output
9. **Mixed Named and Unnamed Groups** - Only named groups should appear in CSV headers
10. **Empty Capture Groups** - Groups that match empty strings should appear as empty CSV fields

## Implementation Notes

- Uses JavaScript's native `RegExp` object
- `useMemo` hook for performance optimization on pattern/text changes
- Prevents infinite loops on zero-length matches by incrementing `lastIndex`
- Error handling with try/catch for invalid patterns
- Visual match highlighting in the editor with yellow background for matches and green for current match
- All processing happens client-side for privacy and speed
- Named group extraction parses `(?<name>...)` syntax from pattern to build header mappings
- CSV conversion follows RFC 4180 escaping rules (doubles quotes, wraps values containing commas/quotes/newlines)
- Cross-tool integration with CSV/JSON Converter via sessionStorage for seamless data transfer
- Analytics tracking for tool-to-tool conversions to measure feature usage
