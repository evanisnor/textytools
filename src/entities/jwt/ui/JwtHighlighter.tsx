import { JSX } from "react";

// Colors for JWT sections (header, payload, signature)
const JWT_SECTION_COLORS = {
  header: "text-blue-700 dark:text-blue-300",
  payload: "text-green-700 dark:text-green-300",
  signature: "text-purple-700 dark:text-purple-300",
};

/**
 * Highlights JWT token sections with color-coding.
 * Returns the token as-is if it's not a valid 3-part JWT.
 */
export function highlightJWT(jwt: string): JSX.Element {
  const parts = jwt.split(".");
  if (parts.length !== 3) {
    return <>{jwt}</>;
  }

  return (
    <>
      <span className={JWT_SECTION_COLORS.header}>{parts[0]}</span>
      <span className="text-zinc-400">.</span>
      <span className={JWT_SECTION_COLORS.payload}>{parts[1]}</span>
      <span className="text-zinc-400">.</span>
      <span className={JWT_SECTION_COLORS.signature}>{parts[2]}</span>
    </>
  );
}
