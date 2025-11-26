"use client";

import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";
import { TOOL_NAMES } from "@/shared/lib/constants";
import {
  JwtDecoderShell,
  JwtDecoderHeader,
  useJwtDecoder,
} from "@/features/jwt-decoder";

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
