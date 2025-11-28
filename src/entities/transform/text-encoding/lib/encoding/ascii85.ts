/**
 * ASCII85 (Adobe) encoding and decoding transformations
 */

export function toAscii85(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let result = "<~";

    for (let i = 0; i < bytes.length; i += 4) {
      let tuple = 0;
      const count = Math.min(4, bytes.length - i);

      for (let j = 0; j < count; j++) {
        tuple = (tuple << 8) | bytes[i + j];
      }

      // Pad with zeros if needed
      for (let j = count; j < 4; j++) {
        tuple = tuple << 8;
      }

      if (count === 4 && tuple === 0) {
        result += "z";
      } else {
        const encoded: string[] = [];
        let tempTuple = tuple;
        for (let j = 0; j < 5; j++) {
          encoded.push(String.fromCharCode(33 + (tempTuple % 85)));
          tempTuple = Math.floor(tempTuple / 85);
        }
        // Only include count + 1 characters for partial groups
        result += encoded
          .reverse()
          .slice(0, count === 4 ? 5 : count + 1)
          .join("");
      }
    }

    result += "~>";
    return result;
  } catch {
    return "Error: Invalid input for ASCII85 encoding";
  }
}

export function fromAscii85(str: string): string {
  try {
    str = str.trim();
    if (!str.startsWith("<~") || !str.endsWith("~>")) {
      return "Error: Invalid ASCII85 format (missing delimiters)";
    }

    str = str.slice(2, -2);
    const bytes: number[] = [];
    let tuple = 0;
    let count = 0;

    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if (c === "z") {
        if (count !== 0) {
          return "Error: Invalid ASCII85 (z in wrong position)";
        }
        bytes.push(0, 0, 0, 0);
        continue;
      }

      if (c < "!" || c > "u") {
        if (!/\s/.test(c)) {
          return "Error: Invalid ASCII85 character";
        }
        continue;
      }

      tuple = tuple * 85 + (c.charCodeAt(0) - 33);
      count++;

      if (count === 5) {
        for (let j = 3; j >= 0; j--) {
          bytes.push((tuple >> (j * 8)) & 0xff);
        }
        tuple = 0;
        count = 0;
      }
    }

    if (count > 0) {
      for (let i = count; i < 5; i++) {
        tuple = tuple * 85 + 84;
      }
      for (let j = 3; j >= 5 - count; j--) {
        bytes.push((tuple >> (j * 8)) & 0xff);
      }
    }

    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return "Error: Invalid ASCII85 string";
  }
}
