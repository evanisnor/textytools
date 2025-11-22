# Diff Viewer

A side-by-side text comparison tool with diff highlighting and search functionality.

## Features

### Line-by-Line Comparison

The diff viewer compares text at the same line positions in both the Left and Right panes:

- **Unchanged lines**: No highlighting - lines that are identical at the same position
- **Modified lines**: Yellow highlighting on both sides - lines that exist at the same position but have different content
- **Added lines**: Green highlighting on the right side only - lines that exist in the Right pane but not in the Left pane (Left pane shows empty at that position)
- **Removed lines**: Red highlighting on the left side only - lines that exist in the Left pane but not in the Right pane (Right pane shows empty at that position)

### Search Functionality

- **Cross-pane search**: Search for text across both Left and Right panes simultaneously
- **Match navigation**: Use Previous (←) and Next (→) buttons to jump between matches
- **Match counter**: Displays current match position and total matches (e.g., "3 / 12")
- **Case sensitivity toggle**: Enable/disable case-sensitive search
- **Visual highlighting**:
  - Current match: Green highlight with bold text
  - Other matches: Yellow highlight
  - Search matches overlay on top of diff highlighting

### User Interface

- **Side-by-side layout**: Left and Right panes displayed vertically for easy comparison
- **Independent scrolling**: Each pane can be scrolled independently
- **Auto-scroll to match**: When navigating search matches, the view automatically scrolls to center the current match
- **Stats display**: Shows count of added, removed, and modified lines
- **Clear buttons**: Individual clear buttons for each pane
- **Color legend**: Visual guide showing what each highlight color means

## Diff Algorithm

The tool uses a simple line-by-line comparison strategy:

1. Lines are compared at the same index position (line 1 vs line 1, line 2 vs line 2, etc.)
2. If one file is shorter, the extra lines in the longer file are marked as added/removed
3. Lines are compared using exact string matching

**Important behavior notes:**

- This approach is optimized for comparing similar versions of the same document
- Insertions or deletions in the middle of a document will cause all subsequent lines to appear as modified
- For best results, use this tool when comparing texts where most lines remain at the same position

### Example Behavior

**Scenario 1: Line modification**

```
Left:          Right:
Line 1         Line 1
Line 2  -->    Line 2 modified
Line 3         Line 3
```

Result: Line 2 is highlighted yellow on both sides

**Scenario 2: Line addition**

```
Left:          Right:
Line 1         Line 1
Line 2         Line 2
               Line 3 (new)
```

Result: Line 3 is highlighted green on right side, left side shows empty

**Scenario 3: Line removal**

```
Left:          Right:
Line 1         Line 1
Line 2
Line 3         Line 3
```

Result: Line 2 is highlighted red on left side, right side shows empty

**Scenario 4: Mid-document insertion**

```
Left:          Right:
Line 1         Line 1
Line 2  -->    New line inserted
Line 3  -->    Line 2
Line 4  -->    Line 3
               Line 4
```

Result: Lines 2 appears as a line addition, while 4 and 4 all appear unmodified because they have not changed from the original output.

## Keyboard Shortcuts

- **Enter** (in search box): Jump to next match

## Color Scheme

- **Green** (`bg-green-200/60 dark:bg-green-800/40`): Added lines
- **Red** (`bg-red-200/60 dark:bg-red-800/40`): Removed lines
- **Yellow** (`bg-yellow-200/60 dark:bg-yellow-800/40`): Modified lines
- **Bright Green** (`bg-green-300 dark:bg-green-600`): Current search match
- **Bright Yellow** (`bg-yellow-300 dark:bg-yellow-600`): Other search matches
