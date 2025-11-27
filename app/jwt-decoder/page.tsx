"use client";

import {
  JwtDecoderShell,
  JwtDecoderHeader,
  useJwtDecoder,
} from "@/features/jwt-decoder";

import { TOOL_NAMES } from "@/shared/lib/constants";
import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";

export default function JWTDecoder() {
  const { result } = useJwtDecoder();

  return (
    <ToolFrame
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens (JWT) with real-time validation"
      toolName={TOOL_NAMES.JWT_DECODER}
      headerRight={<JwtDecoderHeader decoded={result.decoded} />}
    >
      <JwtDecoderShell />
    </ToolFrame>
  );
}
