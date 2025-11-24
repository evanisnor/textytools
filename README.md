# textytools

A collection of lightweight, browser-based productivity tools for programmers and students. This hub provides fast, friction-free utilities for common text and data manipulation tasks.

https://textytools.dev

## Live Utilities

### Text Counter

Count characters, words, lines, paragraphs, and AI tokens (GPT-4) in real-time. Useful for content creation, API cost estimation, and text analysis.

- **Location**: [/text-counter](app/text-counter/page.tsx)
- **Features**: Character, word, line, paragraph, and token counting
- **Dependencies**: `tiktoken` for GPT-4 token estimation

### Case Converter

Transform text between 11 different case formats instantly, including programming conventions like camelCase, snake_case, and kebab-case.

- **Location**: [/case-converter](app/case-converter/page.tsx)
- **Features**: UPPER, lower, Title, Sentence, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, path/case
- **Implementation**: Pure client-side conversion with intelligent word boundary detection

### Text Sanitizer

Clean and transform text with 12 customizable sanitization options. Enable multiple filters simultaneously to process text in sequence.

- **Location**: [/text-sanitizer](app/text-sanitizer/page.tsx)
- **Features**: Trim lines, remove empty/duplicate lines, strip emoji/punctuation/numbers, normalize whitespace, sort/reverse lines
- **Pattern**: Sequential filter application with real-time preview

### JSON Wizard

Validate, format, search, and manipulate JSON data with advanced tooling.

- **Location**: [/json-wizard](app/json-wizard/page.tsx)
- **Features**:
  - Real-time validation with line/column error reporting
  - Pretty print, minify, escape/unescape JSON
  - Search with case sensitivity and match navigation
  - Synchronized scrolling between input and output
  - JSON statistics (keys, depth, size)
  - Sort keys alphabetically
  - Customizable indentation (2-8 spaces)

### CSV / JSON Converter

Bidirectional converter between CSV and JSON formats with proper data type parsing and nested object support.

- **Location**: [/csv-json-converter](app/csv-json-converter/page.tsx)
- **Features**:
  - JSON to CSV: Flattens nested objects with dot notation, handles arrays
  - CSV to JSON: Auto-detects types (numbers, booleans, null), creates nested objects from dot notation
  - Configurable delimiters (comma, semicolon, tab, pipe)
  - Optional header row handling
  - Proper CSV escaping (quotes, delimiters, newlines)
  - Real-time validation and error reporting

### Text Encoder

Encode and decode text using 17 different encoding formats with support for common web, programming, and cryptographic standards.

- **Location**: [/text-encoder](app/text-encoder/page.tsx)
- **Features**:
  - **Base Encodings**: Base64, Base58 (Bitcoin), Base91, ASCII85 (Adobe), Z85 (ZeroMQ)
  - **Web Encodings**: URL encoding, HTML entities, Quoted-Printable (MIME)
  - **Data Formats**: Hexadecimal, Binary, Unicode escape sequences
  - **Ciphers**: ROT13, Morse code
  - **Cryptographic Hashes**: MD5, SHA-1, SHA-256, SHA-512 (one-way only)
- **Implementation**: Bidirectional encoding/decoding with toggle between modes, async hash function support, comprehensive error handling

### JWT Decoder

Decode and inspect JSON Web Tokens (JWT) with syntax highlighting and automatic validation of standard claims.

- **Location**: [/jwt-decoder](app/jwt-decoder/page.tsx)
- **Features**:
  - Decode JWT header, payload, and signature with color-coded highlighting
  - Automatic validation of standard claims (exp, iat, nbf)
  - Visual indicators for expired or not-yet-valid tokens
  - Display algorithm, issued date, expiration date, and not-before date
  - Toggle between formatted and raw JSON output
  - Real-time decoding with error messages
  - Copy decoded output to clipboard
- **Implementation**: Client-side base64url decoding, RFC 7519 compliant parsing, no server communication for security

### Regex Tester

Test regular expressions with real-time match highlighting and capture group extraction.

- **Location**: [/regex-tester](app/regex-tester/page.tsx)
- **Features**:
  - Real-time regex pattern testing with match highlighting
  - Support for all JavaScript regex flags (g, i, m, s, u, y)
  - Interactive flag toggles with descriptions
  - Match details table showing full matches, indices, and capture groups
  - Visual match highlighting in output with ⟪⟫ delimiters
  - Error messages for invalid regex patterns
  - Copy all matches to clipboard
  - Match count display
- **Implementation**: Client-side regex execution with comprehensive error handling, useMemo for performance optimization

## Project Structure

