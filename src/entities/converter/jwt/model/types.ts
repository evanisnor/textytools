import type { DecodedJWT } from "@/entities/jwt";

export interface JWTDecodeResult {
  success: boolean;
  decoded: DecodedJWT | null;
  error: string | null;
}
