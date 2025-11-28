"use client";

import { createContext, useContext, ReactNode } from "react";

import { useJwtDecoder } from "./useJwtDecoder";

import type { JWTDecodeResult } from "@/entities/transform/jwt";

interface JwtDecoderContextValue {
  input: string;
  setInput: (value: string) => void;
  result: JWTDecodeResult;
  formattedOutput: string;
}

const JwtDecoderContext = createContext<JwtDecoderContextValue | null>(null);

export function JwtDecoderProvider({ children }: { children: ReactNode }) {
  const value = useJwtDecoder();
  return (
    <JwtDecoderContext.Provider value={value}>
      {children}
    </JwtDecoderContext.Provider>
  );
}

export function useJwtDecoderContext() {
  const context = useContext(JwtDecoderContext);
  if (!context) {
    throw new Error(
      "useJwtDecoderContext must be used within JwtDecoderProvider",
    );
  }
  return context;
}
