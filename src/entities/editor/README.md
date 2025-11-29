# Editor Entity

A unified text editor component with line numbers, word wrap, and syntax highlighting support.

## Overview

The editor entity provides a configurable textarea component for displaying and editing code, CSV data, JSON, JWT tokens, and other structured text formats. It combines presentation and functionality into a single, cohesive API following Feature-Sliced Design principles.

## Features

- **Line Numbers**: Auto-adjusting width based on line count, with optional display control
- **Word Wrap**: Text wrapping with proper vertical alignment between line numbers and content
- **Syntax Highlighting**: Custom rendering support via hooks for JSON, CSV, JWT, and other formats
- **Read-Only Mode**: Display formatted output without editing capabilities
- **Custom Line Styling**: Highlight specific lines (e.g., for errors or search results)
- **Scroll Synchronization**: Automatic sync between textarea and overlay content
- **Configurable Styling**: Height, padding, borders, and background colors
- **Monospace Font**: Optimized for code and data viewing

## Structure

```
editor/
├── index.ts              # Public API exports
├── model/
│   └── types.ts         # TypeScript interfaces
├── lib/
│   └── editor-styles.ts # Style utility functions
└── ui/
    └── TextEditor.tsx   # Main component
```

## Usage

### Basic Editor

```tsx
import { TextEditor } from "@/entities/editor";

function MyComponent() {
  const [text, setText] = useState("");

  return (
    <TextEditor
      value={text}
      onChange={setText}
      placeholder="Enter text..."
    />
  );
}
```

### With Custom Height

```tsx
<TextEditor
  value={code}
  onChange={setCode}
  height="h-96"
  placeholder="Paste your code here..."
/>
```

### Read-Only with Syntax Highlighting

```tsx
import { TextEditor } from "@/entities/editor";
import { useJsonSyntaxHighlighter } from "@/entities/json";

function JsonViewer({ json }: { json: string }) {
  const { renderContent } = useJsonSyntaxHighlighter(json);

  return (
    <TextEditor
      value={json}
      readOnly
      renderContent={renderContent}
      height="h-[500px]"
    />
  );
}
```

### With Line Numbers Disabled

```tsx
<TextEditor
  value={text}
  onChange={setText}
  showLineNumbers={false}
  wrap={true}
/>
```

### With Scroll Control

```tsx
import { TextEditor, type TextEditorRef } from "@/entities/editor";

function ScrollableEditor() {
  const editorRef = useRef<TextEditorRef>(null);

  const scrollToTop = () => {
    editorRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <button onClick={scrollToTop}>Scroll to Top</button>
      <TextEditor
        ref={editorRef}
        value={text}
        onChange={setText}
        height="h-96"
      />
    </>
  );
}
```

### With Custom Line Rendering (Search Highlighting)

```tsx
<TextEditor
  value={content}
  renderLineContent={(line, index) => {
    if (searchMatches.some(m => m.lineIndex === index)) {
      return <span className="bg-yellow-200">{line}</span>;
    }
    return line;
  }}
/>
```

### With Custom Container Styling

```tsx
<TextEditor
  value={text}
  onChange={setText}
  height="h-64"
  containerClassName="shadow-lg"
  className="font-mono text-xs"
/>
```

## API Reference

### TextEditorProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | *required* | The text content to display/edit |
| `onChange` | `(value: string) => void` | `undefined` | Called when text changes (not in readOnly mode) |
| `placeholder` | `string` | `"Enter text..."` | Placeholder text when empty |
| `readOnly` | `boolean` | `false` | Disables editing |
| `className` | `string` | `""` | Additional CSS classes for the editor content |
| `renderLineContent` | `(line: string, index: number) => ReactNode` | `undefined` | Custom render for individual lines |
| `highlightLine` | `(lineNumber: number) => boolean` | `undefined` | Determine if a line should be highlighted |
| `lineClassName` | `(lineNumber: number) => string` | `undefined` | Custom className for line numbers |
| `renderContent` | `(content: string) => ReactNode` | `undefined` | Custom render for entire content (takes precedence) |
| `showLineNumbers` | `boolean` | `true` | Whether to show line numbers |
| `wrap` | `boolean` | `false` | Enable word wrap |
| `id` | `string` | `undefined` | ID for the textarea element |
| `height` | `string` | `"h-64"` | Height class (e.g., "h-96", "h-[500px]") |
| `containerClassName` | `string` | `""` | Additional classes for outer container |

### TextEditorRef

| Method | Type | Description |
|--------|------|-------------|
| `scrollTo` | `(options: ScrollToOptions) => void` | Scroll the editor to a position |
| `getScrollContainer` | `() => HTMLDivElement \| null` | Get the scroll container element |
| `getInnerContainer` | `() => HTMLDivElement \| null` | Get the inner container element |

## Style Utilities

The `lib/editor-styles.ts` module provides utility functions for generating class names:

```tsx
import { getContainerClasses, getWrapClasses } from "@/entities/editor";

const containerClass = getContainerClasses({ 
  height: "h-96", 
  containerClassName: "shadow-md" 
});

const wrapClass = getWrapClasses(true); // "whitespace-pre-wrap break-all"
```

## Integration with Other Entities

The editor is designed to work seamlessly with syntax highlighting from other entities:

- **JSON**: `useJsonSyntaxHighlighter` from `@/entities/json`
- **CSV**: `useCsvSyntaxHighlighter` from `@/entities/csv`
- **JWT**: `useJwtSyntaxHighlighter` from `@/entities/jwt`

Example:

```tsx
import { TextEditor } from "@/entities/editor";
import { useJsonSyntaxHighlighter } from "@/entities/json";

function JsonEditor({ json }: { json: string }) {
  const { renderContent } = useJsonSyntaxHighlighter(json);
  
  return (
    <TextEditor
      value={json}
      readOnly
      renderContent={renderContent}
    />
  );
}
```

## Design Decisions

### Why Merge Container and Editor?

The original design had `TextEditorContainer` and `TextEditor` as separate components, with the container handling styling and the editor handling functionality. This created:

- **Tight coupling** through ref forwarding
- **Unclear responsibility** separation
- **API complexity** requiring two components for one use case

The merged design:
- **Single API** - One component to import and configure
- **Clear separation** - Styling logic lives in `lib/editor-styles.ts`
- **Better FSD alignment** - Presentation and behavior in their proper layers
- **Easier to use** - No need to remember which props go where

### Styling Strategy

Styling is separated into pure utility functions in `lib/editor-styles.ts`. This:
- Makes styles **testable** independently
- Allows **reuse** across components
- Follows **FSD principles** of separating concerns
- Enables **customization** without touching component logic

## Migration from Old API

If migrating from `TextEditorContainer`:

```tsx
// Old
import { TextEditorContainer } from "@/shared/ui/text-editor/TextEditorContainer";

<TextEditorContainer
  value={text}
  onChange={setText}
  height="h-96"
/>

// New
import { TextEditor } from "@/entities/editor";

<TextEditor
  value={text}
  onChange={setText}
  height="h-96"
/>
```

The ref interface changed from `TextEditorContainerRef` to `TextEditorRef`, but provides the same functionality.
