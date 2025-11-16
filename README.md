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

## Project Structure

```
utility-apps/
├── app/
│   ├── layout.tsx           # Root layout with Geist fonts
│   ├── page.tsx             # Home page with utility grid
│   ├── globals.css          # Tailwind imports and theme
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
│   └── jwt-decoder/
│       └── page.tsx
├── public/                   # Static assets
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

### Layout Pattern

All utilities follow a consistent layout structure:

```tsx
<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6">
  <div className="max-w-[size] mx-auto">
    {/* Back button */}
    <Link href="/">← Back to home</Link>

    {/* Header */}
    <h1 className="text-4xl font-bold...">Utility Name</h1>
    <p className="text-lg text-zinc-600...">Description</p>

    {/* Main content grid */}
    <div className="grid grid-cols-1 lg:grid-cols-[ratio] gap-6">
      {/* Content areas */}
    </div>
  </div>
</div>
```

### Typography

- **Headers**: Bold, tracking-tight, responsive sizing (text-4xl, text-xl, etc.)
- **Body Text**: `text-zinc-600 dark:text-zinc-400` for descriptions
- **Code/Data**: `font-mono text-sm` for technical content

### Components & Interactivity

#### Input/Output Areas

```tsx
<div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
  <textarea className="w-full h-[size] p-4 bg-transparent... resize-none focus:outline-none font-mono text-sm" />
</div>
```

#### Buttons & Controls

- **Primary Actions**: Bordered cards with hover effects
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

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function YourUtility() {
  const [input, setInput] = useState("");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Your Utility Name
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Brief description of what this utility does
          </p>
        </div>

        {/* Main content */}
        {/* ... your utility's UI ... */}
      </div>
    </div>
  );
}
```

### 3. Add to Home Page

Edit [app/page.tsx](app/page.tsx:17-76) to add a link card in the grid:

```tsx
<Link
  href="/your-utility"
  className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
>
  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
    Your Utility
  </h2>
  <p className="text-sm text-zinc-600 dark:text-zinc-400">
    Brief description for the home page
  </p>
</Link>
```

### 4. Design Considerations

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

### 5. Common Patterns to Reuse

**Text Input/Output Areas**: See [text-counter](app/text-counter/page.tsx:104-112) or [case-converter](app/case-converter/page.tsx:209-217)

**Option Selection Grid**: See [case-converter](app/case-converter/page.tsx:251-268) for radio-style selection

**Checkbox Options**: See [text-sanitizer](app/text-sanitizer/page.tsx:289-309) for multi-select filters

**Stats Display**: See [text-counter](app/text-counter/page.tsx:57-102) for metric cards

**Advanced UI with Search**: See [json-wizard](app/json-wizard/page.tsx:802-860) for search implementation

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

- **Diff Viewer**: Compare two text blocks
- **Regex Tester**: Test regular expressions with highlighting
- **Markdown Previewer**: Live markdown rendering
- **Color Converter**: HEX, RGB, HSL conversions
- **UUID Generator**: Generate UUIDs with various versions

## License

This is a personal utility project. Feel free to use and modify as needed.