```
utility-apps/
├── app/
│   ├── layout.tsx           # Root layout with Geist fonts
│   ├── page.tsx             # Home page with utility grid
│   ├── globals.css          # Tailwind imports and theme
|   ├── components/          # Shared components
│   ├── case-converter/
│   │   └── page.tsx
│   ├── text-counter/
│   │   └── page.tsx
│   ├── text-sanitizer/
│   │   └── page.tsx
│   ├── json-wizard/
│   │   └── page.tsx
│   ├── csv-json-converter/
│   │   └── page.tsx
│   ├── text-encoder/
│   │   └── page.tsx
│   ├── jwt-decoder/
│   │   └── page.tsx
│   └── regex-tester/
│       └── page.tsx
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.0
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript 5
- **Fonts**: Geist Sans & Geist Mono
- **Special Dependencies**: tiktoken (for AI token counting)

## Design System & Patterns

### Color Palette

The project uses a minimal zinc-based color palette with dark mode support:

- **Light Mode**: `zinc-50` background, `zinc-900` text
- **Dark Mode**: `zinc-950` background, `zinc-50` text
- **Borders**: `zinc-200` (light) / `zinc-800` (dark)
- **Interactive**: Hover states use `zinc-300/zinc-700`

### Sga

All utilities use ToolFrame

### Typography

- **Headers**: Bold, tracking-tight, responsive sizing (text-4xl, text-xl, etc.)
- **Body Text**: `text-zinc-600 dark:text-zinc-400` for descriptions
- **Code/Data**: `font-mono text-sm` for technical content

### Components & Interactivity

- `Modal.tsx` - A reusable component for modal dialogs. Forms should be implemented as children (like `FeedbackModal.tsx`)
- `TextEditorContainer.tsx`, which wraps `TextEditor.tsx` to enforce consistency for input and output textareas across tools
- `Toast.tsx` for displaying ephemeral messages to the user
- `ToolCard.tsx` used on the main page for navigation to tools
- `ToolFrame.tsx` is the root component for all tools to ensure consistency in their layout.

#### Buttons & Controls

- **Primary Actions**: Bordered cards with hover effects and cursor-pointer
- **Secondary Actions**: Text links with color transitions
- **Disabled State**: `opacity-50 cursor-not-allowed`

#### Stats/Metrics Display

```tsx
<div className="bg-white dark:bg-zinc-900 rounded-lg border... p-4">
  <div className="text-sm text-zinc-600...">Label</div>
  <div className="text-3xl font-bold...">{value}</div>
</div>
```

### State Management

All utilities use local React state (`useState`, `useMemo`) with client-side rendering (`"use client"`). No global state or external state management is required.

### Responsive Design

- **Mobile**: Single column layouts with full-width components
- **Tablet**: `md:` breakpoints for 2-column grids
- **Desktop**: `lg:` breakpoints for complex layouts (2/3 + 1/3 splits, etc.)

## Adding New Utilities

To add a new utility to the project:

### 1. Create the Utility Page

Create a new directory under `app/` with a `page.tsx` file:

```bash
mkdir app/your-utility
touch app/your-utility/page.tsx
```

### 2. Follow the Standard Structure

Use the `ToolFrame` component for consistent layout and the `TextEditorContainer` component for text input/output areas:

```tsx
"use client";

import { useState } from "react";
import { ToolFrame } from "@/app/components/ToolFrame";
import { TextEditorContainer } from "@/app/components/TextEditorContainer";
import { TOOL_NAMES } from "@/app/lib/constants";

export default function YourUtility() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <ToolFrame
      title="Your Utility Name"
      description="Brief description of what this utility does"
      toolName={TOOL_NAMES.YOUR_UTILITY}
      maxWidth="7xl" // or "4xl", "5xl", "6xl" depending on your layout needs
    >
      {/* Main content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input area */}
        <TextEditorContainer
          value={input}
          onChange={setInput}
          placeholder="Enter your text here..."
          height="h-96"
        />

        {/* Output area */}
        <TextEditorContainer
          value={output}
          readOnly
          placeholder="Results will appear here..."
          height="h-96"
        />
      </div>
    </ToolFrame>
  );
}
```

### 3. Add Tool Name Constant

Add your tool name to [app/lib/constants.ts](app/lib/constants.ts) for analytics tracking:

```tsx
export const TOOL_NAMES = {
  // ... existing tools
  YOUR_UTILITY: "your-utility",
} as const;
```

### 4. Add to Home Page

Edit [app/page.tsx](app/page.tsx) to add your utility using the `ToolCard` component:

```tsx
<ToolCard
  href="/your-utility"
  title="Your Utility"
  description="Brief description for the home page"
/>
```

### 5. Design Considerations

**Keep it simple**: Focus on a single, well-defined task

- Each utility should do one thing well
- Avoid feature creep; split complex functionality into separate utilities

**Make it fast**: All processing should be client-side and real-time

- Use `useMemo` for expensive calculations
- Debounce only if absolutely necessary (prefer instant updates)

**Maintain consistency**: Follow the established patterns

- Use the same color palette and spacing
- Match the layout structure of existing utilities
- Reuse component patterns (input/output areas, stats displays, buttons)

**Ensure accessibility**:

- Provide clear labels for all inputs
- Use semantic HTML
- Test keyboard navigation
- Support dark mode automatically

**Consider edge cases**:

- Empty input states with helpful placeholder text
- Error handling with user-friendly messages
- Large data sets (optimize rendering if needed)
- Copy-to-clipboard functionality for outputs

### 6. Common Patterns to Reuse

**TextEditor with Line Numbers**:

- [TextEditor component](app/components/TextEditor.tsx) - Core textarea with line numbers, syntax highlighting, and read-only mode
- [TextEditorContainer component](app/components/TextEditorContainer.tsx) - Pre-styled container wrapper for TextEditor with consistent styling and scroll behavior. **Use this for most cases**. See [json-wizard](app/json-wizard/page.tsx) for implementation example

**Option Selection Grid**: See [case-converter](app/case-converter/page.tsx:251-268) for radio-style selection

**Checkbox Options**: See [text-sanitizer](app/text-sanitizer/page.tsx:289-309) for multi-select filters

**Stats Display**: See [text-counter](app/text-counter/page.tsx:57-102) for metric cards

**Advanced UI with Search**: See [json-wizard](app/json-wizard/page.tsx) for search implementation with TextEditor

## Development

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Code Quality

- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier
- **Type Safety**: Strict TypeScript mode enabled

### Browser Compatibility

All utilities run entirely in the browser with no backend dependencies. Modern browser features used:

- ES2017+ JavaScript
- CSS Grid & Flexbox
- Dark mode via `prefers-color-scheme`
- Clipboard API for copy functionality

## Future Utility Ideas

Potential additions to consider:

- **Markdown Previewer**: Live markdown rendering
- **Color Converter**: HEX, RGB, HSL conversions
- **UUID Generator**: Generate UUIDs with various versions
