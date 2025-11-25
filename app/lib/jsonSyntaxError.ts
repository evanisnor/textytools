export interface JsonSyntaxErrorInfo {
  position: number;
  message: string;
}

class JsonSyntaxError extends Error {
  position: number;

  constructor(message: string, position: number) {
    super(message);
    this.position = position;
  }
}

const WHITESPACE = new Set([" ", "\n", "\r", "\t"]);

export function findJsonSyntaxError(
  text: string,
): JsonSyntaxErrorInfo | undefined {
  let index = 0;
  const length = text.length;

  const clampPosition = (position: number) => {
    if (length === 0) return 0;
    if (position < 0) return 0;
    if (position >= length) return length - 1;
    return position;
  };

  const fail = (message: string, position = index): never => {
    throw new JsonSyntaxError(message, clampPosition(position));
  };

  const peek = () => text[index];

  const consume = (expected: string) => {
    if (text[index] === expected) {
      index += 1;
      return true;
    }
    return false;
  };

  const skipWhitespace = () => {
    while (index < length && WHITESPACE.has(text[index])) {
      index += 1;
    }
  };

  const parseLiteral = (literal: string) => {
    for (let i = 0; i < literal.length; i += 1) {
      if (text[index + i] !== literal[i]) {
        fail(`Unexpected token '${text[index + i] ?? ""}'`, index + i);
      }
    }
    index += literal.length;
  };

  const isDigit = (char: string | undefined) =>
    char !== undefined && char >= "0" && char <= "9";

  const parseNumber = () => {
    const start = index;
    if (consume("-")) {
      if (!isDigit(peek())) {
        fail("Invalid number", index);
      }
    }

    if (consume("0")) {
      if (isDigit(peek())) {
        fail("Leading zeros are not allowed in numbers", index);
      }
    } else if (isDigit(peek())) {
      while (isDigit(peek())) {
        index += 1;
      }
    } else {
      fail("Invalid number", index);
    }

    if (consume(".")) {
      if (!isDigit(peek())) {
        fail("Invalid number", index);
      }
      while (isDigit(peek())) {
        index += 1;
      }
    }

    const exponent = peek();
    if (exponent === "e" || exponent === "E") {
      index += 1;
      const sign = peek();
      if (sign === "+" || sign === "-") {
        index += 1;
      }
      if (!isDigit(peek())) {
        fail("Invalid exponent", index);
      }
      while (isDigit(peek())) {
        index += 1;
      }
    }

    if (start === index) {
      fail("Invalid number", index);
    }
  };

  const parseString = () => {
    if (!consume('"')) {
      fail("Expected '\"' to start string", index);
    }

    while (index < length) {
      const char = text[index];
      if (char === '"') {
        index += 1;
        return;
      }
      if (char === "\\") {
        index += 1;
        if (index >= length) {
          fail("Unterminated escape sequence", index - 1);
        }
        const escape = text[index];
        if ('"\\/bfnrt'.includes(escape)) {
          index += 1;
        } else if (escape === "u") {
          const hexStart = index + 1;
          const hexEnd = hexStart + 4;
          if (hexEnd > length) {
            fail("Invalid unicode escape", index);
          }
          const hexDigits = text.slice(hexStart, hexEnd);
          if (!/^[0-9a-fA-F]{4}$/.test(hexDigits)) {
            fail("Invalid unicode escape", index);
          }
          index = hexEnd;
        } else {
          fail(`Invalid escape character '${escape}'`, index);
        }
      } else if (char === "\n" || char === "\r") {
        fail("Unexpected line break in string", index);
      } else {
        index += 1;
      }
    }

    fail("Unterminated string", length - 1);
  };

  const parseArray = () => {
    if (!consume("[")) {
      fail("Expected '[' to start array", index);
    }
    skipWhitespace();
    if (consume("]")) {
      return;
    }

    while (true) {
      parseValue();
      skipWhitespace();
      if (consume("]")) {
        return;
      }
      if (consume(",")) {
        skipWhitespace();
        if (consume("]")) {
          fail("Trailing comma in array", index - 1);
        }
        continue;
      }
      fail("Expected ',' or ']' in array", index);
    }
  };

  const parseObject = () => {
    if (!consume("{")) {
      fail("Expected '{' to start object", index);
    }
    skipWhitespace();
    if (consume("}")) {
      return;
    }

    while (true) {
      if (peek() !== '"') {
        fail("Expected string key", index);
      }
      parseString();
      skipWhitespace();
      if (!consume(":")) {
        fail("Expected ':' after key", index);
      }
      skipWhitespace();
      parseValue();
      skipWhitespace();
      if (consume("}")) {
        return;
      }
      if (consume(",")) {
        skipWhitespace();
        if (consume("}")) {
          fail("Trailing comma in object", index - 1);
        }
        continue;
      }
      fail("Expected ',' or '}' in object", index);
    }
  };

  const parseValue = () => {
    skipWhitespace();
    if (index >= length) {
      fail("Unexpected end of JSON input", length - 1);
    }
    const char = peek();
    switch (char) {
      case '"':
        parseString();
        return;
      case "{":
        parseObject();
        return;
      case "[":
        parseArray();
        return;
      case "t":
        parseLiteral("true");
        return;
      case "f":
        parseLiteral("false");
        return;
      case "n":
        parseLiteral("null");
        return;
      default:
        if (char === "-" || isDigit(char)) {
          parseNumber();
          return;
        }
        fail(`Unexpected token '${char}'`, index);
    }
  };

  try {
    skipWhitespace();
    parseValue();
    skipWhitespace();
    if (index < length) {
      fail("Unexpected trailing characters", index);
    }
    return undefined;
  } catch (error) {
    if (error instanceof JsonSyntaxError) {
      return { position: error.position, message: error.message };
    }
    return undefined;
  }
}
