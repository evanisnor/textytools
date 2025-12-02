/**
 * JWT Decode Transform
 * Decodes and validates JSON Web Tokens
 */

import type {
  TransformDefinition,
  TransformResult,
  TransformStat,
} from "../../shared/types";

import { decodeJWT } from "./decoder";

import { isExpired, isNotYetValid, formatDate } from "@/entities/jwt";

export const jwtDecodeDefinition: TransformDefinition = {
  type: "jwt-decode",
  name: "JWT Decode",
  description: "Decode and inspect JSON Web Tokens (JWT)",
  category: "decode",
  acceptsInput: ["text/plain"],
  producesOutput: "application/json",
  propertySchema: [],
  defaultProperties: {},
  execute: (input: string): TransformResult => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const decoded = decodeJWT(input.trim());

      // Build stats array
      const stats: TransformStat[] = [
        { label: "Algorithm", value: decoded.algorithm || "Unknown" },
      ];

      // Check expiration
      if (decoded.expiresAt) {
        const expired = isExpired(decoded.expiresAt);
        stats.push({
          label: "Expires",
          value: formatDate(decoded.expiresAt),
          alert: expired ? "error" : "info",
        } as TransformStat);
        if (expired) {
          stats.push({
            label: "Status",
            value: "Token expired",
            alert: "error",
          } as TransformStat);
        }
      }

      // Check not before
      if (decoded.notBefore) {
        const notYetValid = isNotYetValid(decoded.notBefore);
        stats.push({
          label: "Not Before",
          value: formatDate(decoded.notBefore),
          alert: notYetValid ? "warning" : "info",
        } as TransformStat);
        if (notYetValid) {
          stats.push({
            label: "Status",
            value: "Token not yet valid",
            alert: "warning",
          } as TransformStat);
        }
      }

      // Check issued at
      if (decoded.issuedAt) {
        stats.push({
          label: "Issued At",
          value: formatDate(decoded.issuedAt),
        } as TransformStat);
      }

      // Add validity status if no expiration issues
      if (
        !decoded.expiresAt ||
        (!isExpired(decoded.expiresAt) && !isNotYetValid(decoded.notBefore))
      ) {
        stats.push({
          label: "Status",
          value: "Valid",
          alert: "info",
        } as TransformStat);
      }

      // Format output as pretty JSON
      const output = JSON.stringify(
        {
          header: decoded.header,
          payload: decoded.payload,
          signature: decoded.signature,
        },
        null,
        2,
      );

      return {
        success: true,
        data: output,
        mimeType: "application/json",
        stats,
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `JWT decode failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};
