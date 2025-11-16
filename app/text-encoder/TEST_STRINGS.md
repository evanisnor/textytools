# Text Encoder Test Strings

## Test String for Encoding

Use this string to test all encoding formats. It contains:

- Basic ASCII characters
- Special characters for HTML/URL encoding
- Numbers and punctuation
- Characters that create interesting patterns in binary/hex/morse

```
Hello World! Test 123
```

### Expected Outputs:

**Base64:**

```
SGVsbG8gV29ybGQhIFRlc3QgMTIz
```

**Base58:**

```
2NEpo7TZRhna7vSvL
```

**Base91:**

```
>OwJh>Io0Tv!lE0EjYO6
```

**ASCII85:**

```
<~87cURD]i,"Ebo7~>
```

**Z85 (Note: requires 4-byte alignment):**

```
Test input: "Test"
Output: w]zP9
```

**URL Encoding:**

```
Hello%20World!%20Test%20123
```

**HTML Entities:**

```
Hello World! Test 123
```

(No special HTML chars in this example)

**Hexadecimal:**

```
48 65 6c 6c 6f 20 57 6f 72 6c 64 21 20 54 65 73 74 20 31 32 33
```

**Binary:**

```
01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100 00100001 00100000 01010100 01100101 01110011 01110100 00100000 00110001 00110010 00110011
```

**Unicode Escape:**

```
Hello World! Test 123
```

(No non-ASCII chars)

**Quoted-Printable:**

```
Hello World! Test 123
```

**ROT13:**

```
Uryyb Jbeyq! Grfg 123
```

**Morse Code:**

```
.... . .-.. .-.. --- / .-- --- .-. .-.. -.. -.-.-- / - . ... - / .---- ..--- ...--
```

**MD5 Hash:**

```
ed076287532e86365e841e92bfc50d8c
```

**SHA-1 Hash:**

```
7b502c3a1f48c8609ae212cdfb639dee39673f5e
```

**SHA-256 Hash:**

```
a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e
```

**SHA-512 Hash:**

```
8ba760cac29cb2b2ce66858ead169174057aa1298ccd581514e6db6dee3285280ee6e3a54c9319071dc8165ff061d77783100d449c937ff1fb4cd1bb516a69b9
```

---

## Test Strings for Decoding

### Base64 Decode Test:

```
VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==
```

**Expected:** `The quick brown fox jumps over the lazy dog`

### Base58 Decode Test:

```
2NEpo7TZRhna7vSvL
```

**Expected:** `Hello World! Test 123`

### Base91 Decode Test:

```
>OwJh>Io0Tv!lE0EjYO6
```

**Expected:** `Hello World! Test 123`

### ASCII85 Decode Test:

```
<~87cURD]i,"Ebo7~>
```

**Expected:** `Hello World! Test 123`

### Z85 Decode Test:

```
w]zP9
```

**Expected:** `Test`

### URL Decode Test:

```
https%3A%2F%2Fexample.com%2Fpath%3Fquery%3Dvalue%26foo%3Dbar%20baz
```

**Expected:** `https://example.com/path?query=value&foo=bar baz`

### HTML Entities Decode Test:

```
&lt;div class=&quot;example&quot;&gt;Hello &amp; Goodbye&lt;/div&gt;
```

**Expected:** `<div class="example">Hello & Goodbye</div>`

### Hexadecimal Decode Test:

```
48 65 78 20 44 65 63 6f 64 65 21
```

**Expected:** `Hex Decode!`

### Binary Decode Test:

```
01000010 01101001 01101110 01100001 01110010 01111001
```

**Expected:** `Binary`

### Unicode Escape Decode Test:

```
Hello \u4e16\u754c (World in Chinese)
```

**Expected:** `Hello 世界 (World in Chinese)`

### Quoted-Printable Decode Test:

```
Hello=20World=21=0D=0AThis=20is=20a=20test.
```

**Expected:** `Hello World!\r\nThis is a test.`

### ROT13 Decode Test:

```
Gur Ratntr Pbqr vf EBG13
```

**Expected:** `The Engage Code is ROT13`

### Morse Code Decode Test:

```
.... . .-.. .-.. --- / .-- --- .-. .-.. -..
```

**Expected:** `HELLO WORLD`

---

## Complex Multi-Format Test

This string is useful for testing multiple conversions:

```
JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

When decoded from Base64, this reveals the JWT header:

```json
{ "alg": "HS256", "typ": "JWT" }
```

---

## Edge Cases to Test

### Empty String

- All formats should handle gracefully

### Very Long String (1000+ chars)

- Test performance with large inputs

### Unicode Characters

```
Hello 世界 🌍 مرحبا мир
```

- Tests UTF-8 handling in Base64
- Tests Unicode escape sequences

### Invalid Inputs for Decoding

**Invalid Base64:**

```
This is not base64!!!
```

**Invalid Hex:**

```
ZZ YY XX
```

**Invalid Binary:**

```
01012345
```

**Invalid URL Encoding:**

```
%ZZ%YY
```
