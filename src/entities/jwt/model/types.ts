/**
 * Represents a JWT token in its encoded form or its components.
 * This is the raw structure before decoding.
 */
export interface EncodedJWT {
  [key: string]: unknown;
}

/**
 * Represents a fully decoded JWT with all claims and metadata.
 */
export interface DecodedJWT {
  header: EncodedJWT;
  payload: EncodedJWT;
  signature: string;
  isValid: boolean;
  algorithm?: string;
  expiresAt?: Date;
  issuedAt?: Date;
  notBefore?: Date;
}
