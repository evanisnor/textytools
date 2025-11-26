import { JSX } from "react";

// Colors for JWT sections (header, payload, signature)
const JWT_SECTION_COLORS = {
  header: "bg-blue-200/60 dark:bg-blue-800/40",
  payload: "bg-green-200/60 dark:bg-green-800/40",
  signature: "bg-purple-200/60 dark:bg-purple-800/40",
};

export function highlightJWT(jwt: string): JSX.Element {
  const parts = jwt.split(".");
  if (parts.length !== 3) {
    return <>{jwt}</>;
  }

  return (
    <>
      <span className={`${JWT_SECTION_COLORS.header} px-0.5`}>{parts[0]}</span>
      <span className="text-zinc-400">.</span>
      <span className={`${JWT_SECTION_COLORS.payload} px-0.5`}>{parts[1]}</span>
      <span className="text-zinc-400">.</span>
      <span className={`${JWT_SECTION_COLORS.signature} px-0.5`}>
        {parts[2]}
      </span>
    </>
  );
}
