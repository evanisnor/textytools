export interface JWTPayload {
  [key: string]: unknown;
}

export interface DecodedJWT {
  header: JWTPayload;
  payload: JWTPayload;
  signature: string;
  isValid: boolean;
  algorithm?: string;
  expiresAt?: Date;
  issuedAt?: Date;
  notBefore?: Date;
}

export interface JWTDecodeResult {
  success: boolean;
  decoded: DecodedJWT | null;
  error: string | null;
}
