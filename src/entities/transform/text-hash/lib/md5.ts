/**
 * MD5 hash transformation
 *
 * Note: MD5 is cryptographically broken and should not be used for security purposes.
 * This implementation is for compatibility and non-security use cases only.
 */

import { md5cycle, md5blk, rhex } from "./md5-utils";

export function toMd5(str: string): string {
  function md51(s: string) {
    const n = s.length;
    const state = [1732584193, -271733879, -1732584194, 271733878];
    let i;
    for (i = 64; i <= n; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) {
      tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
    }
    tail[i >> 2] |= 0x80 << (i % 4 << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  try {
    const h = md51(str);
    return rhex(h[0]) + rhex(h[1]) + rhex(h[2]) + rhex(h[3]);
  } catch {
    return "Error: MD5 hashing failed";
  }
}
