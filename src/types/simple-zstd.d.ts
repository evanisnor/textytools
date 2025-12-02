/**
 * Type declarations for simple-zstd
 * No official @types package available
 */

declare module "simple-zstd" {
  export function compress(
    data: Uint8Array,
    level?: number,
  ): Promise<Uint8Array>;
  export function decompress(data: Uint8Array): Promise<Uint8Array>;
}
